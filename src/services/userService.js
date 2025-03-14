import { StatusCodes } from "http-status-codes";
import { userModal } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import bcrypjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";

const createNew = async (reqBody) => {
  try {
    //Kiểm tra email tồn tại hay chưa
    const existUser = await userModal.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }

    //Tạo data để lưu vào database
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcrypjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail, //default, update later
      verifyToken: uuidv4(),
    };

    //Lưu tt user vào database
    const createdUser = await userModal.createNew(newUser);
    const getNewUser = await userModal.findOneById(createdUser.insertedId);

    //Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject = "Please Verify Your Email Address";
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Welcome to Our Service!</h2>
          <p>Hi there,</p>
          <p>Thanks for signing up! To get started, please verify your email address by clicking the link below:</p>
          <p style="text-align: center;">
            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Your Email</a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2980b9;">${verificationLink}</p>
          <p>If you didn’t create an account with us, feel free to ignore this email.</p>
          <p>We’re excited to have you on board!</p>
          <p>Sincerely,<br>Andiez<br>Team</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply directly.</p>
        </div>
      </body>
      </html>
    `;
    // Gọi tới Provider gửi mail
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);

    //return trả về dữ liệu cho Controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    //Querry user trong Database
    const existUser = await userModal.findOneByEmail(reqBody.email);

    //Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");
    if (existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active"
      );

    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid");
    }

    //OK --> update user to verify acc
    const updateData = {
      isActive: true,
      verifyToken: null,
    };

    const updatedUser = await userModal.update(existUser._id, updateData);

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    //Querry user trong Database
    const existUser = await userModal.findOneByEmail(reqBody.email);

    //Các bước kiểm tra cần thiết
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");

    if (!existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active"
      );

    if (!bcrypjs.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your Email or Password is incorrect"
      );
    }

    /* OK -> tạo Token đăng nhập trả về cho FE */

    //tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
    };

    //Tạo ra 2 loại token accessToken và refreshToken để trả về FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    );

    //Trả về thông tin user kèm theo 2 token vừa tạo
    return { accessToken, refreshToken, ...pickUser(existUser) };
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (clientRefreshToken) => {
  console.log("🚀 ~ refreshToken ~ clientRefreshToken:", clientRefreshToken);
  try {
    //Verify / giải mã token xem có hợp lý không
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    console.log(
      "🚀 ~ refreshToken ~ refreshTokenDecoded:",
      refreshTokenDecoded
    );

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5 //5 giây test accessToken hết hạn
      env.ACCESS_TOKEN_LIFE // 1 hour
    );
    console.log("🚀 ~ refreshToken ~ accessToken:", accessToken);

    return { accessToken };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
};

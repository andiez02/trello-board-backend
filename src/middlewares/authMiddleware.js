import { StatusCodes } from "http-status-codes";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";
import ApiError from "~/utils/ApiError";

//Xác thực JWT accessToken nhận được từ phía FE có hợp lệ hay ko

const isAuthorized = async (req, res, next) => {
  // Lấy accessToken nằm trong request cookies phía client = withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken;

  //Nếu clientAccessToken không tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (token not found)")
    );
    return;
  }

  try {
    //? 1. Giải mã token xem có hợp lệ hay ko
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    //? 2. Quan trọng: Nếu token hợp lệ, --> lưu thông tin giải mã vào req.jwtDecoded, để sd ở các tầng sau
    req.jwtDecoded = accessTokenDecoded;

    //? 3. Cho phép request đi tiếp
    next();
  } catch (error) {
    // Nếu acceessToken hết hạn (expired) thì cần trả về một mã lỗi cho FE --> call api refreshToken
    if (error?.message?.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token."));
      return;
    }

    // Nếu accessToken không hợp lệ --> 401 --> sign_out
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
  }
};

export const authMiddleware = { isAuthorized };

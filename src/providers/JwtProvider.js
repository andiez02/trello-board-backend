import JWT from "jsonwebtoken";

// Function tạo mới 1 Token - cần 3 tham số đầu vào
//     userInfo: thông tin đính kèm vào Token
//     secretSignature: Chữ kí bí mật (random string) // privateKey
//     tokenLife: thời gian sống của Token

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

// Function kiểm tra token có hợp lệ hay không
// ->> token được tạo ra có đúng với secretSignature trong dự án hay ko
const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature);
  } catch (error) {
    throw new Error(error);
  }
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};

import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    console.log("🚀 ~ createNew ~ req.body:", req.body);
    console.log("🚀 ~ createNew ~ req.query:", req.query);
    console.log("🚀 ~ createNew ~ req.params:", req.params);
    console.log("🚀 ~ createNew ~ req.files:", req.files);
    console.log("🚀 ~ createNew ~ req.cookies:", req.cookies);
    console.log("🚀 ~ createNew ~ req.jwtDecoded:", req.jwtDecoded);
    //Điều hướng dữ liệu sang tầng Service

    throw new ApiError(StatusCodes.BAD_GATEWAY, "Error tesst");
    //Có kết quả =>> trả về Client
    // res
    //   .status(StatusCodes.CREATED)
    //   .json({ message: "POS form Controller: API create list board" });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};

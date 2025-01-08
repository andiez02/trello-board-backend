import { StatusCodes } from "http-status-codes";

const createNew = async (req, res, next) => {
  try {
    console.log("🚀 ~ createNew ~ req.body:", req.body);
    console.log("🚀 ~ createNew ~ req.query:", req.query);
    console.log("🚀 ~ createNew ~ req.params:", req.params);
    console.log("🚀 ~ createNew ~ req.files:", req.files);
    console.log("🚀 ~ createNew ~ req.cookies:", req.cookies);
    console.log("🚀 ~ createNew ~ req.jwtDecoded:", req.jwtDecoded);
    //Điều hướng dữ liệu sang tầng Service

    //Có kết quả =>> trả về Client

    res
      .status(StatusCodes.CREATED)
      .json({ message: "POS form Controller: API create list board" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message,
    });
  }
};

export const boardController = {
  createNew,
};

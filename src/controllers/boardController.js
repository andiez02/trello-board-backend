import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    // console.log("🚀 ~ createNew ~ req.body:", req.body);
    // console.log("🚀 ~ createNew ~ req.query:", req.query);
    // console.log("🚀 ~ createNew ~ req.params:", req.params);
    // console.log("🚀 ~ createNew ~ req.files:", req.files);
    // console.log("🚀 ~ createNew ~ req.cookies:", req.cookies);
    // console.log("🚀 ~ createNew ~ req.jwtDecoded:", req.jwtDecoded);

    //Điều hướng dữ liệu sang tầng Service
    const createdBoard = await boardService.createNew(req.body);

    //Có kết quả =>> trả về Client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};

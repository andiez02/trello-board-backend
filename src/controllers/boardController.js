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

const getDetails = async (req, res, next) => {
  try {
    // console.log("🚀 ~ createNew ~ req.params:", req.params);
    const boardId = req.params.id;
    const board = await boardService.getDetails(boardId);

    //Có kết quả =>> trả về Client
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  console.log("🚀 ~ update ~ req:", req);
  try {
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);

    //Có kết quả =>> trả về Client
    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
};

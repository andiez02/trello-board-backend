import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  console.log("🚀 ~ update ~ req:", req);
  try {
    const columnId = req.params.id;
    const updatedColumn = await columnService.update(columnId, req.body);

    //Có kết quả =>> trả về Client
    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
  update,
};

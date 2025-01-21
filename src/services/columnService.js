import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody,
    };

    const createdColumn = await columnModel.createNew(newColumn);
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      //Xử lí cấu trúc data trước khi trả dữ liệu về
      getNewColumn.cards = [];

      //Cập nhật mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedData = await columnModel.update(columnId, updateData);

    return updatedData;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId);

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Column not found");
    }

    //Delete Column
    await columnModel.deleteOneById(columnId);

    //Delete all Cards
    await cardModel.deleteManyByColumnId(columnId);

    //Delete columnId in ColumnIds of Board
    await boardModel.pullColumnOrderIds(targetColumn);

    return { deleteResult: "Column and its card delete successfully" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem,
};

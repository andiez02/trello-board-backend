import { boardModel } from "~/models/boardModel";
import { columnModel } from "~/models/columnModel";

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

export const columnService = {
  createNew,
  update,
};

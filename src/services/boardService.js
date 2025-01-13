import { slugify } from "~/utils/formatters";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lí logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard);
    // console.log("🚀 ~ createNew ~ createdBoard:", createdBoard);

    //Lấy bản ghi board sau khi goi (cần hoặc không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    // console.log("🚀 ~ createNew ~ getNewBoard:", getNewBoard);

    //Làm thêm các xử lý logic khác với các Collection khác tuỳ đặc thù dự án...
    //Bắn email, notification về cho admin khi có 1 board mới được lập

    //Trả về kết quả, trong Service luôn phải có return
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }

    //Clone board ra 1 cái mới để xử lý
    const resBoard = cloneDeep(board);
    //Đưa card về đúng column của nó
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.equals(column._id) //equals cua MongoDB
      );

      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );
    });
    //Xoá mảng cards khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
};

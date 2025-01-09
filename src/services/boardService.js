import { slugify } from "~/utils/formatters";

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    //Xử lí logic dữ liệu
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title),
    };

    //Gọi tới tầng Model để xử lý lưu bản ghi newBoard vào trong Database

    //Làm thêm các xử lý logic khác với các Collection khác tuỳ đặc thù dự án...
    //Bắn email, notification về cho admin khi có 1 board mới được lập

    //Trả về kết quả, trong Service luôn phải có return
    return newBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
};

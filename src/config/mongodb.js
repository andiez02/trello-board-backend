import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

//? Khởi tạo một đối tượng trelloDatabaseInstace band đầu là null (vì chưa connect)
let trelloDatabaseInstance = null;

//? Khởi tạo đối tượng mongoClientInstance đẻ connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//Kết nối database
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  //* Kết nối thành công => lấy ra database và gán vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

//? Function GET_FB (not async) -> export ra Trello Database Instance sau khi connect thành công tới MongoDB để sử dụng
//! Phải đảm bảo chỉ gọi getDB sau khi kết nối thành công tới Mongo
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error("Must connect to database first");
  return trelloDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

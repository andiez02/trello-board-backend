import express from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import { CLOSE_DB, CONNECT_DB, GET_DB } from "./config/mongodb";
import { env } from "./config/environment";
import { APIs_V1 } from "./routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";

const START_SERVER = () => {
  const app = express();

  app.use(cors(corsOptions));

  //Enable req.body json data
  app.use(express.json());

  //use API v1
  app.use("/v1", APIs_V1);

  //Middleware xử lí lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.get("/", async (req, res) => {
    console.log(await GET_DB().listCollections().toArray());
    res.end("<h1>Hello World!</h1><hr>");
  });

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello ${env.AUTHOR}, Backend Server is running at ${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  //Cleanup trước khi dừng server
  exitHook(() => {
    console.log("Disconnecting from MongoDB Cloud Atlas");
    CLOSE_DB();
    console.log("Disconnected from MongoDB Cloud Atlas");
  });
};

//? IIFE
(async () => {
  try {
    console.log("Connecting to MongoDB Atlas");
    await CONNECT_DB();
    console.log("Connected to MongoDB Atlas");

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// //* Chỉ khi kết nối tới database thì mới start Server Backend
// console.log("Connecting to MongoDB Atlas");
// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB Cloud Atlas"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });

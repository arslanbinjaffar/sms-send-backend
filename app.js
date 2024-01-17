import userRouter from "./routes/user.js";
import MessageRouter from "./routes/Propermessage.js";
import { ConnectToMONGODB } from "./db.js";
import { Log } from "./models/log.js";
import dotenv from "dotenv"
// import  fileUpload from "express-fileupload";
import express from "express"
import cors from "cors"
import adminRouter from './routes/admin.js'
import  sendMessagesOnebyOne  from './sendmessages/sendmessage.js';

const app = express();

dotenv.config();
ConnectToMONGODB();
app.use(cors({ origin: "*" }));
app.use(express.static("uploads"));
app.use(express.json({ limit: "25mb" }));
// app.use(fileUpload());

//Logging middleware
/**
 * @param Request {req}
 */

const logMiddleware = async (req, res, next) => {
  try {
    await Log.insertMany([
      {
        reqData : {
          body: req.body,
          baseUrl: req.baseUrl,
          FileName: req.file.filename,
        },
      },
    ]);
    next();
  } catch (error) {
    error.message = "LOG CREATE ERROR";
    next(error);
  }
};

// app.use(logMiddleware);

app.use("/file", MessageRouter);
app.use("/client", userRouter);
app.use("/admin", adminRouter)
app.get("/", async (req, res) => {
  return res.status(200).json({message:"HELLO AMAZON WEB SERVICES PIPELINES"});
});

app.use(async (err, req, res, next) => {
    await Log.deleteMany()
  await Log.create({
    error: "ERROR",
    errData: err,
  });
  return res.status(500).json({ error: err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

const userRouter = require("./routes/user");
const MessageRouter = require("./routes/Propermessage");
const { ConnectToMONGODB } = require("./db");
const { Log } = require("./models/log");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const express = require("express");
dotenv.config();
ConnectToMONGODB();
const cors = require("cors");
const app = express();
app.use(express.static("uploads"));
app.use(fileUpload());
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "25mb" }));

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
app.use("/user", userRouter);
app.get("/", async (req, res) => {
  return res.send("hello world");
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

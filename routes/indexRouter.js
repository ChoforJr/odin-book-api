import { Router } from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRounter.js";
import commentRouter from "./commentRouter.js";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/post", postRouter);
indexRouter.use("/comment", commentRouter);

export default indexRouter;

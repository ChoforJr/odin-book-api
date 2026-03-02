import { Router } from "express";
import { addNewComment } from "../controllers/add.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { validateCommentRules } from "../validations/validateComment.js";

const commentRouter = Router();

commentRouter.post(
  "/:postID",
  validateCommentRules,
  checkValidationResult,
  addNewComment,
);

export default commentRouter;

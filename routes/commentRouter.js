import { Router } from "express";
import { addNewComment } from "../controllers/add.js";
import { editLikingComments } from "../controllers/edit.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import {
  validateCommentRules,
  validateCommentIDRules,
} from "../validations/validateComment.js";

const commentRouter = Router();

commentRouter.post(
  "/:postID",
  validateCommentRules,
  checkValidationResult,
  addNewComment,
);

commentRouter.patch(
  "/like",
  validateCommentIDRules,
  checkValidationResult,
  editLikingComments,
);

export default commentRouter;

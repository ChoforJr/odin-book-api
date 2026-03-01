import { Router } from "express";
import { addNewPost, addNewComment } from "../controllers/add.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { validateCommentRules } from "../validations/validateComment.js";
import { validatePostRules } from "../validations/validatePost.js";

const postAndCommentRouter = Router();

postAndCommentRouter.post(
  "/post",
  validatePostRules,
  checkValidationResult,
  addNewPost,
);
postAndCommentRouter.post(
  "/comment/:postID",
  validateCommentRules,
  checkValidationResult,
  addNewComment,
);

export default postAndCommentRouter;

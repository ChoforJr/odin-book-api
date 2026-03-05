import { Router } from "express";
import { addNewPost } from "../controllers/add.js";
import {
  readUserPosts,
  readCommentedPosts,
  readLikedPosts,
  readIndexedPosts,
  readTrendingPosts,
} from "../controllers/read.js";
import { editLikingPosts } from "../controllers/edit.js";
import { removePost } from "../controllers/remove.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import {
  validatePostRules,
  validatePostIDRules,
} from "../validations/validatePost.js";

const postRouter = Router();

postRouter.post(
  "/textOnly",
  validatePostRules,
  checkValidationResult,
  addNewPost,
);

postRouter.get("/mine", readUserPosts);
postRouter.get("/commented", readCommentedPosts);
postRouter.get("/liked", readLikedPosts);
postRouter.get("/index", readIndexedPosts);
postRouter.get("/trending", readTrendingPosts);

postRouter.patch(
  "/like",
  validatePostIDRules,
  checkValidationResult,
  editLikingPosts,
);

postRouter.delete("/:postID", removePost);

export default postRouter;

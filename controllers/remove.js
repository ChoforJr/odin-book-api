import {
  deleteUserByID,
  deletePost,
  deleteComment,
} from "../prisma_queries/delete.js";
import { findProfileByUserID } from "../prisma_queries/find.js";
import { v2 as cloudinary } from "cloudinary";

export async function removeUserSelf(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be deleted");
    }
    const file = await deleteUserByID(req.user.id);
    if (!file) {
      return res.sendStatus(200);
    }
    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removePost(req, res, next) {
  try {
    const post = await deletePost(
      req.user.profileID,
      Number(req.params.postID),
    );
    if (post === "not found") {
      return res.status(404).json("Post not found");
    }
    if (post === "wrong user") {
      return res.status(403).json("You are not authorized to delete this post");
    }
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeComment(req, res, next) {
  try {
    const comment = await deleteComment(
      req.user.profileID,
      Number(req.params.commentID),
    );
    if (comment === "not found") {
      return res.status(404).json("Comment not found");
    }
    if (comment === "wrong user") {
      return res
        .status(403)
        .json("You are not authorized to delete this comment");
    }
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

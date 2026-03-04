import { body } from "express-validator";
import { findProfileByID, findPostByID } from "../prisma_queries/find.js";

export const validatePostRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4, max: 800 })
    .withMessage("Content has to have a length of between 4 and 800"),
];

export const validateProfileIDRules = [
  body("profileID")
    .trim()
    .isNumeric()
    .withMessage("Profile ID: Should be a number")
    .isLength({ min: 1 })
    .withMessage("Profile ID: Has to have a minimum length of 1")
    .custom(async (value) => {
      const profile = await findProfileByID(Number(value));
      if (!profile) {
        throw new Error("Profile ID: Does not exist");
      }
      return true;
    }),
];

export const validatePostIDRules = [
  body("postID")
    .trim()
    .isNumeric()
    .withMessage("Post ID: Should be a number")
    .isLength({ min: 1 })
    .withMessage("Post ID: Has to have a minimum length of 1")
    .custom(async (value) => {
      const post = await findPostByID(Number(value));
      if (!post) {
        throw new Error("Post ID: Does not exist");
      }
      return true;
    }),
];

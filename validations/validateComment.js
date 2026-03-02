import { body } from "express-validator";
import { findCommentByID } from "../prisma_queries/find.js";

export const validateCommentRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4 })
    .withMessage("Content has to have a minimum of 4 characters"),
];

export const validateCommentIDRules = [
  body("commentID")
    .trim()
    .isNumeric()
    .withMessage("Comment ID: Should be a number")
    .isLength({ min: 1 })
    .withMessage("Comment ID: Has to have a minimum length of 1")
    .custom(async (value) => {
      const comment = await findCommentByID(Number(value));
      if (!comment) {
        throw new Error("Comment ID: Does not exist");
      }
      return true;
    }),
];

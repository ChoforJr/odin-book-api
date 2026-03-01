import { deleteUserByID } from "../prisma_queries/delete.js";
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

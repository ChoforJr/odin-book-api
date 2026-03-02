import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
  updateFollowing,
  changeProfilePhoto,
  updateLikingPost,
  updateLikingComment,
} from "../prisma_queries/update.js";
import { findProfileByUserID } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export async function editUserName(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newUsername } = matchedData(req);
    const usernameLowerCase = newUsername.toLowerCase();
    await updateUsername(req.user.id, usernameLowerCase);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPassword(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newPassword } = matchedData(req);
    const hashedPassword = await hash(newPassword, 10);
    await updatePassword(req.user.id, hashedPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisplayName(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newDisplayName } = matchedData(req);
    await updateDisplayName(req.user.id, newDisplayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editBio(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be edited");
    }
    const { newBio } = matchedData(req);
    await updateBio(req.user.id, newBio);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editFollowing(req, res, next) {
  try {
    const { contactId } = matchedData(req);
    await updateFollowing(Number(req.user.profileID), Number(contactId));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editProfilePhoto(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new Error("File upload failed, no files object found."));
    }
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests Profile Photo cannot be changed");
    }
    const data = [];
    req.files.forEach((file) => {
      data.push({
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: file.path,
        ProfileId: Number(req.user.profileID),
      });
    });
    const oldFile = await changeProfilePhoto(Number(req.user.profileID), data);
    if (!oldFile) {
      return res.sendStatus(200);
    }
    await cloudinary.uploader.destroy(oldFile.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editLikingPosts(req, res, next) {
  try {
    const { postID } = matchedData(req);
    await updateLikingPost(Number(req.user.profileID), Number(postID));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editLikingComments(req, res, next) {
  try {
    const { commentID } = matchedData(req);
    await updateLikingComment(Number(req.user.profileID), Number(commentID));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

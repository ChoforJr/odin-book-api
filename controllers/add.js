import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { findGuest } from "../prisma_queries/find.js";
import {
  createGuest,
  createUser,
  createPost,
  createComment,
} from "../prisma_queries/create.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

async function addGuest() {
  const guestInfo = [
    {
      username: "goku@gmail.com",
      password: "1234",
      displayName: "Goku",
      bio: "Hi, am Goku, the strongest warrior in the universe. I am a Saiyan from the planet Vegeta and I have saved the world countless times. I am always looking for new challenges and adventures.",
    },
    {
      username: "vegeta@gmail.com",
      password: "1234",
      displayName: "Vegeta",
      bio: "I am Vegeta, the prince of all Saiyans. I am a proud warrior and I will stop at nothing to become the strongest in the universe. I have a fierce rivalry with kakarot, but deep down I respect him as a fellow warrior.",
    },
  ];
  try {
    const checkGuest = await findGuest();
    if (checkGuest && checkGuest.length > 0) {
      return console.log("Guest Already exist");
    }
    for (const guest of guestInfo) {
      const { username, password, displayName, bio } = guest;
      const hashedPassword = await hash(password, 10);
      await createGuest(username, hashedPassword, displayName, bio);
    }
    return console.log("Guest created");
  } catch (err) {
    return console.error(err);
  }
}
addGuest();

export async function addNewUser(req, res, next) {
  try {
    const { username, password, displayName } = matchedData(req);
    const hashedPassword = await hash(password, 10);
    const usernameLowerCase = username.toLowerCase();
    await createUser(usernameLowerCase, hashedPassword, displayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function addNewPost(req, res, next) {
  try {
    const { content } = matchedData(req);
    await createPost(content, req.user.profileID);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function addNewComment(req, res, next) {
  try {
    const { content } = matchedData(req);
    const postId = Number(req.params.postID);
    await createComment(content, req.user.profileID, postId);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

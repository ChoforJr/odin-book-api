import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { findGuest, findUserByUsername } from "../prisma_queries/find.js";
import {
  createGuest,
  createOtherUser,
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

async function addOtherUsers() {
  const OtherInfo = [
    {
      username: "gohan@gmail.com",
      password: "1234",
      displayName: "Gohan",
      bio: "Hi, am Gohan, the son of Goku. I am a Saiyan and I have inherited my father's love for fighting and adventure. I am a skilled martial artist and I have fought alongside my father to protect the world from various threats.",
    },
    {
      username: "trunks@gmail.com",
      password: "1234",
      displayName: "Trunks",
      bio: "I am Trunks, the son of Vegeta and Bulma. I am a Saiyan and I have inherited my father's love for fighting and adventure. I am a skilled martial artist and I have fought alongside my father to protect the world from various threats.",
    },
    {
      username: "goten@gmail.com",
      password: "1234",
      displayName: "Goten",
      bio: "I am Goten, the most talented and powerful of all the Saiyan children. I am the son of Goku and Chi-Chi, and I have inherited my father's love for fighting and adventure. I am a skilled martial artist and I have fought alongside my father to protect the world from various threats.",
    },
    {
      username: "krillin@gmail.com",
      password: "1234",
      displayName: "Krillin",
      bio: "I am Krillin, a close friend of Goku and a skilled martial artist. I have been fighting alongside Goku for many years and have helped protect the world from various threats.",
    },
    {
      username: "piccolo@gmail.com",
      password: "1234",
      displayName: "Piccolo",
      bio: "I am Piccolo, a Namekian warrior and the reincarnation of the evil Namekian dragon. I have been fighting alongside Goku and his friends for many years and have helped protect the world from various threats.",
    },
    {
      username: "naruto@gmail.com",
      password: "1234",
      displayName: "Naruto",
      bio: "I am Naruto, the strongest ninja in the village, and I am the son of the Fourth Hokage. I have a dream of becoming the Hokage and I will stop at nothing to achieve it.",
    },
    {
      username: "sasuke@gmail.com",
      password: "1234",
      displayName: "Sasuke",
      bio: "I am Sasuke, the strongest ninja in the village, and I am the son of the Uchiha clan. I have a dream of avenging my clan and I will stop at nothing to achieve it.",
    },
  ];
  try {
    const userPromises = OtherInfo.map(async (other) => {
      const { username, password, displayName, bio } = other;
      const checkUser = await findUserByUsername(username);
      if (checkUser) {
        return;
      }
      const hashedPassword = await hash(password, 10);
      await createOtherUser(username, hashedPassword, displayName, bio);
    });

    // Execute all operations simultaneously
    await Promise.all(userPromises);
    console.log("Other Users created successfully");
  } catch (err) {
    return console.error(err);
  }
}
addOtherUsers();

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

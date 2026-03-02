import {
  findUserByID,
  findProfileByUserID,
  findProfiles,
  findFollowings,
  findFollowers,
  findFriends,
  findUserPosts,
  findCommentedPost,
  findLikedPost,
} from "../prisma_queries/find.js";
import { matchedData } from "express-validator";

export async function readUserByID(req, res, next) {
  try {
    const user = await findUserByID(req.user.id);
    if (!user) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json(user);
  } catch (err) {
    return next(err);
  }
}

export async function readProfileByUserId(req, res, next) {
  try {
    const profile = await findProfileByUserID(Number(req.params.id));
    if (!profile) {
      return res.json({
        error: "This user doesn't exist",
      });
    }
    res.json(profile);
  } catch (err) {
    return next(err);
  }
}

export async function readFollowings(req, res, next) {
  try {
    const followings = await findFollowings(req.user.id);
    res.json(followings);
  } catch (err) {
    return next(err);
  }
}

export async function readFollowers(req, res, next) {
  try {
    const followers = await findFollowers(req.user.id);
    res.json(followers);
  } catch (err) {
    return next(err);
  }
}

export async function exploreProfiles(req, res, next) {
  try {
    const profiles = await findFriends(req.user.profileID);
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readProfiles(req, res, next) {
  try {
    const profiles = await findProfiles();
    res.json(profiles);
  } catch (err) {
    return next(err);
  }
}

export async function readUserPosts(req, res, next) {
  try {
    const { profileID } = matchedData(req);
    const posts = await findUserPosts(Number(profileID));
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readCommentedPosts(req, res, next) {
  try {
    const { profileID } = matchedData(req);
    const posts = await findCommentedPost(Number(profileID));
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readLikedPosts(req, res, next) {
  try {
    const { profileID } = matchedData(req);
    const posts = await findLikedPost(Number(profileID));
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

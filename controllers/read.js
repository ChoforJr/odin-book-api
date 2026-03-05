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
  findIndexPosts,
  findTrendingPosts,
  findPostComments,
} from "../prisma_queries/find.js";

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
    const posts = await findUserPosts(req.user.profileID);
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readCommentedPosts(req, res, next) {
  try {
    const posts = await findCommentedPost(req.user.profileID);
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readLikedPosts(req, res, next) {
  try {
    const posts = await findLikedPost(req.user.profileID);
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readIndexedPosts(req, res, next) {
  try {
    const posts = await findIndexPosts(req.user.profileID);
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readTrendingPosts(req, res, next) {
  try {
    const posts = await findTrendingPosts();
    res.json(posts);
  } catch (err) {
    return next(err);
  }
}

export async function readPostComments(req, res, next) {
  try {
    const comments = await findPostComments(Number(req.params.postID));
    res.json(comments);
  } catch (err) {
    return next(err);
  }
}

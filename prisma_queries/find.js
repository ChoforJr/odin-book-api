import prisma from "../config/prisma.js";

export async function findGuest() {
  const profile = await prisma.profile.findMany({
    where: { type: "guest" },
    orderBy: {
      id: "desc",
    },
  });
  return profile;
}

export async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: { username: username },
    include: {
      profile: true,
    },
  });
  return user;
}

export async function findUserByID(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
      profile: {
        include: {
          photo: true,
        },
      },
    },
  });
  return user;
}

export async function findProfileByUserID(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
  });
  return profile;
}

export async function findProfileByID(profileID) {
  const profile = await prisma.profile.findUnique({
    where: {
      id: profileID,
    },
  });
  return profile;
}

export async function findFollowings(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
    select: {
      following: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return profile;
}

export async function findFollowers(userID) {
  const profile = await prisma.profile.findUnique({
    where: {
      userId: userID,
    },
    select: {
      followedBy: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return profile;
}

export async function findFriends(profileID) {
  const profiles = await prisma.profile.findMany({
    where: {
      AND: [
        {
          id: { not: profileID },
        },
        {
          followedBy: {
            none: { id: profileID },
          },
        },
      ],
    },
    include: {
      photo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return profiles;
}

export async function findProfiles() {
  const profiles = await prisma.profile.findMany({
    include: {
      photo: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return profiles;
}

export async function findUserPosts(profileID) {
  const posts = await prisma.post.findMany({
    where: {
      profileId: profileID,
    },
    include: {
      comments: true,
      likedBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function findCommentedPost(profileID) {
  const posts = await prisma.post.findMany({
    where: {
      comments: {
        some: {
          profileId: profileID,
        },
      },
    },
    include: {
      comments: true,
      likedBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function findLikedPost(profileID) {
  const posts = await prisma.post.findMany({
    where: {
      likedBy: {
        some: {
          id: profileID,
        },
      },
    },
    include: {
      comments: true,
      likedBy: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
}

export async function findPostByID(postID) {
  const post = await prisma.post.findUnique({
    where: {
      id: postID,
    },
  });
  return post;
}

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
          _count: {
            select: { following: true, followedBy: true },
          },
        },
      },
    },
  });
  return {
    ...user,
    profilePhoto: user?.profile?.photo?.url || null,
    profileDisplayName: user?.profile?.displayName || null,
    profileType: user?.profile?.type || null,
    followingCount: user?.profile?._count?.following || 0,
    followersCount: user?.profile?._count?.followedBy || 0,
    profile: undefined,
  };
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return profile.following.map((profile) => ({
    ...profile,
    profilePhoto: profile?.photo?.url || null,
    photo: undefined,
  }));
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return profile.followedBy.map((profile) => ({
    ...profile,
    profilePhoto: profile?.photo?.url || null,
    photo: undefined,
  }));
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
  return profiles.map((profile) => ({
    ...profile,
    profilePhoto: profile?.photo?.url || null,
    photo: undefined,
  }));
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
  return profiles.map((profile) => ({
    ...profile,
    profilePhoto: profile?.photo?.url || null,
    photo: undefined,
  }));
}

export async function findUserPosts(profileID) {
  const posts = await prisma.post.findMany({
    where: {
      profileId: profileID,
    },
    include: {
      _count: {
        select: { likedBy: true, comments: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likedBy,
    commentCount: post._count.comments,
    profilePhoto: post.profile?.photo?.url || null,
    profileDisplayName: post.profile.displayName,
    profileType: post.profile.type,
    profile: undefined,
    _count: undefined,
  }));
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
      _count: {
        select: { likedBy: true, comments: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likedBy,
    commentCount: post._count.comments,
    profilePhoto: post.profile?.photo?.url || null,
    profileDisplayName: post.profile.displayName,
    profileType: post.profile.type,
    profile: undefined,
    _count: undefined,
  }));
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
      _count: {
        select: { likedBy: true, comments: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likedBy,
    commentCount: post._count.comments,
    profilePhoto: post.profile?.photo?.url || null,
    profileDisplayName: post.profile.displayName,
    profileType: post.profile.type,
    profile: undefined,
    _count: undefined,
  }));
}

export async function findPostByID(postID) {
  const post = await prisma.post.findUnique({
    where: {
      id: postID,
    },
  });
  return post;
}

export async function findCommentByID(commentID) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentID,
    },
  });
  return comment;
}

export async function findPostComments(postID) {
  const comments = await prisma.comment.findMany({
    where: {
      postId: postID,
    },
    include: {
      _count: {
        select: { likedBy: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map((comment) => ({
    ...comment,
    likeCount: comment._count.likedBy,
    profilePhoto: comment.profile?.photo?.url || null,
    profileDisplayName: comment.profile.displayName,
    profileType: comment.profile.type,
    profile: undefined,
    _count: undefined,
  }));
}

export async function findIndexPosts(profileID) {
  const user = await prisma.profile.findUnique({
    where: { id: profileID },
    select: {
      following: {
        select: { id: true },
      },
    },
  });

  const followingIds = user?.following.map((f) => f.id) || [];
  const authorIds = [profileID, ...followingIds];

  const posts = await prisma.post.findMany({
    where: {
      profileId: { in: authorIds },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 40,
    include: {
      _count: {
        select: { likedBy: true, comments: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likedBy,
    commentCount: post._count.comments,
    profilePhoto: post.profile?.photo?.url || null,
    profileDisplayName: post.profile.displayName,
    profileType: post.profile.type,
    profile: undefined,
    _count: undefined,
  }));
}

export async function findTrendingPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      likedBy: {
        _count: "desc",
      },
    },
    take: 100,
    include: {
      _count: {
        select: { likedBy: true, comments: true },
      },
      profile: {
        include: {
          photo: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likedBy,
    commentCount: post._count.comments,
    profilePhoto: post.profile?.photo?.url || null,
    profileDisplayName: post.profile.displayName,
    profileType: post.profile.type,
    profile: undefined,
    _count: undefined,
  }));
}

import prisma from "../config/prisma.js";

export async function createGuest(username, password, displayName, bio) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
          bio: bio,
          type: "guest",
        },
      },
    },
  });
}

export async function createUser(username, password, displayName) {
  await prisma.user.create({
    data: {
      username: username,
      password: password,
      profile: {
        create: {
          displayName: displayName,
        },
      },
    },
  });
}

export async function createPost(content, profileID) {
  const post = await prisma.post.create({
    data: {
      content: content,
      profileId: profileID,
    },
  });
  return post;
}

export async function createComment(content, profileID, postId) {
  const comment = await prisma.comment.create({
    data: {
      content: content,
      profileId: profileID,
      postId: postId,
    },
  });
  return comment;
}

import prisma from "../config/prisma.js";

export async function deleteUserByID(userID) {
  return await prisma.$transaction(async (tx) => {
    const file = await tx.files.findUnique({
      where: { ProfileId: userID },
    });

    await tx.user.delete({
      where: {
        id: userID,
      },
    });

    return file;
  });
}

export async function deletePost(profileID, postId) {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return "not found";
    }

    if (post.profileId !== profileID) {
      return "wrong user";
    }

    await tx.post.delete({
      where: {
        id: postId,
      },
    });
    return "done";
  });
}

export async function deleteComment(profileID, commentID) {
  return await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.findUnique({
      where: { id: commentID },
    });

    if (!comment) {
      return "not found";
    }

    if (comment.profileId !== profileID) {
      return "wrong user";
    }

    await tx.comment.delete({
      where: {
        id: commentID,
      },
    });
    return "done";
  });
}

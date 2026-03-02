import prisma from "../config/prisma.js";

export async function updateBio(userId, newBio) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      bio: newBio,
    },
  });
}

export async function updateDisplayName(userId, newDisplayName) {
  await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: {
      displayName: newDisplayName,
    },
  });
}

export async function updateUsername(userId, newUsername) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      username: newUsername,
    },
  });
}

export async function updatePassword(userId, newPassword) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPassword,
    },
  });
}

export async function updateFollowing(profileID, contactId) {
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: {
        id: profileID,
      },
      select: {
        following: {
          where: {
            id: contactId,
          },
        },
      },
    });

    if (profile.following.length > 0) {
      await tx.profile.update({
        where: {
          id: profileID,
        },
        data: {
          following: {
            disconnect: { id: contactId },
          },
        },
      });
      return;
    }
    await tx.profile.update({
      where: {
        id: profileID,
      },
      data: {
        following: {
          connect: { id: contactId },
        },
      },
    });
    return;
  });
}

export async function changeProfilePhoto(profileID, data) {
  return await prisma.$transaction(async (tx) => {
    const oldFile = await tx.files.findUnique({
      where: { ProfileId: profileID },
    });

    if (!oldFile) {
      await tx.files.createMany({
        data,
        skipDuplicates: true,
      });
      return null;
    }

    await tx.files.delete({
      where: {
        id: oldFile.id,
      },
    });

    await tx.files.createMany({
      data,
      skipDuplicates: true,
    });

    return oldFile;
  });
}

export async function updateLikingPost(profileID, postID) {
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: {
        id: profileID,
      },
      select: {
        likedPosts: {
          where: {
            id: postID,
          },
        },
      },
    });

    if (profile.likedPosts.length > 0) {
      await tx.profile.update({
        where: {
          id: profileID,
        },
        data: {
          likedPosts: {
            disconnect: { id: postID },
          },
        },
      });
      return;
    }
    await tx.profile.update({
      where: {
        id: profileID,
      },
      data: {
        likedPosts: {
          connect: { id: postID },
        },
      },
    });
    return;
  });
}

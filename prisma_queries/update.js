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

export async function addConnect(profileID, contactId) {
  await prisma.profile.update({
    where: {
      id: profileID,
    },
    data: {
      followedBy: {
        connect: { id: contactId },
      },
      following: {
        connect: { id: contactId },
      },
    },
  });
}

export async function removeConnect(profileID, contactId) {
  await prisma.profile.update({
    where: {
      id: profileID,
    },
    data: {
      followedBy: {
        disconnect: { id: contactId },
      },
      following: {
        disconnect: { id: contactId },
      },
    },
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

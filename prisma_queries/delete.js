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

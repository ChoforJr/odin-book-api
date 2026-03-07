import prisma from "../config/prisma.js";
import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";

export async function seedGuests() {
  const existingFakers = await prisma.profile.findMany({
    where: { type: "faker" },
    select: { id: true },
  });

  if (existingFakers.length > 0) {
    console.log("⚠️ Fake users already exist. Skipping seed.");
    return;
  }

  console.log("🌱 Starting database seed...");

  const createdProfiles = [];

  for (let i = 0; i < 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await hash(faker.internet.password(), 10);

    const user = await prisma.user.create({
      data: {
        username: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        profile: {
          create: {
            displayName: `${firstName} ${lastName}`,
            bio: faker.person.bio(),
            type: "faker",
            photo: {
              create: {
                url: faker.image.avatar(),
                originalName: `${firstName}-${lastName}`,
                fileName: "unknown",
                mimeType: "unknown",
                size: 123,
              },
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });

    createdProfiles.push(user.profile);
  }
  console.log(`✅ Created 10 fake users and profiles.`);

  const createdPosts = [];

  for (const profile of createdProfiles) {
    for (let j = 0; j < 5; j++) {
      const post = await prisma.post.create({
        data: {
          content: faker.lorem.paragraph({ min: 2, max: 5 }),
          profileId: profile.id,
        },
        select: { id: true },
      });
      createdPosts.push(post);
    }
  }
  console.log(`✅ Created ${createdPosts.length} fake posts.`);

  const createdComments = [];

  for (const profile of createdProfiles) {
    for (const post of createdPosts) {
      for (let k = 0; k < 3; k++) {
        const comment = await prisma.comment.create({
          data: {
            content: faker.lorem.sentence({ min: 3, max: 10 }),
            profileId: profile.id,
            postId: post.id,
          },
          select: { id: true },
        });
        createdComments.push(comment);
      }
    }
  }
  console.log(`✅ Created ${createdComments.length} fake comments.`);

  const profileConnectIds = createdProfiles.map((p) => ({ id: p.id }));

  for (const profile of createdProfiles) {
    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        likedPosts: {
          connect: createdPosts,
        },
        likedComments: {
          connect: createdComments,
        },
        following: {
          connect: profileConnectIds.filter((p) => p.id !== profile.id),
        },
      },
    });
  }
  console.log(`✅ Profiles successfully updated with likes and follows.`);
  console.log("🎉 Seeding complete!");
}

seedGuests()
  .then(() => async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import prisma from "../src/prisma.js";

async function main() {
  console.log("🌱 Seeding database...");

  /* ===================== USERS ===================== */

  const teacher = await prisma.user.create({
    data: {
      name: "Dr. Alice",
      email: "alice@college.edu",
      role: "staffMember",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Bob Student",
      email: "31242199@vupune.ac.in",
      role: "student",
      image:
        "https://media.cnn.com/api/v1/images/stellar/prod/220611102335-steph-curry-finals-game-4.jpg?c=16x9&q=h_833,w_1480,c_fill",
      emailVerified: new Date(),
      registrationId: "31240710002",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Charlie Student",
      email: "31245199@vupune.ac.in",
      role: "student",
    },
  });

  /* ===================== DEPARTMENT ===================== */

  const department = await prisma.department.create({
    data: {
      name: "Computer Science",
    },
  });

  /* ===================== COURSE ===================== */

  const course = await prisma.course.create({
    data: {
      name: "Data Structures",
      code: "CS101",
      departmentId: department.id,
      teachersIds: [teacher.id],
      studentsIds: [student1.id, student2.id],
    },
  });

  /* ===================== CHAT ===================== */

  const chat = await prisma.chat.create({
    data: {
      type: "course",
      course: {
        connect: { code: course.code },
      },
    },
  });

  /* ===================== CHAT MEMBERS ===================== */

  await prisma.chatMember.createMany({
    data: [
      {
        chatId: chat.id,
        userId: teacher.id,
        role: "staffMember",
      },
      {
        chatId: chat.id,
        userId: student1.id,
        role: "student",
      },
      {
        chatId: chat.id,
        userId: student2.id,
        role: "student",
      },
    ],
  });

  /* ===================== MEDIA ===================== */

  const imageMedia = await prisma.media.create({
    data: {
      cloudinary_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      size: "245kb",
      name: "lecture-slide",
      file_extension: "jpg",
      resource_type: "image",
      public_id: "sample",
      status: "completed",
      associate: "chat",
    },
  });

  /* ===================== MESSAGES ===================== */

  const message1 = await prisma.message.create({
    data: {
      senderId: teacher.id,
      chatId: chat.id,
      content: "Welcome to CS101! Please check the course materials.",
      deliveredAt: new Date(),
    },
  });

  const message2 = await prisma.message.create({
    data: {
      senderId: student1.id,
      chatId: chat.id,
      content: "Thank you, looking forward to it!",
      deliveredAt: new Date(),
      readAt: new Date(),
      replyToId: message1.id,
    },
  });

  await prisma.message.create({
    data: {
      senderId: teacher.id,
      chatId: chat.id,
      content: "Here is the first lecture slide.",
      mediaId: imageMedia.id,
      deliveredAt: new Date(),
    },
  });

  /* ===================== LINK ===================== */

  await prisma.link.create({
    data: {
      courseId: course.id,
      chatId: chat.id,
      associate: "zoomLink",
      createdBy: teacher.id,
      startsAt: new Date(Date.now() + 1000 * 60 * 60),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 2),
    },
  });

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

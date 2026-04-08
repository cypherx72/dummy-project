import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { CreateTaskSchema, type CreateTaskValues } from "./schema.js";

export async function CreateTask(
  _: unknown,
  { input }: { input: CreateTaskValues },
  context: contextType,
) {
  const { prisma, req } = context;

  console.log(input);
  // Validate input
  const { success, data, error } = CreateTaskSchema.safeParse({ ...input });

  if (!success) {
    console.log(error);
    throw GraphQLCustomLError({
      message: "Failed to validate task data.",
      status: 400,
      code: "VALIDATION_ERROR",
    });
  }
  console.log(data.dueDate, typeof data.dueDate);
  if (!req?.user) {
    throw new GraphQLError("Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    });

    if (!user) {
      throw new GraphQLError("User not found");
    }

    // if (user.role !== "TEACHER" && user.role !== "ADMIN") {
    //   throw new GraphQLError("You are not authorized to create tasks");
    // }

    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        dueDate: new Date(data.dueDate),
        courseId: "1",
        createdById: user.id,
        maxMarks: data.maxPoints,
        submissionType: data.submissionType,
      },
    });

    console.log(assignment);

    // ✅ Handle attachments properly
    if (data.attachments && data.attachments.length > 0) {
      await prisma.media.createMany({
        data: data.attachments.map((file) => ({
          url: file.url, // or whatever fields you have
          assignmentId: assignment.id, // 🔥 THIS IS KEY
        })),
      });
    }

    return {
      status: 200,
      message: "Task created successfully.",
      code: "TASK_CREATED",
      // assignment,
    };
  } catch (err) {
    if (err instanceof GraphQLError) {
      throw err;
    }

    console.log(err);
    throw GraphQLCustomLError({
      message: "We couldn't create the task. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}

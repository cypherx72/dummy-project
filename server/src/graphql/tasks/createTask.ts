import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { CreateTaskSchema, type CreateTaskValues } from "./schema.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function CreateAssignment(
  _: unknown,
  { input }: { input: CreateTaskValues },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

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

  console.log(data);

  try {
    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        dueDate: new Date(data.dueDate),
        courseId: data.courseId,
        createdById: user.id,
        maxMarks: data.maxPoints,
        submissionType: data.submissionType,
      },
    });

    if (data.attachments && data.attachments.length > 0) {
      await prisma.media.createMany({
        data: data.attachments.map((file) => ({
          cloudinary_url: file.cloudinaryUrl,
          size: file.bytes,
          name: file.name,
          file_extension: file.fileExtension,
          resource_type: file.resourceType,
          public_id: file.publicId,
          associate: "task",
          assignmentId: assignment.id,
        })),
      });
    }

    return {
      status: 200,
      message: "Assignment created successfully.",
      code: "ASSIGNMENT_CREATED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    console.log(err);
    throw GraphQLCustomLError({
      message: "We couldn't create the assignment. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}

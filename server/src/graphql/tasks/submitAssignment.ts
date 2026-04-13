import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import {
  SubmitAssignmentSchema,
  type SubmitAssignmentFormValues,
} from "../../lib/ZodSchema.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

export async function SubmitAssignment(
  _: unknown,
  { input }: { input: SubmitAssignmentFormValues },
  context: contextType,
) {
  const { prisma, currentUser } = context;

  const user = requireAuth(currentUser);
  requireRole(user, "student");

  console.log("user", user, "received the following data: ", input);
  // Validate input
  const { success, data, error } = SubmitAssignmentSchema.safeParse({
    submissionType: {
      fileUpload: input.attachments,
      textEntry: input.textEntry,
      websiteUrl: input.websiteUrl,
    },
  });

  if (!success) {
    console.log(error);
    throw GraphQLCustomLError({
      message: "Failed to validate assignment data.",
      status: 400,
      code: "VALIDATION_ERROR",
    });
  }

  console.log(data);

  try {
    // create a submission

    // upload assignments if any
    if (data.attachments && data.attachments.length > 0) {
      await prisma.media.createMany({
        data: data.attachments.map((file) => ({
          cloudinary_url: file.cloudinaryUrl,
          size: file.bytes.toString(),
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
      message: "Assignment submitted successfully.",
      code: "ASSIGNMENT_SUBMITTED_SUCCESSFULLY",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;

    console.log(err);
    throw GraphQLCustomLError({
      message: "We couldn't submit the assignment. Please try again later.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}

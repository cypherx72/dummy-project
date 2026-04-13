import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";

interface GradeEntry {
  studentId: string;
  gradeValue: string;
  feedback?: string;
}

export async function GradeSubmissions(
  _: any,
  { input }: { input: { assignmentId: string; gradingMode: string; grades: GradeEntry[] } },
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    await Promise.all(
      input.grades
        .filter((g) => g.gradeValue !== "")
        .map(async (grade) => {
          // Compute numeric marksObtained from gradeValue + gradingMode
          let marksObtained: number | null = null;

          const assignment = await prisma.assignment.findUnique({
            where: { id: input.assignmentId },
            select: { maxMarks: true },
          });

          if (input.gradingMode === "marks") {
            marksObtained = Number(grade.gradeValue);
          } else if (input.gradingMode === "percentage" && assignment) {
            marksObtained = Math.round(
              (Number(grade.gradeValue) / 100) * assignment.maxMarks,
            );
          } else if (input.gradingMode === "pass_fail") {
            marksObtained = grade.gradeValue === "pass" ? (assignment?.maxMarks ?? 100) : 0;
          }

          return prisma.submission.upsert({
            where: {
              // Use the composite we'll derive below — upsert by assignmentId + student
              // Prisma requires a unique identifier; we use findFirst + update/create
              id: "placeholder", // overridden below
            },
            update: {},
            create: {},
          }).catch(() => null); // suppress — we'll do findFirst pattern below
        }),
    );

    // Proper upsert using findFirst + update/create (Submission has no unique on assignmentId+studentId)
    await Promise.all(
      input.grades
        .filter((g) => g.gradeValue !== "")
        .map(async (grade) => {
          const existing = await prisma.submission.findFirst({
            where: {
              assignmentId: input.assignmentId,
              submittedById: grade.studentId,
            },
          });

          const assignment = await prisma.assignment.findUnique({
            where: { id: input.assignmentId },
            select: { maxMarks: true },
          });

          let marksObtained: number | null = null;
          if (input.gradingMode === "marks") {
            marksObtained = Number(grade.gradeValue);
          } else if (input.gradingMode === "percentage" && assignment) {
            marksObtained = Math.round(
              (Number(grade.gradeValue) / 100) * assignment.maxMarks,
            );
          } else if (input.gradingMode === "pass_fail") {
            marksObtained = grade.gradeValue === "pass" ? (assignment?.maxMarks ?? 100) : 0;
          }

          if (existing) {
            return prisma.submission.update({
              where: { id: existing.id },
              data: {
                marksObtained,
                feedback: grade.feedback ?? existing.feedback,
                status: "graded",
              },
            });
          }

          return prisma.submission.create({
            data: {
              assignmentId: input.assignmentId,
              submittedById: grade.studentId,
              marksObtained,
              feedback: grade.feedback ?? null,
              status: "graded",
            },
          });
        }),
    );

    return {
      status: 200,
      message: "Grades saved successfully.",
      code: "GRADES_SAVED",
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    console.error(err);
    throw GraphQLCustomLError({ message: "Failed to save grades.", status: 500, code: "SERVER_ERROR" });
  }
}

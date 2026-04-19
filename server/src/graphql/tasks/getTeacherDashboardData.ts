import { GraphQLCustomLError } from "../../lib/error.js";
import { GraphQLError } from "graphql";
import { type contextType } from "../../lib/types.js";
import { requireAuth, requireRole } from "../../lib/guards.js";
import { GetNotifications } from "./getNotifications.js";
import { GetUpcomingEvents } from "./getUpcomingEvents.js";

export async function GetTeacherDashboardData(
  _: any,
  __: any,
  context: contextType,
) {
  const { prisma, currentUser } = context;
  const user = requireAuth(currentUser);
  requireRole(user, "teacher", "admin");

  try {
    const [courses, assignments, notifications, events] = await Promise.all([
      prisma.course.findMany({
        where: { teacherId: user.id },
        select: {
          id: true,
          name: true,
          code: true,
          description: true,
          departmentId: true,
          teacherId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.assignment.findMany({
        where: { createdById: user.id },
        include: {
          course: { select: { id: true, name: true, code: true } },
          teacher: { select: { id: true, name: true } },
          submissions: {
            select: {
              id: true,
              status: true,
              submittedAt: true,
              marksObtained: true,
            },
          },
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      GetNotifications(_, __, context),
      GetUpcomingEvents(_, __, context),
    ]);

    // Teacher metrics: pending (no/few submissions), total, graded
    const pending = assignments.filter(
      (a) => a.submissions.length === 0,
    ).length;
    const submitted = assignments.reduce(
      (acc, a) =>
        acc + a.submissions.filter((s) => s.status === "submitted").length,
      0,
    );
    const graded = assignments.reduce(
      (acc, a) =>
        acc + a.submissions.filter((s) => s.status === "graded").length,
      0,
    );

    return {
      status: 200,
      message: "Teacher dashboard data fetched successfully.",
      code: "TEACHER_DASHBOARD_FETCHED",
      courses,
      assignments,
      notifications: notifications.notifications,
      events: events.events,
      metrics: { pending, submitted, graded, total: assignments.length },
    };
  } catch (err) {
    if (err instanceof GraphQLError) throw err;
    throw GraphQLCustomLError({
      message: "We couldn't load your dashboard. Please try again.",
      status: 500,
      code: "SERVER_ERROR",
    });
  }
}

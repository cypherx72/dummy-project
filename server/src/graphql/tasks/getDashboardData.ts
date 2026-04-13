import { GetUserCourses } from "../tasks/getUserCourses.js";
import { GetRecentActivities } from "../tasks/getRecentActivities.js";
import { GetAssignments } from "../tasks/getAssignmentsDue.js";
import { GetNotifications } from "../tasks/getNotifications.js";
import { GetUpcomingEvents } from "../tasks/getUpcomingEvents.js";
import { GetTodaysTasks } from "../tasks/getTodayTasks.js";

import { type contextType } from "../../lib/types.js";

export async function GetDashboardData(_: any, __: any, context: contextType) {
  console.log("...running in dashboarddata");
  const [courses, activities, assignments, notifications, events, tasks] =
    await Promise.all([
      GetUserCourses(_, {}, context),
      GetRecentActivities(_, {}, context),
      GetAssignments(_, {}, context),
      GetNotifications(_, {}, context),
      GetUpcomingEvents(_, {}, context),
      GetTodaysTasks(_, {}, context),
    ]);

  console.log("courses", courses);
  console.log("activities", activities);
  console.log("assignmetns", assignments);
  console.log("notifications", notifications);
  console.log("events", events);
  console.log("tasks", tasks);

  return {
    status: 200,
    message: "Dashboard data fetched successfully.",
    code: "DASHBOARD_FETCHED",
    courses: courses.courses,
    activities: activities.activities,
    assignments: assignments.assignments,
    notifications: notifications.notifications,
    events: events.events,
    tasks: tasks.tasks,
  };
}

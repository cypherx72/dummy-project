"use client";
import AssignmentsCard from "./assignment-card";
import { WeekCalendar } from "./week-calendar";
import NotificationsCard from "./notifications-card";
import AICard from "./ai-card";
import CourseCard from "./course-card";
import { RecentActivityTable } from "./recent-activity-tab";
import TodaysTasks from "./today-task";
import CalendarEvents from "./calendar-events";
import UserCard from "./user-card";

export default function CardImage() {
  return (
    <main className="flex flex-col justify-end items-end gap-4 p-3 w-full font-sans">
      <div className="flex flex-row justify-between items-start gap-4 p-2 border-1 rounded-md w-full h-[50vh] overflow-hidden">
        <section className="flex flex-col justify-start items-start gap-2 bg-none p-2 rounded-md w-1/3 h-full">
          <UserCard />
        </section>

        <section className="flex flex-col justify-start items-start gap-2 bg-none p-2 border-1 rounded-md w-1/3 h-full overflow-hidden">
          <TodaysTasks />
        </section>

        <section className="flex flex-col justify-start items-start p-2 border-1 rounded-md w-1/3 h-full overflow-hidden">
          <NotificationsCard />
        </section>

        <section className="flex flex-col justify-start items-start gap-2 p-2 border-1 rounded-md w-1/3 h-full">
          <h3 className="font-semibold text-zinc-500 tracking-wide">
            Calendar Events
          </h3>
          <WeekCalendar />
          <CalendarEvents />
        </section>
      </div>

      <div className="flex flex-row items-start gap-3 p-3 border-1 rounded-md w-full overflow-hidden">
        <div className="p-2 border-1 rounded-md w-2/5 h-full">
          <AssignmentsCard />
        </div>
        <div className="p-2 border-1 rounded-md w-3/5 h-full">
          <CourseCard />
        </div>
      </div>

      <div className="flex flex-row items-start gap-3 p-3 border-1 rounded-md w-full h-[45vh] overflow-hidden">
        <div className="w-3/5">
          <RecentActivityTable />
        </div>
        <div className="w-2/5">
          <AICard />
        </div>
      </div>
    </main>
  );
}

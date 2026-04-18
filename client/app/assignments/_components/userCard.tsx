import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { WeekCalendar } from "@/app/dashboard/tasks/week-calendar";
import { useSession } from "@/context/session-context";
import { format } from "date-fns";
import CalendarEvents from "@/app/dashboard/tasks/calendar-events";

function getGreeting(name: string) {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return `Good morning, ${name}! ☀️`;
  if (hour >= 12 && hour < 18) return `Good afternoon, ${name}! 👋`;

  return `Good evening, ${name}! 🌙`;
}

export default function UserCard() {
  const { user } = useSession();
  const name = user?.name.split(" ")[0];

  return (
    <Card className="pb-0 border-none w-full user-card">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col gap-1 font-semibold text-3xl leading-tight">
            <p className="text-zinc-300 text-xs tracking-wide">
              {format(new Date(), "PP")}
            </p>
            <p className="text-lg">{getGreeting(name as string)}</p>
          </CardTitle>
        </div>

        <CardDescription className="text-zinc-300 text-sm tracking-wide">
          You have completed 84% of your assignments.
        </CardDescription>
      </CardHeader>

      <CardContent />
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSession } from "@/context/session-context";
import { format } from "date-fns";

function getGreeting(name: string) {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
  if (hour >= 12 && hour < 18) return `Good afternoon, ${name}`;

  return `Good evening, ${name}`;
}

export default function UserCard() {
  const { user } = useSession();
  const name = user?.name?.split(" ")[0] ?? "Student";

  return (
    <Card className="border-none w-full user-card">
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <p className="text-zinc-300/80 text-xs tracking-wide">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
          <CardTitle className="font-semibold text-lg md:text-xl text-white text-balance">
            {getGreeting(name)}
          </CardTitle>
        </div>
        <CardDescription className="text-zinc-200/80 text-sm mt-1">
          You have completed 84% of your assignments.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0" />
    </Card>
  );
}

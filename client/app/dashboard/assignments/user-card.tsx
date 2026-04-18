import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSession } from "@/context/session-context";

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
    <Card className="bg-gradient-to-br from-indigo-500 via-blue-900 to-stone-950 shadow-md backdrop-blur-sm border-none w-full max-w-md h-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="flex flex-col gap-3 font-semibold text-3xl leading-tight">
            <p>{getGreeting(name as string)}</p>
            <p className="text-zinc-300">What are your plans for today?</p>
          </CardTitle>
        </div>

        <CardDescription className="text-muted-foreground text-sm">
          Organize your notes, manage tasks, and keep everything you need in one
          place.
        </CardDescription>
      </CardHeader>

      <CardContent />
    </Card>
  );
}

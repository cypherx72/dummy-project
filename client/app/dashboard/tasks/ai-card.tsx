import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function AICard() {
  return (
    <Card className="relative bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 shadow-lg backdrop-blur-md border border-white/10 overflow-hidden">
      {/* subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

      <CardHeader className="flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400" size={18} />
          <CardTitle className="font-semibold text-lg">
            CampusPilot AI
          </CardTitle>
        </div>

        <CardAction>
          <Button size="sm" variant="secondary">
            Ask AI
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        <CardDescription className="text-zinc-300 text-sm leading-relaxed">
          Your intelligent campus assistant. Ask questions about assignments,
          schedules, courses, or collaborate with classmates faster. CampusPilot
          helps you stay organized and productive throughout your semester.
        </CardDescription>
      </CardContent>

      <CardFooter className="text-zinc-400 text-xs">
        Powered by CampusAI
      </CardFooter>
    </Card>
  );
}

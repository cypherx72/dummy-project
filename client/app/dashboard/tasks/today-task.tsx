import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
  {
    task: "Submit Database Systems Assignment",
    time: "Before 11:59 PM",
  },
  {
    task: "Attend Machine Learning Lecture",
    time: "10:00 AM",
  },
  {
    task: "Attend Machine Learning Lecture",
    time: "10:00 AM",
  },

  {
    task: "Review Data Structures Quiz Material",
    time: "2:00 PM",
  },
  {
    task: "Attend Machine Learning Lecture",
    time: "10:00 AM",
  },
  {
    task: "Check new course announcements",
    time: "Anytime",
  },
];

export default function TodaysTasks() {
  return (
    <div className="flex flex-col gap-2 py-1 border-none w-full">
      <CardHeader>
        <CardTitle className="font-semibold text-zinc-500 tracking-wide">
          Today&apos;s Tasks
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 px-0 h-4/5 overflow-hidden overflow-y-auto scroll-py-0.5 no-scrollbar">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex justify-between items-center hover:bg-white/5 p-3 border border-white/10 rounded-lg transition"
          >
            <div className="flex items-center gap-3">
              <Checkbox />

              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{task.task}</p>

                <p className="text-muted-foreground text-xs">{task.time}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}

import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const upcomingEvents = [
  {
    title: "Finals Week Extended Hours",
    date: "Feb 10-17",
    time: "Open 24 hours",
  },
  {
    title: "Author Meet & Greet",
    date: "Feb 14",
    time: "3:00 PM",
  },
  {
    title: "Study Room Reservations Open",
    date: "Feb 16",
    time: "9:00 AM",
  },
  {
    title: "Library Orientation",
    date: "Feb 22",
    time: "11:00 AM",
  },
];
const EventsSidebar = () => {
  return (
    <div className="bg-card p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-base">Upcoming Events</h3>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {upcomingEvents.map((event, index) => (
          <div
            key={index}
            className="group bg-secondary hover:bg-muted p-3 rounded-lg transition-colors cursor-pointer"
          >
            <p className="font-medium group-hover:text-primary text-sm transition-colors">
              {event.title}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default EventsSidebar;

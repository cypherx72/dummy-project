import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const events = [
  {
    title: "Academic Writing Workshop",
    date: "Feb 12, 2026",
    time: "2:00 PM",
    location: "Room 201",
    attendees: 45,
    type: "Workshop",
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    title: "Book Club: Modern Classics",
    date: "Feb 15, 2026",
    time: "4:00 PM",
    location: "Reading Lounge",
    attendees: 28,
    type: "Book Club",
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    title: "Research Database Training",
    date: "Feb 18, 2026",
    time: "10:00 AM",
    location: "Computer Lab",
    attendees: 32,
    type: "Training",
    color: "bg-green-500/20 text-green-400",
  },
  {
    title: "Poetry Reading Night",
    date: "Feb 20, 2026",
    time: "6:00 PM",
    location: "Main Hall",
    attendees: 67,
    type: "Event",
    color: "bg-orange-500/20 text-orange-400",
  },
];
const LibraryEvents = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Library Events & Workshops</h3>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="group bg-card hover:bg-card-hover p-4 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <Badge className={`text-xs ${event.color} border-0`}>
                {event.type}
              </Badge>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Users className="w-3 h-3" />
                <span>{event.attendees}</span>
              </div>
            </div>

            <h4 className="mb-2 font-semibold group-hover:text-primary text-sm transition-colors">
              {event.title}
            </h4>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                <span>
                  {event.date} • {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <MapPin className="w-3 h-3" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LibraryEvents;

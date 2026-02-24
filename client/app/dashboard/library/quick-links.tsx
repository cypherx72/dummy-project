import {
  Search,
  Clock,
  BookOpen,
  CalendarDays,
  HelpCircle,
  Printer,
} from "lucide-react";
const links = [
  { title: "Search Catalog", icon: Search },
  { title: "Library Hours", icon: Clock },
  { title: "Reserve Books", icon: BookOpen },
  { title: "Room Booking", icon: CalendarDays },
  { title: "Printing Services", icon: Printer },
  { title: "Ask a Librarian", icon: HelpCircle },
];
const QuickLinks = () => {
  return (
    <div className="bg-card p-4 rounded-xl">
      <h3 className="mb-4 font-semibold text-base">Quick Links</h3>
      <div className="gap-2 grid grid-cols-2">
        {links.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <div
              key={index}
              className="group flex items-center gap-2 bg-secondary hover:bg-muted p-3 rounded-lg transition-colors cursor-pointer"
            >
              <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium group-hover:text-primary text-xs transition-colors">
                {link.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default QuickLinks;

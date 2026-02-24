import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const tutors = [
  {
    name: "Dr. Emily Parker",
    specialty: "Research Methods",
    rating: 4.9,
    available: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    name: "Prof. David Lee",
    specialty: "Academic Writing",
    rating: 4.8,
    available: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    name: "Maria Santos",
    specialty: "Citation Help",
    rating: 4.7,
    available: false,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    name: "James Wilson",
    specialty: "Study Skills",
    rating: 4.9,
    available: true,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  },
];
const TutorsSection = () => {
  return (
    <div className="bg-card p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-base">Available Tutors</h3>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {tutors.map((tutor, index) => (
          <div
            key={index}
            className="group flex items-center gap-3 hover:bg-secondary p-2 rounded-lg transition-colors cursor-pointer"
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={tutor.avatar} />
                <AvatarFallback>
                  {tutor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {tutor.available && (
                <span className="right-0 bottom-0 absolute bg-success border-2 border-card rounded-full w-3 h-3" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-primary text-sm truncate transition-colors">
                {tutor.name}
              </p>
              <p className="text-muted-foreground text-xs truncate">
                {tutor.specialty}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="fill-yellow-500 w-3 h-3 text-yellow-500" />
              <span>{tutor.rating}</span>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-full text-xs">
        Book a Session
      </Button>
    </div>
  );
};
export default TutorsSection;

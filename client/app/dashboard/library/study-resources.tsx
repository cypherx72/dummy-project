import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  FileText,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const resources = [
  {
    title: "Exam Preparation Guide",
    subject: "Study Skills",
    views: "12.5k views",
    badge: "Popular",
    color: "bg-blue-500/20",
    icon: GraduationCap,
  },
  {
    title: "Research Paper Writing",
    subject: "Academic Writing",
    views: "8.2k views",
    badge: "New",
    color: "bg-green-500/20",
    icon: FileText,
  },
  {
    title: "Citation & References",
    subject: "Research Skills",
    views: "6.8k views",
    badge: "Essential",
    color: "bg-purple-500/20",
    icon: BookOpen,
  },
  {
    title: "Study Group Templates",
    subject: "Collaboration",
    views: "4.3k views",
    badge: "Trending",
    color: "bg-yellow-500/20",
    icon: Lightbulb,
  },
  {
    title: "Note-Taking Methods",
    subject: "Study Skills",
    views: "9.1k views",
    badge: "Popular",
    color: "bg-emerald-500/20",
    icon: FileText,
  },
  {
    title: "Time Management Tips",
    subject: "Productivity",
    views: "7.6k views",
    badge: "Essential",
    color: "bg-orange-500/20",
    icon: Lightbulb,
  },
];
const StudyResources = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Study Resources & Guides</h3>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2">
        {resources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <div
              key={index}
              className="group flex justify-between items-center bg-card hover:bg-card-hover p-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${resource.color} flex items-center justify-center`}
                >
                  <IconComponent className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium group-hover:text-primary text-sm transition-colors">
                    {resource.title}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <BookOpen className="w-3 h-3" />
                    <span>{resource.subject}</span>
                    <span>•</span>
                    <span>{resource.views}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {resource.badge}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StudyResources;

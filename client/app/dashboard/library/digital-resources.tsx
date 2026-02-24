import {
  ArrowRight,
  Database,
  Globe,
  FileSearch,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/button";
const digitalResources = [
  {
    title: "JSTOR",
    description: "Academic journals and books",
    icon: Database,
    color: "bg-red-500/20",
  },
  {
    title: "Google Scholar",
    description: "Research papers & citations",
    icon: Globe,
    color: "bg-blue-500/20",
  },
  {
    title: "PubMed",
    description: "Medical & life sciences",
    icon: FileSearch,
    color: "bg-green-500/20",
  },
  {
    title: "E-Book Collection",
    description: "50,000+ digital books",
    icon: BookMarked,
    color: "bg-purple-500/20",
  },
];
const DigitalResources = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Digital Resources</h3>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-4">
        {digitalResources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <div
              key={index}
              className="group bg-card hover:bg-card-hover p-4 rounded-xl text-center transition-colors cursor-pointer"
            >
              <div
                className={`w-12 h-12 mx-auto rounded-xl ${resource.color} flex items-center justify-center mb-3`}
              >
                <IconComponent className="w-6 h-6 text-foreground" />
              </div>
              <h4 className="font-semibold group-hover:text-primary text-sm transition-colors">
                {resource.title}
              </h4>
              <p className="mt-1 text-muted-foreground text-xs">
                {resource.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default DigitalResources;

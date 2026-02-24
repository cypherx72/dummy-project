import { ArrowRight, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const sideBooks = [
  {
    title: "The Art of Critical Thinking",
    description: "Essential skills for academic success...",
    author: "Dr. Sarah Mitchell",
    readTime: "320 pages",
    image:
      "https://images.unsplash.com/photo-1627296194657-9ac3e585f497?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JpdGljYWwlMjB0aGlua2luZyUyMGJvb2t8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Research Methods in Science",
    description: "A comprehensive guide to scientific...",
    author: "Prof. James Chen",
    readTime: "450 pages",
    image:
      "https://images.unsplash.com/photo-1763571083809-ca58df37b888?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Digital Age Literature",
    description: "Exploring modern narratives and...",
    author: "Emma Rodriguez",
    readTime: "280 pages",
    image:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxlYXJuaW5nfGVufDB8fDB8fHww",
  },
  {
    title: "Economics Fundamentals",
    description: "Understanding markets and financial...",
    author: "Dr. Michael Brown",
    readTime: "520 pages",
    image:
      "https://images.unsplash.com/photo-1555117389-402de1d1470b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVjb25vbWljJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D",
  },
];
const FeaturedBooks = () => {
  return (
    <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
      {/* Main Featured Article */}
      <div className="group relative lg:col-span-2 rounded-xl overflow-hidden cursor-pointer">
        <div className="relative aspect-[16/10]">
          <Image
            src="https://images.unsplash.com/photo-1688110395685-ce24e1949bca?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Library Welcome"
            fill
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="right-0 bottom-0 left-0 absolute p-6">
            <h2 className="mb-2 font-bold text-2xl md:text-3xl">
              Welcome to the Student Library: Your Gateway to Knowledge
            </h2>
            <p className="mb-4 max-w-xl text-muted-foreground text-sm">
              Discover thousands of books, research papers, and digital
              resources to support your academic journey
            </p>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full"
              >
                <ArrowRight className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <span>Library Staff</span>
                <span>•</span>
                <span>Open 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Side Book Cards */}
      <div className="space-y-3">
        {sideBooks.map((book, index) => (
          <div
            key={index}
            className="group flex gap-3 bg-card hover:bg-card-hover p-3 rounded-lg transition-colors cursor-pointer"
          >
            <Image
              fill
              src={book.image}
              alt={book.title}
              className="flex-shrink-0 rounded-lg w-16 h-16 object-cover"
            />
            <div className="min-w-0">
              <h4 className="font-semibold group-hover:text-primary text-sm truncate transition-colors">
                {book.title}
              </h4>
              <p className="text-muted-foreground text-xs truncate">
                {book.description}
              </p>
              <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
                <User className="w-3 h-3" />
                <span>{book.author}</span>
                <span>•</span>
                <Clock className="w-3 h-3" />
                <span>{book.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FeaturedBooks;

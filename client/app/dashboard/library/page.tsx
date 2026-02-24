import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { InboxIcon } from "lucide-react";
import { FaArrowRight } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import { Button } from "@/components/ui/button";
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

export default function Page() {
  return (
    <div className="flex flex-row gap-4 p-2 w-full min-h-full">
      {/*Leftdiv */}
      <div className="flex flex-col gap-2 bg-neutral-800 p-2 w-2/3 h-full">
        <div className="relative rounded-md w-full h-3/5">
          <Image
            className="z-0 absolute rounded-md object-cover"
            src="https://images.unsplash.com/photo-1680449786212-de3b835dc467?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D"
            alt="trending-book"
            fill
          />

          <div className="absolute bg-none w-full h-full">
            <div className="relative flex flex-row justify-between p-2 h-full">
              <div className="flex flex-row justify-end items-end w-1/2 h-full">
                <Card className="z-50 gap-2 bg-gray-950 bg-clip-padding bg-opacity-10 backdrop-filter backdrop-blur-sm border-none rounded-md w-full h-auto font-sans">
                  <CardHeader className="flex flex-col">
                    <CardTitle className="font-sans font-bold text-white text-2xl">
                      The Art of Critical Thinking
                    </CardTitle>
                    <CardDescription className="font-semibold text-neutral-300">
                      Discover thousands of books, research papers, and digital
                      resources to support your academic journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row justify-between items-center">
                    <CardFooter className="flex flex-row justify-between items-center p-0 pr-10 w-full text-sm">
                      <span className="flex flex-row items-center gap-1 font-extralight text-neutral-300 text-xs">
                        <p>520 pages</p>
                        <LuDot />
                        <p>42 min read</p>
                      </span>
                      <Button
                        variant="outline"
                        className="flex flex-row items-center border border-amber-300 rounded-full text-amber-500"
                      >
                        <FaArrowRight />
                      </Button>
                    </CardFooter>
                  </CardContent>
                </Card>
              </div>
              {/*items div */}

              <div className="z-50 gap-3 grid grid-rows-4 w-2/5">
                <Item
                  variant="muted"
                  className="flex flex-col flex-1/4 justify-center items-center gap-2 bg-gray-950 bg-clip-padding bg-opacity-10 backdrop-filter backdrop-blur-sm p-2 border-none rounded-md w-full font-sans"
                >
                  <div className="bg-amber- rounded-md w-1 h-3/4 00" />
                  <ItemMedia variant="image" className="size-16">
                    <Image
                      src="https://images.unsplash.com/photo-1555117389-402de1d1470b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVjb25vbWljJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D"
                      alt="Library Welcome"
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </ItemMedia>
                  <ItemContent className="flex flex-col gap-0.5">
                    <ItemTitle className="p-0 font-semibold text-lg truncate">
                      The Art of Critical Thinking
                    </ItemTitle>
                    <ItemDescription className="w-full overflow-ellipsis font-medium text-neutral-200 text-sm text-nowrap">
                      Essential skills for academic success ...
                    </ItemDescription>
                    <span className="flex flex-row items-center gap-1 font-extralight text-neutral-300 text-xs">
                      <p>520 pages</p>
                      <LuDot />
                      <p>42 min read</p>
                    </span>
                  </ItemContent>
                </Item>{" "}
                <Item
                  variant="muted"
                  className="flex flex-col flex-1/4 gap-2 bg-gray-950 bg-clip-padding bg-opacity-10 backdrop-filter backdrop-blur-sm p-2 border-none rounded-md w-full font-sans"
                >
                  <ItemMedia variant="image" className="size-16">
                    <Image
                      src="https://images.unsplash.com/photo-1555117389-402de1d1470b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVjb25vbWljJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D"
                      alt="Library Welcome"
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </ItemMedia>
                  <ItemContent className="flex flex-col gap-0.5">
                    <ItemTitle className="p-0 font-semibold text-lg truncate">
                      The Art of Critical Thinking
                    </ItemTitle>
                    <ItemDescription className="w-full overflow-ellipsis font-medium text-neutral-200 text-sm text-nowrap">
                      Essential skills for academic success ...
                    </ItemDescription>
                    <span className="flex flex-row items-center gap-1 font-extralight text-neutral-300 text-xs">
                      <p>520 pages</p>
                      <LuDot />
                      <p>42 min read</p>
                    </span>
                  </ItemContent>
                </Item>{" "}
                <Item
                  variant="muted"
                  className="flex flex-col flex-1/4 gap-2 bg-gray-950 bg-clip-padding bg-opacity-10 backdrop-filter backdrop-blur-sm p-2 border-none rounded-md w-full font-sans"
                >
                  <ItemMedia variant="image" className="size-16">
                    <Image
                      src="https://images.unsplash.com/photo-1555117389-402de1d1470b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVjb25vbWljJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D"
                      alt="Library Welcome"
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </ItemMedia>
                  <ItemContent className="flex flex-col gap-0.5">
                    <ItemTitle className="p-0 font-semibold text-lg truncate">
                      The Art of Critical Thinking
                    </ItemTitle>
                    <ItemDescription className="w-full overflow-ellipsis font-medium text-neutral-200 text-sm text-nowrap">
                      Essential skills for academic success ...
                    </ItemDescription>
                    <span className="flex flex-row items-center gap-1 font-extralight text-neutral-300 text-xs">
                      <p>520 pages</p>
                      <LuDot />
                      <p>42 min read</p>
                    </span>
                  </ItemContent>
                </Item>{" "}
                <Item
                  variant="muted"
                  className="flex flex-col flex-1/4 gap-2 bg-gray-950 bg-clip-padding bg-opacity-10 backdrop-filter backdrop-blur-sm p-2 border-none rounded-md w-full font-sans"
                >
                  <ItemMedia variant="image" className="size-16">
                    <Image
                      src="https://images.unsplash.com/photo-1555117389-402de1d1470b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVjb25vbWljJTIwYm9va3xlbnwwfHwwfHx8MA%3D%3D"
                      alt="Library Welcome"
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </ItemMedia>
                  <ItemContent className="flex flex-col gap-0.5">
                    <ItemTitle className="p-0 font-semibold text-lg truncate">
                      The Art of Critical Thinking
                    </ItemTitle>
                    <ItemDescription className="w-full overflow-ellipsis font-medium text-neutral-200 text-sm text-nowrap">
                      Essential skills for academic success ...
                    </ItemDescription>
                    <span className="flex flex-row items-center gap-1 font-extralight text-neutral-300 text-xs">
                      <p>520 pages</p>
                      <LuDot />
                      <p>42 min read</p>
                    </span>
                  </ItemContent>
                </Item>{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-950 rounded-2xl w-full h-2/5"></div>
      </div>

      <div className="flex flex-col bg-neutral-800 w-1/3 h-full"></div>
    </div>
  );
}

// import FeaturedBooks from "./featured-books";
// import StudyResources from "./study-resources";
// import LibraryEvents from "./library-events";
// import DigitalResources from "./digital-resources";
// import EventsSidebar from "./event-sidebar";
// import TutorsSection from "./tutor-section";
// import QuickLinks from "./quick-links";

// const LibraryPage = () => {
//   return (
//     <div className="bg-background min-h-screen">
//       <main className="py-6 container">
//         <div className="gap-6 grid grid-cols-1 xl:grid-cols-4">
//           {/* Main Content */}
//           <div className="space-y-6 xl:col-span-3">
//             <FeaturedBooks />
//             <StudyResources />
//             <LibraryEvents />
//             <DigitalResources />
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             <EventsSidebar />
//             <TutorsSection />
//             <QuickLinks />
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default LibraryPage;

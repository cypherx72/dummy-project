"use client";
import { useChatUI } from "./layout";
import { Button } from "@/components/ui/button";
import { IoFilterSharp } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeftChatAside() {
  //   const {} = useChatUI();

  return (
    <aside className="flex flex-col gap-4 p-0 py-4 pl-4 w-7/25">
      <header className="flex flex-row justify-between items-center">
        <span className="font-bold text-3xl">IGC Chat</span>
        <span className="gap-4">
          <Button variant="ghost">
            <IoFilterSharp />
          </Button>
          <Button variant="ghost">
            <MdEditNote />
          </Button>
        </span>
      </header>
      <span className=""></span>
      <section className="flex flex-col gap-2">
        <Card className="flex flex-row justify-center items-center gap-0 p-2 w-full">
          <div className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

          <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
            <CardTitle className="flex flex-row justify-between items-baseline w-full">
              <span className="font-medium text-sm">Computer Science</span>
              <span className="font-serif font-light text-xs">15:23</span>
            </CardTitle>

            <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
              <span className="text-wrap">
                Lorem ipsum, dolor sit ctetur adipisicing...
              </span>
              <span>
                <Badge
                  variant="default"
                  className="bg-amber-500 rounded-full font-bold"
                >
                  2
                </Badge>
              </span>
            </CardContent>
          </CardHeader>
        </Card>{" "}
        <Card className="flex flex-row justify-center items-center gap-0 p-2 w-full">
          <div className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

          <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
            <CardTitle className="flex flex-row justify-between items-baseline w-full">
              <span className="font-medium text-sm">Computer Science</span>
              <span className="font-serif font-light text-xs">15:23</span>
            </CardTitle>

            <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
              <span className="text-wrap">
                Lorem ipsum, dolor sit ctetur adipisicing...
              </span>
              <span>
                <Badge
                  variant="default"
                  className="bg-amber-500 rounded-full font-bold"
                >
                  2
                </Badge>
              </span>
            </CardContent>
          </CardHeader>
        </Card>{" "}
        <Card className="flex flex-row justify-center items-center gap-0 p-2 w-full">
          <div className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

          <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
            <CardTitle className="flex flex-row justify-between items-baseline w-full">
              <span className="font-medium text-sm">Computer Science</span>
              <span className="font-serif font-light text-xs">15:23</span>
            </CardTitle>

            <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
              <span className="text-wrap">
                Lorem ipsum, dolor sit ctetur adipisicing...
              </span>
              <span>
                <Badge
                  variant="default"
                  className="bg-amber-500 rounded-full font-bold"
                >
                  2
                </Badge>
              </span>
            </CardContent>
          </CardHeader>
        </Card>{" "}
        <Card className="flex flex-row justify-center items-center gap-0 p-2 w-full">
          <div className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

          <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
            <CardTitle className="flex flex-row justify-between items-baseline w-full">
              <span className="font-medium text-sm">Computer Science</span>
              <span className="font-serif font-light text-xs">15:23</span>
            </CardTitle>

            <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
              <span className="text-wrap">
                Lorem ipsum, dolor sit ctetur adipisicing...
              </span>
              <span>
                <Badge
                  variant="default"
                  className="bg-amber-500 rounded-full font-bold"
                >
                  2
                </Badge>
              </span>
            </CardContent>
          </CardHeader>
        </Card>{" "}
        <Card className="flex flex-row justify-center items-center gap-0 p-2 w-full">
          <div className="">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" className="" />
              <AvatarFallback>CS</AvatarFallback>
            </Avatar>
          </div>

          <CardHeader className="flex flex-col p-1 pl-3 w-full tracking-wide">
            <CardTitle className="flex flex-row justify-between items-baseline w-full">
              <span className="font-medium text-sm">Computer Science</span>
              <span className="font-serif font-light text-xs">15:23</span>
            </CardTitle>

            <CardContent className="flex flex-row justify-between p-0 w-full text-xs">
              <span className="text-wrap">
                Lorem ipsum, dolor sit ctetur adipisicing...
              </span>
              <span>
                <Badge
                  variant="default"
                  className="bg-amber-500 rounded-full font-bold"
                >
                  2
                </Badge>
              </span>
            </CardContent>
          </CardHeader>
        </Card>{" "}
      </section>
    </aside>
  );
}

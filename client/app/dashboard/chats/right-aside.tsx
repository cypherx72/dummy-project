import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileCard } from "./fileCard";
import { IoLinkSharp } from "react-icons/io5";
import { IoIosImages } from "react-icons/io";
import { IoMdPerson } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Image from "next/image";

import { PiFilesThin } from "react-icons/pi";
import { useChatUI } from "./layout";
export const dummyFiles: FileMeta[] = [
  {
    id: "1",
    name: "Discrete_Math_Lecture_1.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "Jan 18",
    uploadedBy: "Dr. Alice",
    downloads: 42,
  },
  {
    id: "2",
    name: "Project_Presentation.pptx",
    type: "pptx",
    size: "6.1 MB",
    uploadedAt: "Jan 20",
    uploadedBy: "Bob Student",
    downloads: 12,
  },
  {
    id: "3",
    name: "Marks_Sheet.xlsx",
    type: "xlsx",
    size: "312 KB",
    uploadedAt: "Jan 22",
    uploadedBy: "Admin",
  },
];

export default function RightChatAside() {
  const { chatMetadataByChatId } = useChatUI();
  const [isOpenCollapsible, setIsOpenCollapsible] = useState(false);
  const chatMembers = chatMetadataByChatId
    ? chatMetadataByChatId[Object.keys(chatMetadataByChatId)[0]]?.members
    : [];

  const mediaItems = chatMetadataByChatId
    ? chatMetadataByChatId[Object.keys(chatMetadataByChatId)[0]]?.media
    : [];

  return (
    <aside className="flex flex-col gap-0 bg-neutral-900 pb-6 w-full h-full overflow-y-auto no-scrollbar">
      {/* about section */}
      <Card className="flex flex-col items-center m-0 mx-auto p-4 border-none rounded-none w-full max-w-sm h-full">
        <div className="relative mx-auto mt-4 rounded-full w-40 h-40 overflow-hidden">
          <Image
            src="https://cdn.nba.com/manage/2021/09/basketball-iso.jpg"
            alt="Event cover"
            fill
            className="object-cover"
          />
        </div>

        <CardHeader className="flex flex-col justify-center items-center px-4 w-full">
          <CardTitle className="font-sans font-bold text-2xl truncate">
            Discrete Mathematics
          </CardTitle>
          <CardDescription className="font-sans text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
            officiis ipsa alias autem impedit commodi praesentium similique
            consequatur illo sunt aut. In!
          </CardDescription>
          <Badge variant="outline" className="text-amber-500">
            @31242199@vupune.ac.in
          </Badge>
        </CardHeader>
      </Card>

      {/* participants section */}

      <section className="flex flex-col justify-center items-start gap-2 bg-neutral-950 p-2 h-60">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="font-sans font-semibold text-lg tracking-wide">
            Members
          </span>
        </div>

        <div className="flex flex-row flex-wrap justify-between items-end w-full">
          <div className="flex -space-x-1 *:data-[slot=avatar]:grayscale-0 *:data-[slot=avatar]:ring-1 *:data-[slot=avatar]:ring-amber-500 max-w-1/2">
            {chatMembers?.map((chatMember, idx: number) => {
              if (idx < 8)
                return (
                  <Avatar key={chatMember.userId} className="size-10">
                    <AvatarImage
                      src={chatMember.user.image}
                      alt=""
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <IoMdPerson className="size-6" />
                    </AvatarFallback>
                  </Avatar>
                );
            })}
            {chatMembers.length > 8 && (
              <Avatar className="size-10 cursor-pointer">
                <AvatarFallback className="bg-amber-500 font-semibold text-xs">
                  +27
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <Dialog>
            <DialogTrigger className="pr-4 font-sans font-normal text-xs hover:underline underline-offset-4">
              View all
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Group Participants</DialogTitle>

                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* shared files section*/}

      <section className="flex flex-col justify-between items-start gap-2 bg-neutral-900 p-2">
        <span className="items-start font-sans font-semibold text-lg tracking-wide">
          Media
        </span>

        {/*photos & videos */}
        <Card className="gap-y-0 shadow-none m-0 mx-auto p-0 border-none w-full max-w-sm">
          <CardHeader className="p-0">
            <CardTitle>
              <span className="flex flex-row items-center gap-2 font-sans font-semibold text-sm tracking-wide">
                <IoIosImages size={20} className="text-amber-500" /> Photos &
                Videos
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col justify-start items-center gap-y-2 p-0 w-full h-full">
              <div className="gap-2 grid grid-cols-3 w-full h-60">
                <Card className="relative border-none">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>{" "}
                <Card className="relative border-none w-full h-full">
                  <Image
                    className="rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>
                <Card
                  className="relative border-none w-full h-full cursor-pointer"
                  onClick={() => console.log("more image")}
                >
                  <span className="top-1/3 left-1/4 z-10 absolute font-semibold text-lg">
                    +42
                  </span>

                  <Image
                    className="blur-[1px] blur-in rounded-sm w-full object-cover"
                    alt=""
                    fill
                    src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                  />
                </Card>
              </div>
              <div className="flex flex-row justify-end items-start p-0 w-full">
                <Sheet>
                  <SheetTrigger className="font-sans font-normal text-neutral-300 text-xs hover:underline hover:underline-offset-4">
                    View all
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Photos & Videos</SheetTitle>
                      <SheetDescription>
                        Check out your recent shared pictuers and videos
                      </SheetDescription>
                    </SheetHeader>
                    <div className="gap-2 grid grid-cols-4 px-4 w-full h-full overflow-y-auto no-scrollbar">
                      <div className="relative border-none aspect-square">
                        <Image
                          className="rounded-sm w-full object-cover"
                          alt=""
                          fill
                          src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* files */}
        <Card className="gap-y-0 shadow-none m-0 mx-auto p-0 border-none w-full max-w-sm">
          <CardHeader className="p-0">
            <CardTitle>
              <span className="flex flex-row items-center gap-2 font-sans font-semibold text-sm tracking-wide">
                <PiFilesThin size={20} className="text-amber-500 x" /> Files
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col justify-start items-center p-0 w-full h-full">
              <div className="flex flex-row justify-between items-center w-full"></div>

              <div className="flex flex-col justify-center items-start gap-y-1 w-full">
                <div className="flex flex-col gap-0">
                  {dummyFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              </div>
              <div className="flex flex-row justify-end items-start p-0 w-full">
                <Sheet>
                  <SheetTrigger className="font-sans font-normal text-neutral-300 text-xs hover:underline hover:underline-offset-4">
                    View all
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>Documents</SheetTitle>
                      <SheetDescription>
                        Check out your recent shared documents.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="gap-2 grid grid-cols-4 px-4 w-full h-full overflow-y-auto no-scrollbar">
                      <div className="flex flex-col gap-0">
                        {dummyFiles.map((file) => (
                          <FileCard key={file.id} file={file} />
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>

        {/*links */}
        <Card className="gap-y-0 shadow-none m-0 mx-auto p-0 border-none w-full max-w-sm">
          <CardHeader className="p-0">
            <CardTitle>
              <span className="flex flex-row items-center gap-2 font-sans font-semibold text-sm tracking-wide">
                <IoLinkSharp size={20} className="text-amber-500" /> Links
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col justify-start items-center p-0 w-full h-full">
              <div className="flex flex-row justify-between items-center w-full"></div>

              <div className="flex flex-col justify-center items-start gap-y-1 w-full">
                <div className="flex flex-col gap-0">
                  {dummyFiles.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))}
                </div>
              </div>
              <div className="flex flex-row justify-end items-start p-0 w-full">
                <Sheet>
                  <SheetTrigger className="font-sans font-normal text-neutral-300 text-xs hover:underline hover:underline-offset-4">
                    View all
                  </SheetTrigger>
                  <SheetContent side="top">
                    <SheetHeader>
                      <SheetTitle>Documents</SheetTitle>
                      <SheetDescription>
                        Check out your recent shared documents.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="gap-2 grid grid-cols-4 px-4 w-full h-full overflow-y-auto no-scrollbar">
                      <div className="flex flex-col gap-0">
                        {dummyFiles.map((file) => (
                          <FileCard key={file.id} file={file} />
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </aside>
  );
}

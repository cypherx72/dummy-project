import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  TbLayoutSidebarRightExpand,
  TbLayoutSidebarLeftExpand,
} from "react-icons/tb";

export function DrawerScrollableContent() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <TbLayoutSidebarRightExpand />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row justify-between items-center p-3.5">
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerClose asChild className="size-6 text-zinc-400">
            <TbLayoutSidebarLeftExpand />
          </DrawerClose>
        </DrawerHeader>
        <RightChatAside />
      </DrawerContent>
    </Drawer>
  );
}

import { MdOutlineCancel } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoMdPerson } from "react-icons/io";
import Image from "next/image";
import { useChatUI } from "@/context/chat/chat-context";

export type FileMeta = {
  id: string;
  name: string;
  type:
    | "pdf"
    | "doc"
    | "docx"
    | "ppt"
    | "pptx"
    | "xls"
    | "xlsx"
    | "image"
    | "zip"
    | string;
  size: string; // e.g. "2.4 MB"
  uploadedAt: string; // e.g. "Jan 18" (could be Date if you prefer stricter typing)
  uploadedBy: string;
  downloads: number;
};

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
    downloads: 3,
    uploadedBy: "Admin",
  },
];

export default function RightChatAside() {
  const { chatMetadataByChatId } = useChatUI();
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
    </aside>
  );
}

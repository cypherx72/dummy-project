import { Badge } from "@/components/ui/badge";
import { PiPhoneCallBold } from "react-icons/pi";
import { FaVideo } from "react-icons/fa";
import { IoMdContacts } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaRegFileWord, FaFilePowerpoint, FaFileExcel } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import {
  Card,
  CardFooter,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IoLinkSharp } from "react-icons/io5";

import { IoIosImages } from "react-icons/io";

import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Image from "next/image";
import { IoFilterSharp } from "react-icons/io5";
import { MdEditNote } from "react-icons/md";
import { PiFilesThin } from "react-icons/pi";
import ChatMain from "@/app/dashboard/chats/chat-main";
import { useChatUI } from "./layout";

export default function RightChatAside() {
  // const { } = useChatUI();

  return (
    <aside className="flex flex-col gap-4 rounded-2xl w-7/25 h-auto">
      {/* socials section */}
      <section className="flex flex-row justify-evenly items-center bg-muted p-4 rounded-2xl text-xl">
        <Button className="text-amber-500">
          <PiPhoneCallBold />
        </Button>
        <Button className="text-amber-500">
          <PiPhoneCallBold />
        </Button>
        <Button className="text-amber-500">
          <FaVideo />
        </Button>
        <Button>
          <IoMdContacts className="text-amber-500" />
        </Button>
      </section>

      {/* participants section */}

      <section className="flex flex-col justify-center items-start gap-2 bg-muted p-2 rounded-2xl">
        <div className="flex flex-row justify-between items-center w-full">
          <span className="font-semibold text-lg tracking-wide">Members</span>

          <Dialog>
            <DialogTrigger className="pr-4 font-semibold text-amber-500 text-xs hover:underline underline-offset-4">
              See all
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

        <div className="flex flex-row flex-wrap items-center gap-12">
          <div className="flex -space-x-2 *:data-[slot=avatar]:grayscale-0 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-muted max-w-1/2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>{" "}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>{" "}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>{" "}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>{" "}
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/maxleiter.png"
                alt="@maxleiter"
              />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://github.com/evilrabbit.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>{" "}
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-amber-500 font-semibold text-xs">
                +27
              </AvatarFallback>
            </Avatar>{" "}
          </div>
        </div>
      </section>

      {/* shared files section*/}

      <section className="flex flex-col flex-1 justify-between items-start gap-2 bg-muted p-2 rounded-2xl">
        <span className="items-start font-bold text-lg tracking-wide">
          Shared Documents
        </span>
        {/*photos & videos */}
        <div className="flex flex-col justify-start items-center p-0 w-full h-full">
          <div className="flex flex-row justify-between items-center p-0 w-full">
            <span className="flex flex-row items-center gap-2 font-semibold text-[12px] tracking-wide">
              <IoIosImages size={20} className="text-amber-500" /> Photos &
              Videos
            </span>

            <Dialog>
              <DialogTrigger className="pr-3 font-semibold text-amber-500 text-xs hover:underline underline-offset-4">
                See all
              </DialogTrigger>
              <DialogContent className="flex flex-col w-3/4 h-3/4 overflow-hidden">
                <DialogHeader className="shrink-0">
                  <DialogTitle>Photos & Videos</DialogTitle>
                </DialogHeader>
                <DialogDescription className="w-full h-full">
                  <div className="gap-2 grid grid-cols-4 w-full h-full overflow-y-auto no-scrollbar">
                    <Card className="relative border-none w-full h-auto">
                      <Image
                        className="rounded-sm w-full object-cover"
                        alt=""
                        fill
                        src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
                      />
                    </Card>{" "}
                  </div>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-row items-center gap-1 w-full h-full">
            <Card className="relative border-none w-1/4 h-full">
              <Image
                className="rounded-sm w-full object-cover"
                alt=""
                fill
                src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
              />
            </Card>
            <Card className="relative border-none w-1/4 h-full">
              <Image
                className="rounded-sm w-full object-cover"
                alt=""
                fill
                src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
              />
            </Card>
            <Card className="relative border-none w-1/4 h-full">
              <Image
                className="rounded-sm w-full object-cover"
                alt=""
                fill
                src="https://t3.ftcdn.net/jpg/07/97/45/74/360_F_797457455_wSjMx13AT54f0Yl6MDF6BsJAnyxayexq.jpg"
              />
            </Card>{" "}
            <Card
              className="relative border-none w-1/4 h-full cursor-pointer"
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
        </div>{" "}
        {/*files */}
        <div className="flex flex-col justify-start items-center p-0 w-full h-full">
          <div className="flex flex-row justify-between items-center w-full">
            <span className="flex flex-row items-center gap-2 font-semibold text-[12px] tracking-wide">
              <PiFilesThin size={20} className="text-amber-500 x" /> Files
            </span>

            <Button variant="link" className="text-amber-500 text-xs">
              See all
            </Button>
          </div>

          <div className="flex flex-col justify-center items-start gap-y-1 w-full">
            <div className="flex flex-row justify-start items-center gap-2 p-1 border-1 rounded-lg w-full">
              <FaRegFileWord className="text-2xl" />
              <span className="flex flex-col text-xs tracking-wide">
                <p>Research on Biodiversity</p>
                <p>32.31kb</p>
              </span>
              {/* <SlOptions className="justify-self-end" /> */}
            </div>{" "}
            <div className="flex flex-row justify-start items-center gap-2 p-1 border-1 rounded-lg w-full">
              <FaRegFileWord className="text-2xl" />
              <span className="flex flex-col text-xs tracking-wide">
                <p>Research on Biodiversity</p>
                <p>32.31kb</p>
              </span>
              {/* <SlOptions className="justify-self-end" /> */}
            </div>{" "}
            <div className="flex flex-row justify-start items-center gap-2 p-1 border-1 rounded-lg w-full">
              <FaRegFileWord className="text-2xl" />
              <span className="flex flex-col text-xs tracking-wide">
                <p>Research on Biodiversity</p>
                <p>32.31kb</p>
              </span>
              {/* <SlOptions className="justify-self-end" /> */}
            </div>
          </div>
        </div>{" "}
        <div className="flex flex-col justify-start items-center p-0 w-full h-full">
          <div className="flex flex-row justify-between items-center w-full">
            <span className="flex flex-row items-center gap-2 font-semibold text-[12px] tracking-wide">
              <IoLinkSharp size={20} className="text-amber-500" /> Links
            </span>
            <Button variant="link" className="text-amber-500 text-xs">
              See all
            </Button>
          </div>
          <div></div>
        </div>{" "}
      </section>
    </aside>
  );
}

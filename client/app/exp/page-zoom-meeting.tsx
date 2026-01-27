"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiComputerFill } from "react-icons/ri";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FaPlus } from "react-icons/fa6";
import { useChatUI } from "../dashboard/chats/layout";
import { LuBellRing } from "react-icons/lu";
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Calendar24 } from "./date-time-picker";
import { SiGooglemeet } from "react-icons/si";
import { SiGotomeeting } from "react-icons/si";
import { SiWebex } from "react-icons/si";
import { GrAttachment } from "react-icons/gr";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MEETING_PLATFORMS = [
  {
    value: "google-meeting",
    name: "Google Meeting",
    icon: SiGooglemeet,
  },
  {
    value: "zoom-meeting",
    name: "Zoom Meeting",
    icon: SiGotomeeting,
  },
  {
    value: "webex-meeting",
    name: "Webex Meeting",
    icon: SiWebex,
  },
];
export default function CreateMeetign() {
  //   const { chatData } = useChatUI();
  const [reminder, setReminder] = React.useState<boolean>(true);
  const [allParticipants, setAllParticipants] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <section className="flex flex-row gap-0 m-auto rounded-xl w-2xl">
      <Card className="bg-accent/50 border-r-0 rounded-r-none w-full">
        <CardHeader>
          <CardTitle className="mb-6 font-bold text-amber-500 text-2xl">
            Create Meeting
          </CardTitle>
          <CardDescription>
            <Calendar24 />
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <RiComputerFill />
              Computer Science
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-row items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Meeting Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Meeting Platform</SelectLabel>
                {MEETING_PLATFORMS.map((platform) => (
                  <SelectItem key={platform.name} value={platform.value}>
                    <platform.icon />
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-white/50 text-sm">
            Link will automatically be generated.
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-y-6">
          <Textarea
            placeholder="Meeting Description."
            className="max-w-md no-scrollbar"
            maxLength={150}
          />
          <span className="flex flex-row items-start gap-x-4 w-full">
            <Button variant="outline" className="p-2 text-amber-500">
              <GrAttachment />
              Attach File
            </Button>{" "}
            <Button variant="default" className="bg-amber-500 p-2">
              <LuBellRing />
              Set Reminder
            </Button>
          </span>
        </CardFooter>
      </Card>
      <section className="flex flex-col justify-between items-center bg-accent/20 p-4 border-1 border-l-0 rounded-2xl rounded-l-none w-1/3 text-neutral-500 text-sm">
        <h2 className="font-bold text-white/70 text-2xl">Architecture</h2>
        <div className="flex flex-col justify-start items-start w-full">
          <span className="flex flex-col gap-y-2">
            <p className="font-bold text-white/70">Reminder</p>
            <span className="flex flex-row justify-center items-center gap-x-1">
              <LuBellRing />
              <p>10 minutes before</p>
            </span>
            <Button className="p-0 text-amber-500 text-xs" variant="secondary">
              <FaPlus />
              Add reminder
            </Button>
          </span>
        </div>{" "}
        <div className="flex justify-center items-start w-full">
          <span className="flex flex-col gap-y-2">
            <p className="font-bold text-white/70">Type</p>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Meeting Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Meeting Platform</SelectLabel>
                  {MEETING_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.name} value={platform.value}>
                      <platform.icon />
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>{" "}
        <div className="flex justify-start items-center w-full">
          <span className="flex flex-col gap-y-2">
            <p className="font-bold text-white/70">Participants</p>
            <div className="flex items-center space-x-2">
              {}
              <Switch id="all-participants"  />
              <Label htmlFor="all-participants">All Participants</Label>
            </div>
          </span>
        </div>
      </section>
    </section>
  );
}

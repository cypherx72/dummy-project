"use client";

// todo: implement pagination

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FaPaperclip } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { LuSmilePlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { Fragment } from "react";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useChatUI } from "./layout";

// todo: change type to allow emoji, files, text
const messageSchema = z.object({
  message: z.string({
    message: "...type a message",
  }),
});

type DummyMessage = {
  id: string; // sender id (email or user id)
  name: string; // sender name
  image?: string | null; // avatar image
  message: string; // text content
  time_sent: string; // timestamp (string or ISO)
};

// dummy messages object
const messages: DummyMessage[] = [
  {
    id: "student1@uni.edu",
    name: "John Doe",
    image: "https://i.pravatar.cc/150?img=3",
    message: "Hey everyone 👋",
    time_sent: String(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "teacher1@uni.edu",
    name: "Dr. Alice Smith",
    image: "https://i.pravatar.cc/150?img=5",
    message: "Please remember to submit your assignment by tonight.",
    time_sent: String(Date.now() - 1000 * 60 * 60 * 23),
  },
  {
    id: "student2@uni.edu",
    name: "Michael Brown",
    image: null,
    message: "Noted 👍 Thanks!",
    time_sent: String(Date.now() - 1000 * 60 * 60 * 22),
  },
];

export default function ChatMain() {
  const {} = useChatUI();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const formMessage = form.watch("message");

  function onSubmitMessage(message: z.infer<typeof messageSchema>) {}

  return (
    <section className="flex flex-col bg-muted p-2 pt-2 pb-4 border-none rounded-2xl w-11/25 h-[94vh] justifty-between">
      <section className="flex flex-col flex-1 gap-y-0 bg-none pb-4 rounded-2xl rounded-b-none overflow-auto no-scrollbar">
        {messages.map((msg, idx) => (
          <Fragment key={`${msg.id}-${msg.time_sent}`}>
            {/* <DateSeparator
              currentDate={Number(msg.time_sent)}
              previousDate={
                idx > 0 ? Number(messages[idx - 1].time_sent) : null
              }
            /> */}
            <Card
              className={`flex flex-row justify-start items-start gap-1 w-full ${
                msg.id === "student1@uni.edu" ? "" : "bg-muted border-none"
              }`}
            >
              ...
            </Card>
          </Fragment>
        ))}
      </section>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitMessage)}
          className="flex flex-row justify-start items-center gap-1 mt-4 p-2 border-1 border-amber-500 rounded-2xl w-full"
        >
          <Button variant="ghost" className="p-2" type="button">
            <LuSmilePlus />
          </Button>
          <div className="items-center gap-3 grid w-full max-w-sm">
            <Input id="picture" type="file" className="hidden" />
          </div>
          <Button variant="secondary" className="p-2" type="button">
            <FaPaperclip />
          </Button>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type a message"
                    className="flex flex-1 px-3 py-2 border-none focus:border-none rounded-lg w-full min-h-[30px] max-h-[500px] overflow-hidden text-xl line-clamp-2 tracking-wide resize-none align-start"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            variant="ghost"
            className="p-2"
            type="submit"
            disabled={formMessage.length === 0 ? true : false}
          >
            <IoSendSharp />
          </Button>
        </form>
      </Form>
    </section>
  );
}

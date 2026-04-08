"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DetailsTab } from "../components/details-tab";
import { ScheduleTab } from "../components/schedule-tab";
import { ParticipantsTab } from "../components/participants-tab";

import {
  EventFormDefaultValues,
  EventFormSchema,
  EventFormValues,
} from "../schema/schema";
export default function CreateEvent() {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: EventFormDefaultValues,
  });

  function onSubmit(values: EventFormValues) {
    console.log(values);
  }

  return (
    <Tabs defaultValue="details" className="mx-auto mb-2 w-1/2 font-sans">
      <TabsList variant="line" className="justify-center">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="participants">Participants</TabsTrigger>
      </TabsList>

      <form
        id="event-form"
        className="space-y-3 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <DetailsTab form={form} />
        <ScheduleTab form={form} />
        <ParticipantsTab form={form} />

        <div className="flex flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" variant="default">
            Create Event
          </Button>
        </div>
      </form>
    </Tabs>
  );
}

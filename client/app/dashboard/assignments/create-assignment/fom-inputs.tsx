"use client";

import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FieldLabel,
  Field,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon, AlertCircleIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CreateTaskValues } from "../schema";

export default function FormInputs({
  form,
}: {
  form: UseFormReturn<CreateTaskValues>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <FieldGroup className="flex flex-col gap-3 p-4 border rounded-2xl">
      {/* Course */}
      <Controller
        name="courseId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full text-xs">
            <FieldLabel>Course</FieldLabel>

            <HoverCard openDelay={10} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Input
                  type="text"
                  readOnly
                  className="truncate"
                  value={field.value}
                />
              </HoverCardTrigger>

              <HoverCardContent className="p-2 text-xs" align="end">
                <Alert
                  variant="default"
                  className="border-none max-w-md text-amber-500"
                >
                  <AlertCircleIcon />
                  <AlertTitle>Wrong Subject </AlertTitle>
                  <AlertDescription className="inline">
                    Please recheck subject selected. If the error continues,
                    contact{" "}
                    <Link className="text-blue-500 underline" href="">
                      support team.
                    </Link>
                  </AlertDescription>
                </Alert>
              </HoverCardContent>
            </HoverCard>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Date */}
      <Controller
        name="dueDate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full">
            <FieldLabel>Date</FieldLabel>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild className="max-w-1/2">
                <Button variant="outline" className="justify-between">
                  {field.value ? format(field.value, "PP") : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-auto overflow-hidden"
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  defaultMonth={field.value}
                  onSelect={(date) => {
                    if (date) field.onChange(date);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Time */}
      <Controller
        name="time"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full">
            <FieldLabel>Time</FieldLabel>

            <div className="flex flex-col gap-1">
              <Input
                type="time"
                step="1"
                {...field}
                className="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none [&::-webkit-calendar-picker-indicator]:appearance-none"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />

      {/* Priority Status */}
      <Controller
        name="priorityStatus"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full">
            <FieldLabel>Priority Status</FieldLabel>

            <div className="flex flex-col gap-1">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="--Status--" />
                </SelectTrigger>

                <SelectContent className="font-bold tracking-wide">
                  <SelectItem value="high">
                    <Badge className="bg-rose-700/90">High</Badge>
                  </SelectItem>

                  <SelectItem value="medium">
                    <Badge className="bg-amber-600">Medium</Badge>
                  </SelectItem>

                  <SelectItem value="low">
                    <Badge className="bg-green-700/90">Low</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />

      {/* Max Points */}
      <Controller
        name="maxPoints"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full">
            <FieldLabel>Maximum Points</FieldLabel>
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                formNoValidate
                placeholder="100"
                {...field}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />

      {/* Submission Type */}
      <Controller
        name="submissionType"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="flex flex-row items-center w-full">
            <FieldLabel>Submission Type</FieldLabel>

            <div className="flex flex-col gap-1">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="--Type--" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="fileUpload">File Upload</SelectItem>
                  <SelectItem value="textEntry">Text Entry</SelectItem>
                  <SelectItem value="websiteUrl">Website URL</SelectItem>
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          </Field>
        )}
      />
    </FieldGroup>
  );
}

"use client";
import { TabsContent } from "@/components/ui/tabs";
import { Controller, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldTitle,
  FieldLegend,
  FieldSet,
  FieldGroup,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const intervalUnits = [
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
] as const;

const locations = [
  {
    id: "physical",
    title: "Physical",
    description: "An in-person event at a physical venue.",
  },
  {
    id: "virtual",
    title: "Virtual",
    description: "An online event attendees can join remotely.",
  },
  {
    id: "hybrid",
    title: "Hybrid",
    description: "Both in-person and online attendance.",
  },
] as const;

const stopAfterUnits = [
  { label: "Occurrences", value: "occurrences" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
] as const;

import StepperInput from "./stepper-input";

import { FaBell } from "react-icons/fa";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdLocationOn } from "react-icons/md";
import { EventFormValues } from "../schema/schema";

export function ScheduleTab({
  form,
}: {
  form: UseFormReturn<EventFormValues>;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <TabsContent value="schedule" className="flex flex-col gap-8">
      {/* Date & Time */}

      <FieldGroup className="flex-col mx-auto p-2 border-1 rounded-md w-full">
        <FieldSet>
          <FieldLegend variant="label">
            <span className="flex flex-row items-center gap-1 text-[16px] text-zinc-100 tracking-wide">
              <AiOutlineSchedule />
              Schedule
            </span>
          </FieldLegend>
          <FieldDescription>
            Choose the date and time for this event.
          </FieldDescription>

          <FieldGroup className="flex-row mx-auto p-2 border-1 rounded-md w-full">
            {/* Date */}
            <Controller
              name="schedule.date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="flex-none grow-0"
                    htmlFor="date-picker"
                  >
                    Date
                  </FieldLabel>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger aria-invalid={fieldState.invalid} asChild>
                      <Button
                        variant="outline"
                        id="date-picker"
                        className="justify-between w-32 font-normal"
                      >
                        {field.value
                          ? format(field.value, "eee, d LLL yyy")
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-auto overflow-hidden"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? new Date(Date.now())}
                        captionLayout="dropdown"
                        defaultMonth={field.value ?? new Date(Date.now())}
                        onSelect={(d) => {
                          field.onChange(d);
                          setDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Start Time */}
            <Controller
              name="schedule.startTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-32">
                  <FieldLabel htmlFor="time-picker-start">
                    Start Time
                  </FieldLabel>
                  <Input
                    type="time"
                    id="time-picker-start"
                    step="1"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* End Time */}
            <Controller
              name="schedule.endTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-32">
                  <FieldLabel htmlFor="time-picker-end">End Time</FieldLabel>
                  <Input
                    type="time"
                    id="time-picker-end"
                    step="1"
                    aria-invalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="[&::-webkit-calendar-picker-indicator]:hidden bg-background appearance-none"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      {/* Frequency */}
      <FieldGroup className="flex-col mx-auto p-2 border-1 rounded-md w-full">
        <FieldSet>
          <FieldLegend variant="label">
            <span className="flex flex-row items-center gap-1 text-[16px] text-zinc-100 tracking-wide">
              <FaBell />
              Reminder
            </span>
          </FieldLegend>
          <FieldDescription>Choose when to remind.</FieldDescription>

          {/* Top-level frequency type radio */}
          <Controller
            name="frequency.type"
            control={form.control}
            render={({ field, fieldState }) => (
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
              >
                {/* Option 1 — One Time */}
                <FieldLabel htmlFor="one-time-reminder" className="border-none">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Only Once</FieldTitle>
                      <FieldDescription>One time reminder</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="one-time" id="one-time-reminder" />
                  </Field>
                </FieldLabel>

                {/* Option 2 — Recurring */}
                <FieldLabel
                  htmlFor="recurring-reminder"
                  className="border-none"
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Recurring</FieldTitle>
                      <FieldDescription>
                        Repeat on a set interval
                      </FieldDescription>

                      {field.value === "recurring" && (
                        <div className="flex flex-col gap-4 mt-2 w-full">
                          {/* Repeat every N [unit] */}
                          <div className="flex flex-row justify-start items-start gap-2">
                            <FieldLabel>Every</FieldLabel>

                            <Controller
                              name="frequency.repeatInterval"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="w-auto"
                                >
                                  <StepperInput
                                    value={field.value ?? 1}
                                    min={1}
                                    max={30}
                                    onChange={field.onChange}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              name="frequency.repeatUnit"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="w-auto"
                                >
                                  <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger
                                      id="repeat-unit-select"
                                      aria-invalid={fieldState.invalid}
                                    >
                                      <SelectValue placeholder="Unit" />
                                    </SelectTrigger>
                                    <SelectContent position="item-aligned">
                                      {intervalUnits.map((unit) => (
                                        <SelectItem
                                          key={unit.value}
                                          value={unit.value}
                                        >
                                          {unit.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>

                          {/* Stop condition */}
                          <div className="flex flex-col gap-3 w-full">
                            <Controller
                              name="frequency.stopCondition.type"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <FieldSet>
                                  <Field
                                    className="flex flex-col w-full"
                                    orientation="horizontal"
                                    data-invalid={fieldState.invalid}
                                  >
                                    <FieldContent>
                                      <FieldTitle
                                        data-invalid={fieldState.invalid}
                                        className="font-normal text-zinc-400"
                                      >
                                        Stop repeating{" "}
                                      </FieldTitle>
                                    </FieldContent>
                                    <RadioGroup
                                      name={field.name}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      className="gap-2 w-auto"
                                    >
                                      {/* Never */}
                                      <Field orientation="horizontal">
                                        <FieldLabel htmlFor="stop-never">
                                          Never
                                        </FieldLabel>
                                        <RadioGroupItem
                                          value="never"
                                          id="stop-never"
                                        />
                                      </Field>

                                      {/* On date */}
                                      <Field orientation="horizontal">
                                        <FieldLabel htmlFor="stop-on-date">
                                          On date
                                        </FieldLabel>
                                        <RadioGroupItem
                                          value="on-date"
                                          id="stop-on-date"
                                        />
                                      </Field>

                                      {field.value === "on-date" && (
                                        <Controller
                                          name="frequency.stopCondition.endDate"
                                          control={form.control}
                                          render={({ field, fieldState }) => (
                                            <Field
                                              data-invalid={fieldState.invalid}
                                            >
                                              <Popover
                                                open={endDateOpen}
                                                onOpenChange={setEndDateOpen}
                                              >
                                                <PopoverTrigger asChild>
                                                  <Button
                                                    variant="outline"
                                                    className="w-1/3 font-normal"
                                                    aria-invalid={
                                                      fieldState.invalid
                                                    }
                                                  >
                                                    {field.value
                                                      ? format(
                                                          field.value,
                                                          "eee, d LLL yyy",
                                                        )
                                                      : "Select end date"}
                                                    <ChevronDownIcon />
                                                  </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                  className="p-0 w-auto overflow-hidden"
                                                  align="start"
                                                >
                                                  <Calendar
                                                    mode="single"
                                                    selected={
                                                      field.value ??
                                                      new Date(Date.now())
                                                    }
                                                    captionLayout="dropdown"
                                                    defaultMonth={
                                                      field.value ??
                                                      new Date(Date.now())
                                                    }
                                                    onSelect={(d) => {
                                                      field.onChange(d);
                                                      setEndDateOpen(false);
                                                    }}
                                                  />
                                                </PopoverContent>
                                              </Popover>
                                              {fieldState.invalid && (
                                                <FieldError
                                                  errors={[fieldState.error]}
                                                />
                                              )}
                                            </Field>
                                          )}
                                        />
                                      )}

                                      {/* After N occurrences */}
                                      <Field orientation="horizontal">
                                        <FieldLabel htmlFor="stop-after">
                                          After
                                        </FieldLabel>
                                        <RadioGroupItem
                                          value="after"
                                          id="stop-after"
                                        />
                                      </Field>

                                      {field.value === "after" && (
                                        <div className="flex flex-row justify-start items-start gap-2">
                                          <Controller
                                            name="frequency.stopCondition.count"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                              <Field
                                                data-invalid={
                                                  fieldState.invalid
                                                }
                                                className="w-auto"
                                              >
                                                <StepperInput
                                                  value={field.value ?? 0}
                                                  min={1}
                                                  max={100}
                                                  onChange={field.onChange}
                                                />
                                                {fieldState.invalid && (
                                                  <FieldError
                                                    errors={[fieldState.error]}
                                                  />
                                                )}
                                              </Field>
                                            )}
                                          />

                                          <Controller
                                            name="frequency.stopCondition.afterUnit"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                              <Field
                                                data-invalid={
                                                  fieldState.invalid
                                                }
                                              >
                                                <Select
                                                  name={field.name}
                                                  value={field.value}
                                                  onValueChange={field.onChange}
                                                >
                                                  <SelectTrigger
                                                    aria-invalid={
                                                      fieldState.invalid
                                                    }
                                                  >
                                                    <SelectValue placeholder="Unit" />
                                                  </SelectTrigger>
                                                  <SelectContent position="item-aligned">
                                                    {stopAfterUnits.map((u) => (
                                                      <SelectItem
                                                        key={u.value}
                                                        value={u.value}
                                                      >
                                                        {u.label}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                                {fieldState.invalid && (
                                                  <FieldError
                                                    errors={[fieldState.error]}
                                                  />
                                                )}
                                              </Field>
                                            )}
                                          />
                                        </div>
                                      )}

                                      {fieldState.invalid && (
                                        <FieldError
                                          errors={[fieldState.error]}
                                        />
                                      )}
                                    </RadioGroup>
                                  </Field>
                                </FieldSet>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </FieldContent>
                    <RadioGroupItem value="recurring" id="recurring-reminder" />
                  </Field>
                </FieldLabel>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </RadioGroup>
            )}
          />
        </FieldSet>
      </FieldGroup>

      {/*Location */}
      <FieldGroup className="flex-col mx-auto p-2 border-1 rounded-md w-full">
        <FieldSet>
          <FieldLegend>
            <span className="flex flex-row items-center gap-1 text-[16px] text-zinc-100 tracking-wide">
              <MdLocationOn />
              Location
            </span>
          </FieldLegend>
          <FieldDescription>
            Choose how attendees will join this event.
          </FieldDescription>

          {/* Location type radio */}
          <Controller
            name="location.type"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <RadioGroup
                  name={field.name}
                  value={field.value ?? ""}
                  onValueChange={(v) => {
                    // Reset all sub-fields when switching type to avoid stale values
                    form.setValue(
                      "location",
                      {
                        type: v as "physical" | "virtual" | "hybrid",
                        venueName: "",
                        venueAddress: "",
                        meetingLink: "",
                      },
                      { shouldValidate: false },
                    );
                  }}
                  aria-invalid={fieldState.invalid}
                >
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex flex-col gap-2 p-2 border-1 rounded-md"
                    >
                      <FieldLabel
                        className="border-none"
                        htmlFor={`location-option-${location.id}`}
                      >
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{location.title}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value={location.id}
                            id={`location-option-${location.id}`}
                            aria-invalid={fieldState.invalid}
                          />
                        </Field>
                      </FieldLabel>

                      {/* Physical */}
                      {field.value === "physical" &&
                        location.id === "physical" && (
                          <div className="flex flex-col gap-2 pl-1">
                            <Controller
                              name="location.venueName"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="flex-row gap-0"
                                >
                                  <FieldLabel htmlFor="venue-name">
                                    Venue Name
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    id="venue-name"
                                    placeholder="e.g. Grand Hall"
                                    aria-invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                            <Controller
                              name="location.venueAddress"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="flex-row gap-0 w-full"
                                >
                                  <FieldLabel htmlFor="physical-venue-address">
                                    Address
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    id="physical-venue-address"
                                    placeholder="e.g. 123 Main St, New York, NY"
                                    aria-invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                        )}

                      {/* Virtual */}
                      {field.value === "virtual" &&
                        location.id === "virtual" && (
                          <div className="flex flex-col gap-2">
                            <Controller
                              name="location.meetingLink"
                              control={form.control}
                              render={({ field, fieldState }) => (
                                <Field
                                  data-invalid={fieldState.invalid}
                                  className="flex-row"
                                >
                                  <FieldLabel htmlFor="meeting-link">
                                    Meeting Link
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    id="meeting-link"
                                    type="url"
                                    placeholder="e.g. https://zoom.us/j/123456789"
                                    aria-invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </div>
                        )}

                      {/* Hybrid */}
                      {field.value === "hybrid" && location.id === "hybrid" && (
                        <div className="flex flex-col gap-2">
                          <Controller
                            name="location.venueName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                className="flex-row"
                              >
                                <FieldLabel htmlFor="hybrid-venue-name">
                                  Venue Name
                                </FieldLabel>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  id="hybrid-venue-name"
                                  placeholder="e.g. Grand Hall, Convention Center"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="location.venueAddress"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                className="flex-row"
                              >
                                <FieldLabel htmlFor="hybrid-venue-address">
                                  Address
                                </FieldLabel>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  id="hybrid-venue-address"
                                  placeholder="e.g. 123 Main St, New York, NY"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            name="location.meetingLink"
                            control={form.control}
                            render={({ field, fieldState }) => (
                              <Field
                                data-invalid={fieldState.invalid}
                                className="flex-row"
                              >
                                <FieldLabel htmlFor="hybrid-meeting-link">
                                  Meeting Link
                                </FieldLabel>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  id="hybrid-meeting-link"
                                  type="url"
                                  placeholder="e.g. https://zoom.us/j/123456789"
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </>
            )}
          />
        </FieldSet>
      </FieldGroup>
    </TabsContent>
  );
}

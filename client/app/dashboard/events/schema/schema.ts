import { z } from "zod";

// ─── General Tab ─────────────────────────────────────────────────────────────

export const allowedTypes = [
  "application/pdf",

  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const FileSchema = z
  .instanceof(File)
  .refine((file) => (allowedTypes as string[]).includes(file?.type), {
    message: "Unsupported file type",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File must be smaller than 10MB",
  });

const detailsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  category: z
    .string({ error: "Please select a category" })
    .min(1, "Please select a category"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(300, "Description must be 300 characters or less"),

  file: z.array(FileSchema).max(5, "You can upload up to 5 files").optional(),
});

const scheduleSchema = z.object({
  schedule: z
    .object({
      date: z.coerce.date({ error: "Please select a date" }),
      startTime: z.iso.time({ error: "Invalid start time" }),
      endTime: z.iso.time({ error: "Invalid end time." }),
    })
    .refine(
      (val) => {
        if (!val.startTime || !val.endTime) return true;
        return val.startTime < val.endTime;
      },
      {
        message: "End time must be after start time",
        path: ["endTime"],
      },
    ),

  frequency: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("one-time"),
    }),
    z.object({
      type: z.literal("recurring"),
      repeatInterval: z
        .number({ error: "Interval is required" })
        .min(1, "Interval must be at least 1"),
      repeatUnit: z.enum(["hours", "days", "weeks", "months", "years"], {
        error: "Please select a unit",
      }),
      stopCondition: z.discriminatedUnion("type", [
        z.object({
          type: z.literal("never"),
        }),
        z.object({
          type: z.literal("on-date"),
          endDate: z.coerce.date({ error: "Please select an end date" }),
        }),
        z.object({
          type: z.literal("after"),
          count: z
            .number({ error: "Count is required" })
            .min(1, "Must stop after at least 1 occurrence"),
          unit: z.enum(["occurrences", "days", "weeks", "months"], {
            error: "Please select a unit",
          }),
        }),
      ]),
    }),
  ]),

  location: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("physical"),
      venueName: z.string().min(1, "Venue name is required"),
      venueAddress: z.string().min(1, "Address is required"),
    }),
    z.object({
      type: z.literal("virtual"),
      meetingLink: z.url("Please enter a valid URL"),
    }),
    z.object({
      type: z.literal("hybrid"),
      venueName: z.string().min(1, "Venue name is required"),
      venueAddress: z.string().min(1, "Address is required"),
      meetingLink: z.url("Please enter a valid URL"),
    }),
  ]),
});

const participantsSchema = z.object({
  participants: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("everyone"),
      years: z.array(z.string()).default([]),
      departments: z.array(z.string()).default([]),
      courses: z.array(z.string()).default([]),
    }),
    z
      .object({
        type: z.literal("criteria"),
        years: z.array(z.string()).default([]),
        departments: z.array(z.string()).default([]),
        courses: z.array(z.string()).default([]),
      })
      .refine(
        (val) =>
          val.years.length > 0 ||
          val.departments.length > 0 ||
          val.courses.length > 0,
        {
          message: "Please select at least one year, department, or course",
          path: ["years"],
        },
      ),
  ]),
});

export const eventFormSchema = z.object({
  ...detailsSchema.shape,
  ...scheduleSchema.shape,
  ...participantsSchema.shape,
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const eventFormDefaultValues: Partial<EventFormValues> = {
  title: "",
  category: "",
  description: "",
  file: [],
  schedule: undefined,
  frequency: undefined,
  location: undefined,
  participants: undefined,
};

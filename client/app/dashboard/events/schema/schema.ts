

const scheduleSchema = z.object({
  schedule: z
    .object({
      date: z.coerce.date({ error: "Please select a date." }),
      startTime: z.iso.time({ error: "Invalid start time." }),
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
    )
    .refine(
      (val) => {
        if (val.date instanceof Date) return true;
      },
      {
        message: "Please select a date.",
        path: ["date"],
      },
    )
    .refine(
      (val) => {
        if (val.date && val.date > new Date(Date.now())) return true;
      },
      {
        message: "Event date must be after current date.",
        path: ["date"],
      },
    ),

  frequency: z.discriminatedUnion(
    "type",
    [
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
        stopCondition: z.discriminatedUnion(
          "type",
          [
            z.object({
              type: z.literal("never"),
            }),
            z
              .object({
                type: z.literal("on-date"),
                endDate: z.coerce.date({ error: "Please select a date." }),
              })
              .refine(
                (val) => {
                  if (val.endDate instanceof Date) return true;
                },
                {
                  error: "Please select a date.",
                },
              )
              .refine(
                (val) => {
                  if (val.endDate && val.endDate >= new Date(Date.now()))
                    return true;
                },
                {
                  message: "End date must be after current date.",
                  path: ["endDate"],
                },
              ),
            z.object({
              type: z.literal("after"),
              count: z
                .number({ error: "Count is required" })
                .min(1, "Must stop after at least 1 occurrence"),
              afterUnit: z.enum(["occurrences", "days", "weeks", "months"], {
                error: "Please select a unit",
              }),
            }),
          ],
          {
            error: "Please select when to stop repeating.",
          },
        ),
      }),
    ],
    { error: "Please select when to remind" },
  ),

  location: z.discriminatedUnion(
    "type",
    [
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
    ],
    { error: "Please select a venue." },
  ),
});

// const participantsSchema = z.object({
//   participants: z.discriminatedUnion(
//     "type",
//     [
//       z.object({
//         type: z.literal("everyone"),
//         // years: z.array(z.string()).default([]),
//         // departments: z.array(z.string()).default([]),
//         // courses: z.array(z.string()).default([]),
//       }),
//       z
//         .object({
//           type: z.literal("criteria"),
//           years: z.array(z.string()).default([]),
//           departments: z.array(z.string()).default([]),
//           courses: z.array(z.string()).default([]),
//         })
//         .refine(
//           (val) =>
//             val.years.length > 0 ||
//             val.departments.length > 0 ||
//             val.courses.length > 0,
//           {
//             message: "Please select at least one year, department, or course",
//             path: ["years"],
//           },
//         ),
//     ],
//     {
//       error: "Please select who attends the event.",
//     },
//   ),
// });

// export const EventFormSchema = z.object({
//   ...detailsSchema.shape,
//   ...scheduleSchema.shape,
//   ...participantsSchema.shape,
// });

// export type EventFormValues = z.infer<typeof EventFormSchema>;

// export const EventFormDefaultValues: EventFormValues = {
//   title: "",
//   category: "",
//   description: "",
//   file: [],
//   schedule: {
//     startTime: "",
//     endTime: "",
//     date: new Date(Date.now()),
//   },
//   frequency: {
//     type: "one-time",
//   },
//   location: {
//     type: "physical",
//     venueName: "",
//     venueAddress: "",
//   },
//   participants: {
//     type: "everyone",
//   },
// };

import * as z from "zod";

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
  .refine((file) => (allowedTypes as string[]).includes(file.type), {
    message: "Unsupported file type",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File must be smaller than 10MB",
  });

export const EventFormSchema = z.object({
  // Details Section
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
  file: z.array(FileSchema).max(5, "You can upload up to 5 files"),

  // Schedule Section
   schedule: z
  .object({
    date: z.coerce.date({ error: "Please select a date." }),
    startTime: z.string().time({ message: "Invalid start time." }), // Assuming .time() helper
    endTime: z.string().time({ message: "Invalid end time." }),
  })
  .superRefine(({ date, startTime, endTime }, ctx) => {
    const now = new Date();

    // 1. Date Validation
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a valid date.",
        path: ["date"],
      });
    } else if (date <= now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event date must be after current date.",
        path: ["date"],
      });
    }

    // 2. Time Comparison Validation
    if (startTime && endTime && startTime >= endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endTime"],
      });
    }
  })


  // Frequency Section
  frequency: z.discriminatedUnion("type", [
    z.object({ type: z.literal("one-time") }),
    z.object({
      type: z.literal("recurring"),
      repeatInterval: z.number({ error: "Interval is required" }).min(1),
      repeatUnit: z.enum(["hours", "days", "weeks", "months", "years"]),
      stopCondition: z.discriminatedUnion("type", [
        z.object({ type: z.literal("never") }),
        z
          .object({
            type: z.literal("on-date"),
            endDate: z.date({ error: "Please select a date." }),
          })
          .refine((val) => val.endDate >= new Date(), {
            message: "End date must be in the future.",
            path: ["endDate"],
          }),
        z.object({
          type: z.literal("after"),
          count: z.number().min(1),
          afterUnit: z.enum(["occurrences", "days", "weeks", "months"]),
        }),
      ]),
    }),
  ]),

  // Location Section
  location: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("physical"),
      venueName: z.string().min(1, "Venue name is required"),
      venueAddress: z.string().min(1, "Address is required"),
    }),
    z.object({
      type: z.literal("virtual"),
      meetingLink: z.string().url("Please enter a valid URL"),
    }),
    z.object({
      type: z.literal("hybrid"),
      venueName: z.string().min(1, "Venue name is required"),
      venueAddress: z.string().min(1, "Address is required"),
      meetingLink: z.string().url("Please enter a valid URL"),
    }),
  ]),

  // Participants Section
  participants: z.discriminatedUnion("type", [
    z.object({ type: z.literal("everyone") }),
    z
      .object({
        type: z.literal("criteria"),
        years: z.array(z.string()),
        departments: z.array(z.string()),
        courses: z.array(z.string()),
      })
      .refine(
        (val) =>
          val.years.length > 0 ||
          val.departments.length > 0 ||
          val.courses.length > 0,
        {
          message: "Select at least one year, department, or course",
          path: ["years"],
        },
      ),
  ]),
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

export const EventFormDefaultValues: EventFormValues = {
  title: "",
  category: "",
  description: "",
  file: [],
  schedule: {
    startTime: "",
    endTime: "",
    date: new Date(),
  },
  frequency: { type: "one-time" },
  location: {
    type: "physical",
    venueName: "",
    venueAddress: "",
  },
  participants: { type: "everyone" },
};

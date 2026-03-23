import { z } from "zod";

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

export const CreateTaskSchema = z.object({
  courseId: z.string(),
  time: z.iso.time({ error: "Invalid Time." }),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(120),

  description: z.string().trim().max(2000).min(10),

  instructions: z.string().trim().max(2000).optional().or(z.literal("")),
  priorityStatus: z.enum(["low", "medium", "high"], {
    error: () => ({ message: "Priority must be selected" }),
  }),

  maxPoints: z
    .number()
    .min(0, { message: "Max points cannot be negative" })
    .max(100, { message: "Max points cannot exceed 100" }),

  submissionType: z.enum(["fileUpload", "textEntry", "websiteUrl"]),

  dueDate: z.date({
    error: "Due date is required",
  }),

  attachments: z
    .array(FileSchema)
    .max(5, "You can upload up to 5 files")
    .optional(),
  extendDate: z.boolean(),
  comments: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type CreateTaskValues = z.infer<typeof CreateTaskSchema>;
export type FileAttachements = z.infer<typeof File>;

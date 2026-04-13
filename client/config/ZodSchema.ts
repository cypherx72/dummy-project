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

export const urlSchema = z
  .string()
  .url("Enter a valid URL (e.g. https://github.com/you/repo).")
  .max(500, "URL is too long.");

export const textSchema = z
  .string()
  .min(10, "Response must be at least 10 characters.")
  .max(2000, "Cannot exceed 2000 characters.");

export const FileSchema = z
  .instanceof(File)
  .refine((file) => (allowedTypes as string[]).includes(file.type), {
    message: "Unsupported file type",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File must be smaller than 10MB",
  });

export const AssignmentSchema = z
  .object({
    submissionType: z.enum(["fileUpload", "textEntry", "websiteUrl"]),
    attachments: z.any().optional(),
    text: z.string().optional(),
    url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.submissionType === "fileUpload") {
      const fileResult = FileSchema.safeParse(data.attachments);

      if (!fileResult.success) {
        const tree = z.treeifyError(fileResult.error);

        // ❌ Multiple addIssue calls to the same path = RHF only keeps the last
        // ✅ One issue, all messages collected together
        ctx.addIssue({
          code: "custom",
          path: ["file"],
          message: tree.errors.join(", "), // for fieldState.error.message
          params: {
            messages: tree.errors, // for fieldState.error.types if you want the array
          },
        });
      }
    }

    if (data.submissionType === "textEntry") {
      const textResult = textSchema.safeParse(data.text);
      if (!textResult.success) {
        const tree = z.treeifyError(textResult.error);

        tree.errors.map((err) => {
          console.log(err);
          ctx.addIssue({
            code: "custom",
            message: err,
            path: ["text"],
          });
        });
      }
    }

    if (data.submissionType === "websiteUrl") {
      const urlResult = urlSchema.safeParse(data.url);
      if (!urlResult.success) {
        const tree = z.treeifyError(urlResult.error);

        tree.errors.map((err) => {
          console.log(err);
          ctx.addIssue({
            code: "custom",
            message: err,
            path: ["url"],
          });
        });
      }
    }
  });

export type AssignmentFormValues = z.infer<typeof AssignmentSchema>;

// Schemas for SignIn form
export const SignInSchema = z.object({
  email: z.string().regex(/^\d{8}@vupune\.ac\.in$/, {
    message: "Enter a valid university email (e.g. SRN@vupune.ac.in)",
  }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=\[\]\\{}|;':",.<>\/?]).*$/,
      {
        error:
          "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    ),
});

export const LoginInSchema = z.object({
  email: z.string().regex(/^\d{8}@vupune\.ac\.in$/, {
    message: "Enter a valid university email (e.g. SRN@vupune.ac.in)",
  }),
  password: z.string(),
});

export const ResetSchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=\[\]\\{}|;':",.<>\/?]).*$/,
      {
        error:
          "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    ),
  confirmpassword: z.string(),
});

// Schemas for Registration form
export function OTPSchema() {
  return z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  });
}

export function RegistrationSchema() {
  return z.object({
    registrationId: z.string().regex(/^\d{10,}$/, {
      message: "Registration ID must be at least 10 digits.",
    }),
    countryCode: z.string().regex(/^\+\d+$/, {
      message: "Invalid country code format.",
    }),
    mobileNumber: z.string().regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits.",
    }),
  });
}

// shcema for media validation

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

// export const fileSchema = z
//   .any()
//   .refine(
//     (f) => f instanceof File,

//     {
//       message: "No file provided.",
//     },
//   )
//   .refine(
//     (file) => file.size <= MAX_FILE_SIZE,

//     {
//       message: `The file is too large. Max size is ${
//         MAX_FILE_SIZE / (1024 * 1024)
//       }MB.`,
//     },
//   )
//   .refine(
//     (file) => ACCEPTED_MIME_TYPES.includes(file.type),

//     {
//       message: "Only JPEG, PNG, WebP images or PDF files are allowed.",
//     },
//   );

export const MediaSchema = z
  .any()
  .refine(
    (f) => f instanceof File,

    {
      message: "No file provided.",
    },
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,

    {
      message: `The file is too large. Max size is ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB.`,
    },
  )
  .refine(
    (file) => ACCEPTED_MIME_TYPES.includes(file.type),

    {
      message: "Only JPEG, PNG, WebP images or PDF files are allowed.",
    },
  );

// export type ValidatedFile = z.infer<typeof fileSchema>;

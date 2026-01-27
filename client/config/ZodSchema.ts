import { z } from "zod";

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
      }
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
      }
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

export const MediaSchema = z
  .any()
  .refine(
    (f) => f instanceof File,

    {
      message: "No file provided.",
    }
  )
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,

    {
      message: `The file is too large. Max size is ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB.`,
    }
  )
  .refine(
    (file) => ACCEPTED_MIME_TYPES.includes(file.type),

    {
      message: "Only JPEG, PNG, WebP images or PDF files are allowed.",
    }
  );

export type ValidatedFile = z.infer<typeof fileSchema>;

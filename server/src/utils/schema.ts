import z from "zod";

export const AUTH_SCHEMA = z.object({
  email: z.string().regex(/^\d{8}@vupune\.ac\.in$/, {
    message: "Enter a valid university email",
  }),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=\[\]\\{}|;':",.<>\/?]).{8,}$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character.",
      },
    ),
});

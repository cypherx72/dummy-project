import z from "zod";

const FormSchema = z.object({
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

type fields = z.infer<typeof FormSchema>;

export const validateFields = (fields: fields) => {
  const email = fields?.email;
  const password = fields?.password;

  if (email && password) return FormSchema.safeParse({ email, password });
  else if (email) return FormSchema.pick({ email: true }).safeParse({ email });
  else if (password)
    return FormSchema.pick({ password: true }).safeParse({ password });
  else return null;
};

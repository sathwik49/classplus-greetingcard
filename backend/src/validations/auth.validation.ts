import * as z from "zod";

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(255, { message: "Password must not exceed 255 characters" }),
});

export const userLoginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().trim().min(1, { message: "Password is required" }),
});

export type UserRegistrationSchematype = z.infer<typeof userRegistrationSchema>;
export type UserLoginSchematype = z.infer<typeof userLoginSchema>;

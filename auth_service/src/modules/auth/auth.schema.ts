import { z } from "zod";

const emailSchema = z.email({
  error: (issue) =>
    issue.input === undefined
      ? "Email address is required"
      : "Invalid email address",
});

export const registerSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email address is required"
        : "Invalid email address",
  }),
  password: z.string().min(8, "Password must be at least 8 char long"),
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "OTP is required" : "OTP should be numbers",
    })
    .min(100000, { message: "OTP should be 6 digits" })
    .max(999999, { message: "OTP should be 6 digits" }),
});

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email address is required"
        : "Invalid email address",
  }),
  password: z.string().min(8, "Password must be at least 8 char long"),
});

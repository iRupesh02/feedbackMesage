import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "username must not be more than 20 characters")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/,
    "Username must not contain special character"
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(
      /^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\\.[a-zA-Z]{2,}$/,
      "Email address is not valid"
    ),
  password: z
    .string()
    .min(6, { message: "password at least 6 character" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      " give strong password"
    ),
});

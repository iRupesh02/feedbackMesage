import {z} from 'zod'

export const signInSchema=z.object({
   identifier:z.string(),
   password: z
    .string()
    .min(6, { message: "password at least 6 character" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      " give strong password"
    )
})
import * as z from "zod";

export enum Role {
    superadmin = "superadmin",
    admin = "admin",
    staff = "staff",
}

export const SignupFormSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Name must be at least 2 characters long." })
            .trim(),
        email: z.email("Please enter a valid email.").trim(),
        password: z
            .string()
            .min(8, { message: "Be at least 8 characters long" })
            .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
            .regex(/[0-9]/, { message: "Contain at least one number." })
            .regex(/[^a-zA-Z0-9]/, {
                message: "Contain at least one special character.",
            })
            .trim(),
        confirmPassword: z
            .string()
            .min(8, { message: "Please confirm your password" }),
        role: z.enum(["superadmin", "admin", "staff"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const LoginFormSchema = z.object({
    email: z.email("Please enter a valid email.").trim(),
    password: z
        .string()
        .min(8, { message: "Be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
        })
        .trim(),
});

export type SignUpFormState =
    | {
          errors?: {
              name?: string[];
              email?: string[];
              password?: string[];
              confirmPassword?: string[];
              role?: string[];
          };
          message?: string;
      }
    | undefined;

export type LoginFormState =

    | {

          errors?: {

              email?: string[];

              password?: string[];

          };

          message?: string;

      }

    | undefined;



export const changePasswordFormSchema = z

    .object({

        currentPassword: z.string().min(1, {

            message: "Current password is required.",

        }),

        newPassword: z.string().min(6, {

            message: "New password must be at least 6 characters.",

        }),

        confirmPassword: z.string(),

    })

    .refine((data) => data.newPassword === data.confirmPassword, {

        message: "Passwords don't match",

        path: ["confirmPassword"],

    });



export type ChangePasswordFormValues = z.infer<

    typeof changePasswordFormSchema

>;



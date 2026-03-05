import {z} from "zod";

import {AuthMethod} from "@/shared/config";

const emailFieldSchema = z
    .string()
    .min(1, "Email is required")
    .refine((value) => z.email().safeParse(value).success, "Invalid email");
const phoneFieldSchema = z.string().min(1, "Phone is required");
const passwordFieldSchema = z.string().min(1, "Password is required");

export const loginFormSchema = z
    .object({
        email: z.string(),
        phone: z.string(),
        password: passwordFieldSchema,
        method: z.enum([AuthMethod.EMAIL, AuthMethod.PHONE]),
    })
    .superRefine((value, context) => {
        if (value.method === AuthMethod.EMAIL) {
            const result = emailFieldSchema.safeParse(value.email ?? "");
            if (!result.success) {
                context.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: result.error.issues[0]?.message ?? "Invalid email",
                });
            }
            return;
        }

        const phoneResult = phoneFieldSchema.safeParse(value.phone ?? "");
        if (!phoneResult.success) {
            context.addIssue({
                code: "custom",
                path: ["phone"],
                message: phoneResult.error.issues[0]?.message ?? "Invalid phone",
            });
        }
    });

export type LoginFormValues = z.infer<typeof loginFormSchema>;

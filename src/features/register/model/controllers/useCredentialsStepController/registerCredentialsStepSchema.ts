import {z} from "zod";

import {AuthMethod} from "@/shared/config";

export const registerCredentialsSchema = z.object({
    method: z.enum([AuthMethod.EMAIL, AuthMethod.PHONE]),
    email: z.string(),
    phone: z.string(),
});

export const registerCredentialsStepSchema = registerCredentialsSchema.superRefine(
    (value, context) => {
        if (value.method === AuthMethod.EMAIL) {
            if (!value.email) {
                context.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Email is required",
                });
            } else if (!z.email().safeParse(value.email).success) {
                context.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Invalid email",
                });
            }
            return;
        }

        if (!value.phone) {
            context.addIssue({
                code: "custom",
                path: ["phone"],
                message: "Phone is required",
            });
        }
    },
);

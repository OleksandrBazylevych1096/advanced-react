import {z} from "zod";

import {registerPasswordSchema} from "../ui/CreatePasswordStep/useCreatePasswordStep/registerPasswordSchema.ts";
import {
    registerCredentialsSchema,
    registerCredentialsStepSchema,
} from "../ui/CredentialsStep/useCredentialsStep/registerCredentialsStepSchema.ts";
import {registerVerificationSchema} from "../ui/VerificationStep/useVerificationStep/registerVerificationSchema.ts";

export const registerFormValidationSchema = registerCredentialsSchema
    .extend(registerPasswordSchema.shape)
    .extend({
        ...registerVerificationSchema.partial().shape,
    })
    .superRefine((value, context) => {
        const credentialsCheck = registerCredentialsStepSchema.safeParse(value);

        if (credentialsCheck.success) {
            return;
        }

        for (const issue of credentialsCheck.error.issues) {
            context.addIssue({
                code: "custom",
                path: issue.path,
                message: issue.message,
            });
        }
    });

export type RegisterFlowValues = z.infer<typeof registerFormValidationSchema>;

import {z} from "zod";

import {registerPasswordSchema} from "./controllers/useCreatePasswordStepController/registerPasswordSchema";
import {
    registerCredentialsSchema,
    registerCredentialsStepSchema,
} from "./controllers/useCredentialsStepController/registerCredentialsStepSchema";
import {registerVerificationSchema} from "./controllers/useVerificationStepController/registerVerificationSchema";

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

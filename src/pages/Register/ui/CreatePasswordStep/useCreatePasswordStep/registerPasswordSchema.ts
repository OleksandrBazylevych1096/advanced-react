import {z} from "zod";

import {getPasswordRequirementsState, isPasswordValid} from "@/shared/lib/validation";

export {getPasswordRequirementsState as getRegisterPasswordRequirementsState};

export const registerPasswordSchema = z.object({
    password: z
        .string()
        .min(1, "Password is required")
        .refine((value) => isPasswordValid(value), "Password does not meet requirements"),
});

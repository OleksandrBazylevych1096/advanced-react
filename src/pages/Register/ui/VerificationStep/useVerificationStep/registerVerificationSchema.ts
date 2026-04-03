import {z} from "zod";

export const registerVerificationSchema = z.object({
    code: z.string().length(4, "Code must be 4 digits").regex(/^\d+$/, "Invalid code"),
});

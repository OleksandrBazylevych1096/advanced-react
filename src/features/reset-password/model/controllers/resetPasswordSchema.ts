import {z} from "zod";

import {i18n} from "@/shared/config";
import {isPasswordValid} from "@/shared/lib";

export const resetPasswordSchema = z.object({
    token: z.string().min(1, i18n.t("auth:resetPassword.errors.missingToken")),
    newPassword: z
        .string()
        .min(1, i18n.t("auth:resetPassword.errors.passwordRequired"))
        .refine(
            (value) => isPasswordValid(value),
            i18n.t("auth:resetPassword.errors.passwordRequirements"),
        ),
});

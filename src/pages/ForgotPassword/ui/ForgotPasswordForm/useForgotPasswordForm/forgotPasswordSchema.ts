import {z} from "zod";

import {i18n} from "@/shared/config";

export const forgotPasswordSchema = z.object({
    identifier: z
        .string()
        .min(1, i18n.t("auth:forgotPassword.errors.emailRequired"))
        .email(i18n.t("auth:forgotPassword.errors.invalidEmail")),
});

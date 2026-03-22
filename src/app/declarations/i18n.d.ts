import "i18next";
import type {SupportedLngsType} from "@/shared/config";

declare module "i18next" {
    interface i18n {
        language: SupportedLngsType;
        languages: SupportedLngsType[];
    }
}

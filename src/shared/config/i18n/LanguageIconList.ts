import type { FunctionComponent, SVGProps } from "react";

import EnglishIcon from "@/shared/assets/icons/English.svg?react";
import GermanyIcon from "@/shared/assets/icons/German.svg?react";

import type { supportedLngs } from "./i18n";


export type SupportedLngsType = (typeof supportedLngs)[number];

type LanguageIconListType = Record<
  SupportedLngsType,
  FunctionComponent<SVGProps<SVGSVGElement>>
>;

export const languageIconList: LanguageIconListType = {
  en: EnglishIcon,
  de: GermanyIcon,
};

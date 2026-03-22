import {generatePath} from "react-router";

import type {SupportedLngsType} from "@/shared/config";
import {AppRoutes, routePaths} from "@/shared/config";

export const generateCategoryHref = (slug: string, locale: SupportedLngsType): string => {
    return generatePath(routePaths[AppRoutes.CATEGORY], {slug, lng: locale});
};

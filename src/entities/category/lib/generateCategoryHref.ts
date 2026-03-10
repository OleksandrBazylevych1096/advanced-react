import {generatePath} from "react-router";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";

export const generateCategoryHref = (slug: string, locale: SupportedLngsType): string => {
    return generatePath(routePaths[AppRoutes.CATEGORY], {slug, lng: locale});
};

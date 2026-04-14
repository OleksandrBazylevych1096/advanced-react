import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

interface CategoryNavigationGoBackItemProps {
    parentSlug?: string;
}

export const CategoryNavigationGoBackItem = (props: CategoryNavigationGoBackItemProps) => {
    const {parentSlug} = props;
    const {t} = useTranslation();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();

    const goBack = () => {
        if (parentSlug) {
            navigate(
                getLocalizedPath(routePaths[AppRoutes.CATEGORY], {
                    slug: parentSlug,
                }),
            );
        } else {
            navigate(getLocalizedPath(routePaths[AppRoutes.HOME]));
        }
    };

    return (
        <Button theme={"secondary"} onClick={goBack}>
            <AppIcon Icon={ArrowLeft} />
            {t("common.back")}
        </Button>
    );
};

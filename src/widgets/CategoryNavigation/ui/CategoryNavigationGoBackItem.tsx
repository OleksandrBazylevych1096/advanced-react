import {useTranslation} from "react-i18next";
import {generatePath, useNavigate, useParams} from "react-router";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {AppIcon, Button} from "@/shared/ui";

interface CategoryNavigationGoBackItemProps {
    parentSlug?: string;
}

export const CategoryNavigationGoBackItem = (props: CategoryNavigationGoBackItemProps) => {
    const {parentSlug} = props;
    const navigate = useNavigate();
    const {lng} = useParams();
    const {i18n} = useTranslation();

    const goBack = () => {
        if (parentSlug) {
            navigate(
                generatePath(routePaths[AppRoutes.CATEGORY], {
                    lng: lng || i18n.language,
                    slug: parentSlug,
                }),
            );
        } else {
            navigate(routePaths[AppRoutes.HOME]);
        }
    };

    return (
        <Button theme={"secondary"} onClick={goBack}>
            <AppIcon Icon={ArrowLeft}/>
            Back
        </Button>
    );
};

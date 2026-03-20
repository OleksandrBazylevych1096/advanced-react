import {useNavigate} from "react-router";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib";
import {AppIcon, Button} from "@/shared/ui";

interface CategoryNavigationGoBackItemProps {
    parentSlug?: string;
}

export const CategoryNavigationGoBackItem = (props: CategoryNavigationGoBackItemProps) => {
    const {parentSlug} = props;
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
            Back
        </Button>
    );
};

import {generatePath, useNavigate} from "react-router";

import ArrowLeft from '@/shared/assets/icons/ArrowLeft.svg?react'
import {routePaths} from "@/shared/config";
import {AppIcon, Button} from "@/shared/ui";

interface CategoryNavigationGoBackItemProps {
    parentSlug: string | undefined

}

export const CategoryNavigationGoBackItem = (props: CategoryNavigationGoBackItemProps) => {
    const {parentSlug} = props

    const navigate = useNavigate()

    const handleClickBack = () => {
        if (parentSlug) {
            const path = generatePath(routePaths.category, {
                slug: parentSlug
            })
            navigate(path)
        } else {
            navigate(routePaths.home)
        }
    }


    return (
        <Button theme={'secondary'} onClick={handleClickBack}><AppIcon Icon={ArrowLeft}/>Back</Button>
    );
};


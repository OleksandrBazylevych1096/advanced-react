import {generatePath, useNavigate, useParams} from "react-router";

import ArrowLeft from '@/shared/assets/icons/ArrowLeft.svg?react'
import {routePaths, type SupportedLngsType} from "@/shared/config";
import {AppIcon, Button} from "@/shared/ui";

interface CategoryNavigationGoBackItemProps {
    parentSlug?: string

}

export const CategoryNavigationGoBackItem = (props: CategoryNavigationGoBackItemProps) => {
    const {parentSlug} = props
    const {lng} = useParams<{ lng: SupportedLngsType }>()

    const navigate = useNavigate()

    const handleClickBack = () => {

        if (lng && parentSlug) {
            const path = generatePath(routePaths.category, {
                slug: parentSlug,
                lng
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


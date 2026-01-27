import {useTranslation} from "react-i18next";
import {generatePath, useNavigate, useParams} from "react-router";

import {routePaths} from "@/shared/config";
import {cn} from "@/shared/lib";
import {AppIcon, Button} from "@/shared/ui";

import {CategoriesIconMap} from "../config/categoriesIconMap";

import styles from "./CategoryNavigation.module.scss";

interface CategoryNavigationItemProps {
    title: string;
    slug: string;
    icon?: string;
}

export const CategoryNavigationItem = (props: CategoryNavigationItemProps) => {
    const {title, icon, slug} = props;
    const {slug: slugParam, lng} = useParams();
    const navigate = useNavigate();
    const {i18n} = useTranslation()

    const isActive = slug === slugParam;

    const handleClick = () => {
        const path = generatePath(routePaths.category, {
            slug,
            lng: lng || i18n.language
        });
        navigate(path);
    };

    const CategoryIcon =
        CategoriesIconMap[icon || ""] ?? CategoriesIconMap.fallback;

    return (
        <Button
            onClick={handleClick}
            className={cn(styles.category, {
                [styles.active]: isActive
            })}
            theme={"secondary"}
        >
            <AppIcon Icon={CategoryIcon}/>
            {title}
        </Button>
    );
};
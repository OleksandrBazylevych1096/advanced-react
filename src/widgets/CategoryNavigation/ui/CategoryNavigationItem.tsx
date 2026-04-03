import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

import {CategoriesIconMap} from "../config/categoriesIconMap";

import styles from "./CategoryNavigation.module.scss";

interface CategoryNavigationItemProps {
    title: string;
    icon?: string;
    isActive?: boolean;
    onClick: () => void;
}

export const CategoryNavigationItem = (props: CategoryNavigationItemProps) => {
    const {title, icon, isActive = false, onClick} = props;

    const CategoryIcon = CategoriesIconMap[icon || ""] ?? CategoriesIconMap.fallback;

    return (
        <Button
            onClick={onClick}
            className={cn(styles.category, {
                [styles.active]: isActive,
            })}
            theme={"secondary"}
        >
            <AppIcon Icon={CategoryIcon} />
            {title}
        </Button>
    );
};

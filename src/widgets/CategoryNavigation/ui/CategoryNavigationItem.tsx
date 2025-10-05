import { AppIcon, Button } from "@/shared/ui";

import { CategoriesIconMap } from "../config/categoriesIconMap";

import styles from "./CategoryNavigation.module.scss";

interface CategoryNavigationItemProps {
  title: string;
  slug: string;
  icon?: string;
}

export const CategoryNavigationItem = (props: CategoryNavigationItemProps) => {
  const { title, icon } = props;
  const categoryIcon =
    CategoriesIconMap[icon || ""] ?? CategoriesIconMap.fallback;

  return (
    <Button className={styles.category} theme="secondary">
      <AppIcon Icon={categoryIcon} />
      {title}
    </Button>
  );
};

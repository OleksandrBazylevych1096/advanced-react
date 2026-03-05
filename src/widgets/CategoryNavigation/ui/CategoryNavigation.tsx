import {useTranslation} from "react-i18next";

import {CategoryNavigationGoBackItem} from "@/widgets/CategoryNavigation/ui/CategoryNavigationGoBackItem.tsx";

import {Carousel, CarouselSkeleton, ErrorState} from "@/shared/ui";

import {useCategoryNavigationController} from "../model/controllers/useCategoryNavigationController";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationItem} from "./CategoryNavigationItem";

export const CategoryNavigation = () => {
    const {t} = useTranslation();
    const {
        data: {data},
        status: {isLoading, isError},
        actions: {refetch},
    } = useCategoryNavigationController();

    if (isLoading) {
        return (
            <CarouselSkeleton
                className={styles.categorySkeletonContainer}
                count={15}
                ItemSkeletonComponent={<div className={styles.categorySkeleton} />}
            />
        );
    }

    if (isError) {
        return <ErrorState message={t("products.loadCategoriesError")} onRetry={refetch} />;
    }

    if (!data?.items?.length) {
        return null;
    }

    return (
        <Carousel className={styles.categories}>
            {data.isShowingSubcategories && (
                <CategoryNavigationGoBackItem parentSlug={data?.parentCategory?.slug} />
            )}
            {data.items.map((item) => (
                <CategoryNavigationItem
                    key={item.slug}
                    title={item.name}
                    slug={item.slug}
                    icon={item.icon}
                />
            ))}
        </Carousel>
    );
};

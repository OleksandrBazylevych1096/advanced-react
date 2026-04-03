import {useTranslation} from "react-i18next";

import {Carousel, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";
import {ErrorState} from "@/shared/ui/StateViews";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationGoBackItem} from "./CategoryNavigationGoBackItem.tsx";
import {CategoryNavigationItem} from "./CategoryNavigationItem";
import {useCategoryNavigation} from "./useCategoryNavigation/useCategoryNavigation.ts";

interface CategoryNavigationProps {
    searchQuery?: string;
    slug?: string;
}

export const CategoryNavigation = ({searchQuery, slug}: CategoryNavigationProps = {}) => {
    const {t} = useTranslation();
    const {
        data: {navigationData, selectedCategoryId, isSearchMode},
        status: {isLoading, isError},
        actions: {refetch, selectCategory},
    } = useCategoryNavigation({searchQuery, slug});

    if (isLoading) {
        return (
            <CarouselSkeleton
                className={styles.categorySkeletonContainer}
                count={15}
                ItemSkeletonComponent={<Skeleton width={120} height={42} borderRadius={16} />}
            />
        );
    }

    if (isError) {
        return <ErrorState message={t("products.loadCategoriesError")} onRetry={refetch} />;
    }

    if (!navigationData?.items?.length) {
        return null;
    }

    return (
        <Carousel className={styles.categories}>
            {navigationData.isShowingSubcategories && (
                <CategoryNavigationGoBackItem parentSlug={navigationData?.parentCategory?.slug} />
            )}
            {navigationData.items.map((item) => (
                <CategoryNavigationItem
                    key={item.id}
                    title={item.name}
                    icon={item.icon}
                    isActive={isSearchMode ? selectedCategoryId === item.id : item.slug === slug}
                    onClick={() => selectCategory({id: item.id, slug: item.slug})}
                />
            ))}
        </Carousel>
    );
};

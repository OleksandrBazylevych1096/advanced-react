import {useTranslation} from "react-i18next";
import {generatePath, useNavigate, useSearchParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";
import {CategoryNavigationGoBackItem} from "@/widgets/CategoryNavigation/ui/CategoryNavigationGoBackItem.tsx";

import {AppRoutes, routePaths} from "@/shared/config";
import {Carousel, CarouselSkeleton} from "@/shared/ui/Carousel";
import {Skeleton} from "@/shared/ui/Skeleton";
import {ErrorState} from "@/shared/ui/StateViews";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationItem} from "./CategoryNavigationItem";

interface CategoryNavigationProps {
    searchQuery?: string;
    slug?: string;
}

export const CategoryNavigation = ({searchQuery, slug}: CategoryNavigationProps = {}) => {
    const {t} = useTranslation();
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategoryId = searchParams.get("categoryId");
    const {data, isLoading, isError, refetch} = useGetCategoryNavigationQuery(
        {
            slug: slug,
            searchQuery,
            locale: i18n.language,
        },
        {skip: !i18n.language},
    );

    const selectCategory = (item: {id: string; slug: string}) => {
        if (searchQuery) {
            const updatedParams = new URLSearchParams(searchParams);

            if (selectedCategoryId === item.id) {
                updatedParams.delete("categoryId");
            } else {
                updatedParams.set("categoryId", item.id);
            }

            setSearchParams(updatedParams, {replace: true});
            return;
        }

        const path = generatePath(routePaths[AppRoutes.CATEGORY], {
            slug: item.slug,
            lng: i18n.language,
        });
        navigate(path);
    };

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
                    key={item.id}
                    title={item.name}
                    icon={item.icon}
                    isActive={searchQuery ? selectedCategoryId === item.id : item.slug === slug}
                    onClick={() => selectCategory({id: item.id, slug: item.slug})}
                />
            ))}
        </Carousel>
    );
};

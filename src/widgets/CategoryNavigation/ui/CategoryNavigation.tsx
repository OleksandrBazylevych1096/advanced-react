import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";
import {CategoryNavigationGoBackItem} from "@/widgets/CategoryNavigation/ui/CategoryNavigationGoBackItem.tsx";

import type {SupportedLngsType} from "@/shared/config";
import {Carousel, CarouselSkeleton} from "@/shared/ui/Carousel";
import {ErrorState} from "@/shared/ui/StateViews";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationItem} from "./CategoryNavigationItem";

export const CategoryNavigation = () => {
    const {t} = useTranslation();
    const {i18n} = useTranslation();
    const {slug, lng} = useParams<{slug: string; lng: SupportedLngsType}>();
    const locale = lng || i18n.language;
    const {data, isLoading, isError, refetch} = useGetCategoryNavigationQuery(
        {
            slug,
            locale,
        },
        {skip: !locale},
    );

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

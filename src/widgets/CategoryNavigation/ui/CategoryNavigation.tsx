import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";
import {CategoryNavigationGoBackItem} from "@/widgets/CategoryNavigation/ui/CategoryNavigationGoBackItem.tsx";

import type {SupportedLngsType} from "@/shared/config";
import {Carousel, CarouselSkeleton, ErrorState} from "@/shared/ui";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationItem} from "./CategoryNavigationItem";


export const CategoryNavigation = () => {
    const {t, i18n} = useTranslation();
    const {slug, lng} = useParams<{ slug: string, lng: SupportedLngsType }>();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCategoryNavigationQuery({
        slug: slug,
        locale: lng || i18n.language
    });


    if (isLoading) {
        return (
            <CarouselSkeleton
                className={styles.categorySkeletonContainer}
                count={15}
                ItemSkeletonComponent={<div className={styles.categorySkeleton}/>}
            />
        );
    }

    if (isError) {
        return (
            <ErrorState
                message={t("products.loadCategoriesError")}
                onRetry={refetch}
            />
        );
    }

    if (!data?.items?.length) {
        return null;
    }

    return (
        <Carousel className={styles.categories}>
            {data.isShowingSubcategories &&
                <CategoryNavigationGoBackItem parentSlug={data?.parentCategory?.slug}/>}
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

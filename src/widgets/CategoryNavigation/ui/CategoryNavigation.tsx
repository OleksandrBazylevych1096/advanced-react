import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";
import {CategoryNavigationGoBackItem} from "@/widgets/CategoryNavigation/ui/CategoryNavigationGoBackItem.tsx";

import {Button, Carousel, CarouselSkeleton} from "@/shared/ui";

import styles from "./CategoryNavigation.module.scss";
import {CategoryNavigationItem} from "./CategoryNavigationItem";


export const CategoryNavigation = () => {
    const {i18n, t} = useTranslation();
    const {slug} = useParams();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetCategoryNavigationQuery({
        slug: slug,
        locale: i18n.language
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
            <div className={styles.errorContainer}>
                <p className={styles.errorText}>{t("products.loadCategoriesError")}</p>
                <Button onClick={refetch}>{t("products.tryAgain")}</Button>
            </div>
        );
    }

    if (!data?.items?.length) {
        return null;
    }

    return (
        <Carousel className={styles.categories}>
            {data.isShowingSubcategories && <CategoryNavigationGoBackItem parentSlug={data?.parentCategory?.slug}/>}
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

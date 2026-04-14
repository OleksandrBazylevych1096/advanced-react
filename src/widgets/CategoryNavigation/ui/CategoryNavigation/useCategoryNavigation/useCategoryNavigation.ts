import {useTranslation} from "react-i18next";
import {generatePath, useNavigate, useParams, useSearchParams} from "react-router";

import {useGetCategoryNavigationQuery} from "@/widgets/CategoryNavigation/api/categoryNavigationApi.ts";

import {AppRoutes, routePaths, type SupportedLngsType} from "@/shared/config";

interface UseCategoryNavigationParams {
    searchQuery?: string;
    slug?: string;
}

interface CategoryOption {
    id: string;
    slug: string;
}

export const useCategoryNavigation = ({searchQuery, slug}: UseCategoryNavigationParams) => {
    const {lng} = useParams<{lng: SupportedLngsType}>();
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategoryId = searchParams.get("categoryId");

    // should use lng from params to avoid double request when user change language, because slug depends on lng param and i18n updates after lng param changes.
    const locale = lng || i18n.language;

    const {data, isLoading, isError, refetch} = useGetCategoryNavigationQuery(
        {
            slug,
            searchQuery,
            locale,
        },
        {skip: !locale},
    );

    const selectCategory = (item: CategoryOption) => {
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

    return {
        data: {
            navigationData: data,
            selectedCategoryId,
            slug,
            isSearchMode: Boolean(searchQuery),
        },
        status: {
            isLoading,
            isError,
        },
        actions: {
            refetch,
            selectCategory,
        },
    };
};

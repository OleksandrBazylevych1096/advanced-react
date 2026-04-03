import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {selectProductSearchShowHistoryDropdown} from "@/features/product-search";

import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {useGetPopularSearchesQuery} from "../../../api/searchHistoryApi.ts";
import {applySearchQuery} from "../../../lib/applySearchQuery/applySearchQuery.ts";

export const useMostPopularSearches = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isHistoryMode = useAppSelector(selectProductSearchShowHistoryDropdown);

    const {data: popularSearches = [], isFetching: isFetchingPopularSearches} =
        useGetPopularSearchesQuery(undefined, {skip: !isHistoryMode});

    const applyPopularSearchQuery = (query: string) => {
        applySearchQuery({
            query,
            dispatch,
            navigate,
            locale: i18n.language,
        });
    };

    return {
        data: {
            popularSearches,
        },
        status: {
            isFetchingPopularSearches,
        },
        actions: {
            applyPopularSearchQuery,
        },
    };
};

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {
    useClearSearchHistoryMutation,
    useDeleteSearchHistoryItemMutation,
    useGetSearchHistoryQuery,
    useSyncSearchHistoryMutation,
} from "@/widgets/SearchPanel/api/searchHistoryApi.ts";
import {
    addLocalSearchQuery,
    clearLocalSearchHistory,
    getLocalSearchHistory,
    removeLocalSearchQuery,
} from "@/widgets/SearchPanel/lib/searchHistoryStorage/searchHistoryStorage.ts";

import {
    selectProductSearchShowHistoryDropdown,
    selectProductSearchSubmittedEvent,
} from "@/features/product-search";

import {selectIsAuthenticated} from "@/entities/user";

import {useToast} from "@/shared/lib/notifications";
import {usePrevious} from "@/shared/lib/react";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {applySearchQuery} from "../../lib/applySearchQuery/applySearchQuery.ts";

interface RecentSearchItem {
    id?: string;
    query: string;
}

export const useSearchHistory = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const {error} = useToast();
    const dispatch = useAppDispatch();

    const isHistoryMode = useAppSelector(selectProductSearchShowHistoryDropdown);
    const submittedSearchEvent = useAppSelector(selectProductSearchSubmittedEvent);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const previousIsAuthenticated = usePrevious(isAuthenticated);

    const [localRecentSearches, setLocalRecentSearches] = useState<string[]>(() =>
        getLocalSearchHistory(),
    );

    const handledSubmittedSearchEventIdRef = useRef<string | number | null>(null);

    const {
        data: serverRecentSearches,
        isFetching: isFetchingRecentSearches,
        refetch: refetchRecentSearches,
    } = useGetSearchHistoryQuery(undefined, {
        skip: !isAuthenticated || !isHistoryMode,
        refetchOnMountOrArgChange: true,
    });

    const [syncSearchHistory] = useSyncSearchHistoryMutation();

    const [deleteSearchHistoryItem, {isLoading: isDeletingRecentItem}] =
        useDeleteSearchHistoryItemMutation();

    const [clearSearchHistory, {isLoading: isClearingRecentSearches}] =
        useClearSearchHistoryMutation();

    useEffect(() => {
        const becameAuthenticated = !previousIsAuthenticated && isAuthenticated;
        if (!becameAuthenticated) return;
        if (!localRecentSearches.length) return;

        syncSearchHistory({queries: localRecentSearches})
            .unwrap()
            .then(() => {
                clearLocalSearchHistory();
                setLocalRecentSearches([]);
                void refetchRecentSearches();
            })
            .catch(() => {
                // silent
            });
    }, [
        isAuthenticated,
        previousIsAuthenticated,
        localRecentSearches,
        syncSearchHistory,
        refetchRecentSearches,
    ]);

    const recentSearches = useMemo<RecentSearchItem[]>(() => {
        if (isAuthenticated) {
            return (serverRecentSearches ?? []).map((item) => ({
                id: item.id,
                query: item.query,
            }));
        }
        return localRecentSearches.map((query) => ({query}));
    }, [isAuthenticated, localRecentSearches, serverRecentSearches]);

    const registerSearchQuery = useCallback(
        (searchQuery: string) => {
            if (isAuthenticated) return;
            setLocalRecentSearches(addLocalSearchQuery(searchQuery));
        },
        [isAuthenticated],
    );

    const removeRecentSearchItem = useCallback(
        async (item: RecentSearchItem) => {
            try {
                if (isAuthenticated && item.id) {
                    await deleteSearchHistoryItem(item.id).unwrap();
                    return;
                }
                setLocalRecentSearches(removeLocalSearchQuery(item.query));
            } catch {
                error("Failed to remove search query.");
            }
        },
        [isAuthenticated, deleteSearchHistoryItem, error],
    );

    const clearRecentSearches = useCallback(async () => {
        try {
            if (isAuthenticated) {
                await clearSearchHistory().unwrap();
                return;
            }
            clearLocalSearchHistory();
            setLocalRecentSearches([]);
        } catch {
            error("Failed to clear search history.");
        }
    }, [isAuthenticated, clearSearchHistory, error]);

    const applyRecentSearchQuery = useCallback(
        (query: string) => {
            applySearchQuery({
                query,
                dispatch,
                navigate,
                locale: i18n.language,
            });
        },
        [dispatch, navigate, i18n.language],
    );

    useEffect(() => {
        if (isAuthenticated && isHistoryMode) {
            void refetchRecentSearches();
        }
    }, [isAuthenticated, isHistoryMode, refetchRecentSearches]);

    useEffect(() => {
        if (!submittedSearchEvent || isAuthenticated) return;
        if (handledSubmittedSearchEventIdRef.current === submittedSearchEvent.id) return;

        handledSubmittedSearchEventIdRef.current = submittedSearchEvent.id;
        registerSearchQuery(submittedSearchEvent.query);
    }, [isAuthenticated, registerSearchQuery, submittedSearchEvent]);

    return {
        data: {
            recentSearches,
        },
        status: {
            isFetchingRecentSearches,
            isDeletingRecentItem,
            isClearingRecentSearches,
        },
        actions: {
            registerSearchQuery,
            removeRecentSearchItem,
            clearRecentSearches,
            applyRecentSearchQuery,
        },
    };
};

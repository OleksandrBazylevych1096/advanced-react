import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {selectProductSearchShowHistoryDropdown} from "@/features/product-search";

import {useAppDispatch, useAppSelector} from "@/shared/lib/state";
import {Button} from "@/shared/ui/Button";
import {Skeleton} from "@/shared/ui/Skeleton";
import {EmptyState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import {useGetPopularSearchesQuery} from "../api/searchHistoryApi";
import {applySearchQuery} from "../lib/applySearchQuery/applySearchQuery";

import styles from "./SearchPanel.module.scss";

const POPULAR_SEARCH_SKELETON_COUNT = 3;

export const MostPopularSearches = () => {
    const {t, i18n} = useTranslation();
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
    return (
        <>
            <Typography as="h6" variant="bodySm" weight="semibold">
                {t("search.history.popular", "Popular Search")}
            </Typography>

            {isFetchingPopularSearches ? (
                <div className={styles.tagsWrap}>
                    {Array.from({length: POPULAR_SEARCH_SKELETON_COUNT}).map((_, index) => (
                        <Skeleton key={index} width={100} height={36} borderRadius={999} />
                    ))}
                </div>
            ) : popularSearches.length > 0 ? (
                <div className={styles.tagsWrap}>
                    {popularSearches.map((item) => (
                        <Button
                            key={item}
                            type="button"
                            theme="ghost"
                            className={styles.tagButton}
                            onClick={() => applyPopularSearchQuery(item)}
                        >
                            <Typography as="span" variant="bodySm" tone="muted">
                                {item}
                            </Typography>
                        </Button>
                    ))}
                </div>
            ) : (
                <EmptyState title={t("search.history.popularEmpty")} />
            )}
        </>
    );
};

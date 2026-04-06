import {useTranslation} from "react-i18next";

import CloseIcon from "@/shared/assets/icons/Close.svg?react";
import DeleteIcon from "@/shared/assets/icons/Delete.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";
import {EmptyState} from "@/shared/ui/StateViews";
import {Typography} from "@/shared/ui/Typography";

import styles from "../SearchPanel/SearchPanel.module.scss";

import {useSearchHistory} from "./useSearchHistory.ts";

const SEARCH_HISTORY_SKELETON_COUNT = 3;

export const SearchHistory = () => {
    const {t} = useTranslation();
    const {
        data: {recentSearches},
        status: {isFetchingRecentSearches, isDeletingRecentItem, isClearingRecentSearches},
        actions: {clearRecentSearches, applyRecentSearchQuery, removeRecentSearchItem},
    } = useSearchHistory();

    return (
        <Stack gap={12}>
            <Stack direction="row" align="center" justify="space-between">
                <Typography as="h6" variant="bodySm" weight="semibold">
                    {t("search.history.recent", "Recent Search")}
                </Typography>
                <Button
                    theme="ghost"
                    form="rounded"
                    className={styles.clearButton}
                    onClick={() => void clearRecentSearches()}
                    disabled={
                        recentSearches.length === 0 ||
                        isDeletingRecentItem ||
                        isClearingRecentSearches
                    }
                    aria-label={t("search.history.clearAll", "Clear all recent searches")}
                >
                    <AppIcon filled Icon={DeleteIcon}/>
                </Button>
            </Stack>

            {isFetchingRecentSearches ? (
                <div className={styles.tagsWrap}>
                    {Array.from({length: SEARCH_HISTORY_SKELETON_COUNT}).map((_, index) => (
                        <Skeleton key={index} width={100} height={36} borderRadius={40}/>
                    ))}
                </div>
            ) : recentSearches.length > 0 ? (
                <div className={styles.tagsWrap}>
                    {recentSearches.map((item) => (
                        <div key={item.id ?? item.query} className={styles.tagRemovable}>
                            <Button
                                type="button"
                                theme="ghost"
                                form="rounded"
                                className={styles.tagButton}
                                onClick={() => applyRecentSearchQuery(item.query)}
                            >
                                <Typography as="span" variant="bodySm" tone="muted">
                                    {item.query}
                                </Typography>
                            </Button>
                            <Button
                                type="button"
                                theme="ghost"
                                form="rounded"
                                className={styles.tagRemoveButton}
                                onClick={() => void removeRecentSearchItem(item)}
                                aria-label={t("search.history.remove", "Remove query")}
                            >
                                <AppIcon Icon={CloseIcon} className={styles.tagRemoveIcon}/>
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState title={t("search.history.empty")}/>
            )}
        </Stack>
    );
};

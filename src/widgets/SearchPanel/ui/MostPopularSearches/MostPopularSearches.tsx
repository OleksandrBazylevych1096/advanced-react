import {useTranslation} from "react-i18next";

import {useMostPopularSearches} from "@/widgets/SearchPanel/ui/MostPopularSearches/useMostPopularSearches/useMostPopularSearches.ts";

import {Button} from "@/shared/ui/Button";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Typography} from "@/shared/ui/Typography";

import styles from "../SearchPanel/SearchPanel.module.scss";

const POPULAR_SEARCH_SKELETON_COUNT = 3;

export const MostPopularSearches = () => {
    const {t} = useTranslation();
    const {
        data: {popularSearches},
        status: {isFetchingPopularSearches},
        actions: {applyPopularSearchQuery},
    } = useMostPopularSearches();

    if (!isFetchingPopularSearches && popularSearches.length === 0) {
        return null;
    }

    return (
        <>
            <Typography as="h6" variant="bodySm" weight="semibold">
                {t("search.history.popular", "Popular Search")}
            </Typography>

            {isFetchingPopularSearches ? (
                <div className={styles.tagsWrap}>
                    {Array.from({length: POPULAR_SEARCH_SKELETON_COUNT}).map((_, index) => (
                        <Skeleton key={index} width={100} height={36} borderRadius={40} />
                    ))}
                </div>
            ) : (
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
            )}
        </>
    );
};

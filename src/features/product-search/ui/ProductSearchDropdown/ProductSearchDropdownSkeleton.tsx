import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import {SEARCH_SUGGESTIONS_LIMIT} from "../../config/constants";

import styles from "./ProductSearchDropdown.module.scss";

export const ProductSearchDropdownSkeleton = () => (
    <Stack gap={6}>
        {Array.from({length: SEARCH_SUGGESTIONS_LIMIT}).map((_, index) => (
            <div key={index} className={styles.skeletonRow}>
                <Skeleton width={44} height={44} borderRadius={10} />
                <Stack gap={6} className={styles.skeletonText}>
                    <Skeleton width="65%" height={14} borderRadius={8} />
                    <Skeleton width="90%" height={12} borderRadius={8} />
                </Stack>
                <Skeleton width={70} height={20} borderRadius={10} />
            </div>
        ))}
    </Stack>
);

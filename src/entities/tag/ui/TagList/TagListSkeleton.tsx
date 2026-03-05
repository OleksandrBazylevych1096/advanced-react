import styles from "@/entities/tag/ui/TagList/TagList.module.scss";

import {Stack} from "@/shared/ui";

interface TagListSkeletonProps {
    count?: number;
}

export const TagListSkeleton = ({count = 6}: TagListSkeletonProps) => {
    return (
        <Stack direction="row" gap={12} align="center" wrap="wrap">
            {Array.from({length: count}).map((_, index) => (
                <div key={`taglist-skeleton-${index}`} className={styles.tagSkeleton} />
            ))}
        </Stack>
    );
};

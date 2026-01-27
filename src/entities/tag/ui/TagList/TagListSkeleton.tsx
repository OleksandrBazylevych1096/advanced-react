import styles from "@/entities/tag/ui/TagList/TagList.module.scss";

interface TagListSkeletonProps {
    count?: number
}

export const TagListSkeleton = ({count = 6}: TagListSkeletonProps) => {

    return <div className={styles.tags}>
        {Array.from({length: count}).map((_, index) => (
            <div key={`taglist-skeleton-${index}`} className={styles.tagSkeleton}/>
        ))}
    </div>
}
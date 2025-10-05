import { Button } from "@/shared/ui";

import type { Tag } from "../../model/types/Tag";

import styles from "./TagList.module.scss";

interface TagListProps {
  tags?: Tag[];
  isLoading: boolean;
  onTagChange?: (tagId: string) => void;
  currentTagId?: string;
}

export const TagList = (props: TagListProps) => {
  const { isLoading, currentTagId, onTagChange, tags } = props;

  const handleTagChange = (tagId: string) => {
    onTagChange?.(tagId);
  };

  if (isLoading) {
    return (
      <div className={styles.tags}>
        <div className={styles.tagSkeleton} />
        <div className={styles.tagSkeleton} />
        <div className={styles.tagSkeleton} />
        <div className={styles.tagSkeleton} />
        <div className={styles.tagSkeleton} />
        <div className={styles.tagSkeleton} />
      </div>
    );
  }

  return (
    <div className={styles.tags}>
      {tags?.map((tag) => {
        const isSelected = tag.id === currentTagId;
        return (
          <Button
            key={tag.id}
            theme={isSelected ? "outline" : "tertiary"}
            className={styles.tag}
            onClick={() => handleTagChange(tag.id)}
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
};

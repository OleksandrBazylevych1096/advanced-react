import type {Tag} from "@/entities/tag";

import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";

import styles from "./TagList.module.scss";
import {TagListSkeleton} from "./TagListSkeleton";

interface TagListProps {
    tags?: Tag[];
    isLoading: boolean;
    onTagChange?: (tagId: string) => void;
    currentTagId?: string;
}

export const TagList = (props: TagListProps) => {
    const {isLoading, currentTagId, onTagChange, tags} = props;

    const changeTag = (tagId: string) => {
        onTagChange?.(tagId);
    };

    if (isLoading) {
        return <TagListSkeleton />;
    }

    return (
        <Stack direction="row" gap={12} align="center" wrap="wrap">
            {tags?.map((tag) => {
                const isSelected = tag.id === currentTagId;
                return (
                    <Button
                        key={tag.id}
                        theme={isSelected ? "outline" : "tertiary"}
                        className={styles.tag}
                        onClick={() => changeTag(tag.id)}
                    >
                        {tag.name}
                    </Button>
                );
            })}
        </Stack>
    );
};

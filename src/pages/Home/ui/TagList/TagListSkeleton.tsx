import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

interface TagListSkeletonProps {
    count?: number;
}

export const TagListSkeleton = ({count = 6}: TagListSkeletonProps) => {
    return (
        <Stack direction="row" gap={12} align="center" wrap="wrap">
            {Array.from({length: count}).map((_, index) => (
                <Skeleton
                    key={`taglist-skeleton-${index}`}
                    width={80}
                    height={40}
                    borderRadius={16}
                />
            ))}
        </Stack>
    );
};

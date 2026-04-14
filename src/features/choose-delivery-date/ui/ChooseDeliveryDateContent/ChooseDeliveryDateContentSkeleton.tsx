import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ChooseDeliveryDateContent.module.scss";

export const ChooseDeliveryDateContentSkeleton = () => {
    return (
        <Stack gap={24} className={styles.content} data-testid="delivery-slots-skeleton">
            <Stack gap={12}>
                <Skeleton width={240} height={20} borderRadius={8} />
                <Stack direction="row" gap={16} className={styles.dateGrid}>
                    {Array.from({length: 7}).map((_, idx) => (
                        <Skeleton
                            key={`day-skeleton-${idx}`}
                            width={84}
                            height={84}
                            borderRadius={16}
                        />
                    ))}
                </Stack>
            </Stack>
            <Stack gap={12}>
                <Skeleton width={240} height={20} borderRadius={8} />
                <Stack direction="row" gap={16} className={styles.timeSlots}>
                    {Array.from({length: 4}).map((_, idx) => (
                        <Skeleton
                            key={`slot-skeleton-${idx}`}
                            width={96}
                            height={40}
                            borderRadius={40}
                        />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    );
};

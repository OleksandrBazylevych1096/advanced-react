import {Grid} from "@/shared/ui/Grid";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ManageSessions.module.scss";

const SKELETON_ITEMS_COUNT = 3;

export const ManageSessionsSkeleton = () => {
    return (
        <Stack gap={12} className={styles.container} data-testid="manage-sessions-skeleton">
            <Skeleton width={220} height={32} borderRadius={8} />
            <Stack className={styles.toolbar} direction="row" gap={8} align="center" wrap="wrap">
                <Skeleton width={148} height={40} borderRadius={40} />
                <Skeleton width={132} height={40} borderRadius={40} />
                <Skeleton width={96} height={20} borderRadius={8} />
            </Stack>

            <Grid as="ul" className={styles.list} gap={12}>
                {Array.from({length: SKELETON_ITEMS_COUNT}, (_, index) => (
                    <Grid as="li" key={`manage-session-skeleton-${index}`} className={styles.item} gap={10}>
                        <Stack
                            className={styles.header}
                            direction="row"
                            justify="space-between"
                            align="center"
                        >
                            <Stack gap={4}>
                                <Skeleton width={128} height={20} borderRadius={8} />
                                <Skeleton width={88} height={16} borderRadius={8} />
                            </Stack>
                            <Skeleton width={84} height={36} borderRadius={40} />
                        </Stack>

                        <Grid className={styles.meta} cols={2} gap={10}>
                            {Array.from({length: 4}, (_, metaIndex) => (
                                <div
                                    key={`manage-session-meta-skeleton-${index}-${metaIndex}`}
                                    className={styles.metaItem}
                                >
                                    <Skeleton width={72} height={14} borderRadius={8} />
                                    <Skeleton width="80%" height={18} borderRadius={8} />
                                </div>
                            ))}
                        </Grid>

                        <div className={styles.lastActivity}>
                            <Skeleton width={104} height={14} borderRadius={8} />
                            <Skeleton width={168} height={18} borderRadius={8} />
                        </div>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};

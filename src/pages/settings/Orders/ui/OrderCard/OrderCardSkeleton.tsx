import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./OrderCard.module.scss";

export const OrderCardSkeleton = () => {
    return (
        <Stack className={styles.orderCard} gap={20}>
            <Stack className={styles.orderCardTop} direction="row" align="center" gap={16}>
                <Stack className={styles.orderSummary} gap={8}>
                    <Skeleton width={180} height={28} borderRadius={8}/>
                    <Skeleton width={200} height={20} borderRadius={8}/>
                </Stack>

                <Stack className={styles.metaItem} direction="row" align="center" gap={10}>
                    <Skeleton width={34} height={34} borderRadius={40}/>
                    <Stack gap={6}>
                        <Skeleton width={90} height={24} borderRadius={8}/>
                        <Skeleton width={120} height={18} borderRadius={8}/>
                    </Stack>
                </Stack>

                <Stack className={styles.metaItem} direction="row" align="center" gap={10}>
                    <Skeleton width={34} height={34} borderRadius={40}/>
                    <Stack gap={6}>
                        <Skeleton width={60} height={24} borderRadius={8}/>
                        <Skeleton width={50} height={18} borderRadius={8}/>
                    </Stack>
                </Stack>

                <Skeleton width={110} height={38} borderRadius={40}/>
                <Skeleton width={160} height={24} borderRadius={8}/>
            </Stack>
        </Stack>
    );
};


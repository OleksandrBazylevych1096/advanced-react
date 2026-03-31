import {Stack} from "@/shared/ui/Stack";

import styles from "../OrderPage.module.scss";

export const OrderDeliveryAddressCardSkeleton = () => {
    return (
        <Stack className={styles.cardSurface} gap={8}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonBodyLine} />
            <div className={styles.skeletonBodyLine} />
        </Stack>
    );
};

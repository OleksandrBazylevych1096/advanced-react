import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "../OrderPage.module.scss";

export const OrderDeliveryAddressCardSkeleton = () => {
    return (
        <Stack className={styles.cardSurface} gap={8}>
            <Skeleton width="90%" height={24} borderRadius={8} />
            <Skeleton width="90%" height={20} borderRadius={8} />
            <Skeleton width="90%" height={20} borderRadius={8} />
        </Stack>
    );
};

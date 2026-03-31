import {ReviewOrderItemsSkeleton} from "@/widgets/ReviewOrderItems";

import {OrderSummaryCardSkeleton} from "@/entities/order";

import {Stack} from "@/shared/ui/Stack";

import styles from "./CheckoutPage.module.scss";

export const CheckoutPageSkeleton = () => {
    return (
        <Stack as="section" className={styles.layout} gap={24}>
            <Stack className={styles.mainColumn} gap={24}>
                <Stack direction="row" align="center" gap={12}>
                    <div className={styles.skeletonBackButton} />
                    <div className={styles.skeletonPageTitle} />
                </Stack>

                <Stack className={styles.cardSurface} gap={16}>
                    <div className={styles.skeletonSectionTitle} />
                    <Stack direction="row" align="center" gap={12}>
                        <div className={styles.skeletonMetaLabel} />
                        <div className={styles.skeletonAddress} />
                    </Stack>
                    <Stack direction="row" align="center" gap={12}>
                        <div className={styles.skeletonMetaLabel} />
                        <div className={styles.skeletonDate} />
                    </Stack>
                </Stack>

                <Stack className={styles.cardSurface}>
                    <ReviewOrderItemsSkeleton />
                </Stack>
            </Stack>

            <Stack gap={16} className={styles.sidebarColumn}>
                <Stack className={styles.cardSurface}>
                    <OrderSummaryCardSkeleton />
                </Stack>

                <Stack gap={12} className={styles.cardSurface}>
                    <div className={styles.skeletonBlockTitle} />
                    <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                        <div className={styles.skeletonChip} />
                        <div className={styles.skeletonChip} />
                        <div className={styles.skeletonChip} />
                        <div className={styles.skeletonChip} />
                    </Stack>
                    <Stack direction="row" gap={6} className={styles.skeletonChipRow}>
                        <div className={styles.skeletonChip} />
                    </Stack>
                </Stack>

                <Stack gap={12} className={styles.cardSurface}>
                    <div className={styles.skeletonBlockTitle} />
                    <div className={styles.skeletonCouponButton} />
                </Stack>

                <Stack className={styles.cardSurface}>
                    <div className={styles.skeletonButton} />
                </Stack>
            </Stack>
        </Stack>
    );
};

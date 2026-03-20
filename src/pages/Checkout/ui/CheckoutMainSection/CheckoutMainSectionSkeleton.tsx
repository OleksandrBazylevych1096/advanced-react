import {Stack} from "@/shared/ui";

import styles from "./CheckoutMainSection.module.scss";

export const CheckoutMainSectionSkeleton = () => {
    return (
        <Stack className={styles.column} gap={32}>
            <Stack direction="row" align="center" gap={12}>
                <div className={styles.skeletonBackButton} />
                <div className={styles.skeletonPageTitle} />
            </Stack>

            <Stack className={styles.card} gap={16}>
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

            <Stack className={styles.reviewSection} gap={20}>
                <div className={styles.skeletonReviewTitle} />

                <Stack direction="row" justify="space-between" align="center">
                    <div className={styles.skeletonItemsNameLabel} />
                    <Stack direction="row" align="center" gap={10}>
                        <div className={styles.skeletonItemsCount} />
                        <div className={styles.skeletonArrow} />
                    </Stack>
                </Stack>

                <div className={styles.divider} />

                <Stack direction="row" align="center" className={styles.skeletonItemRow}>
                    <div className={styles.skeletonItemImage} />
                    <Stack gap={8} className={styles.skeletonItemInfo}>
                        <div className={styles.skeletonItemName} />
                        <div className={styles.skeletonItemPrice} />
                    </Stack>
                    <div className={styles.skeletonItemQty} />
                </Stack>

                <div className={styles.divider} />
            </Stack>
        </Stack>
    );
};

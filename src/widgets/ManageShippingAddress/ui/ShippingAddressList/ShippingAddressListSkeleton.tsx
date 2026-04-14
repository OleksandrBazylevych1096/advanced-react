import {Box} from "@/shared/ui/Box";
import {Button} from "@/shared/ui/Button";
import {Skeleton} from "@/shared/ui/Skeleton";
import {Stack} from "@/shared/ui/Stack";

import styles from "./ShippingAddressList.module.scss";

const SKELETON_ITEMS_COUNT = 3;

export const ShippingAddressListSkeleton = () => {
    return (
        <Box data-testid="address-list-skeleton">
            <Stack gap={16}>
                <Box className={styles.body}>
                    <div className={styles.addressList}>
                        {Array.from({length: SKELETON_ITEMS_COUNT}, (_, index) => (
                            <div
                                key={`shipping-address-skeleton-${index}`}
                                className={styles.addressSkeletonItem}
                            >
                                <div className={styles.addressSkeletonInfo}>
                                    <Skeleton width={18} height={18} shape="circle" />
                                    <div className={styles.addressSkeletonDetails}>
                                        <Skeleton width={200} height={18} borderRadius={8} />
                                        <Skeleton width={160} height={16} borderRadius={8} />
                                    </div>
                                </div>
                                <div className={styles.addressSkeletonActions}>
                                    <Skeleton width={32} height={32} borderRadius={10} />
                                    <Skeleton width={32} height={32} borderRadius={10} />
                                </div>
                            </div>
                        ))}
                    </div>
                </Box>
                <Button
                    theme="ghost"
                    fullWidth
                    className={styles.addAddressButton}
                    disabled
                    data-testid="address-list-add-btn-skeleton"
                >
                    <Skeleton width={180} height={20} borderRadius={8} />
                </Button>
            </Stack>
        </Box>
    );
};

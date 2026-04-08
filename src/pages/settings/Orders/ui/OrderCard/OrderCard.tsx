import {useTranslation} from "react-i18next";
import {Link} from "react-router";

import {getSettingsOrderDateLabel} from "@/pages/settings/Orders/lib/getSettingsOrderDateLabel.ts";

import {type OrderDetails, OrderStatusBadge} from "@/entities/order";

import ArrowRight from "@/shared/assets/icons/ArrowRight.svg?react";
import {AppRoutes, routePaths} from "@/shared/config";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Price} from "@/shared/ui/Price";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./OrderCard.module.scss";

interface OrderCardProps {
    order: OrderDetails;
}

export const OrderCard = ({order}: OrderCardProps) => {
    const {i18n, t} = useTranslation();
    const getLocalizedPath = useLocalizedRoutePath();
    const itemsCount = order.orderItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Stack className={styles.orderCard} gap={20}>
            <div className={styles.orderCardTop}>
                <Stack className={styles.orderSummary} gap={8}>
                    <Stack direction="row" align="center" gap={6} className={styles.orderNumberRow}>
                        <Typography as="h3" variant="heading" weight="semibold">
                            {t("settings.pages.orders.orderLabel")}
                        </Typography>
                        <Typography
                            variant="heading"
                            copyable
                            copiableTextClassName={styles.orderNumberText}
                        >
                            {order.orderNumber}
                        </Typography>
                    </Stack>

                    <Typography variant="body" tone="muted">
                        {getSettingsOrderDateLabel(i18n.language, order)}
                    </Typography>
                </Stack>

                <Stack className={styles.metaItem} gap={6}>
                    <Stack gap={6}>
                        <Typography variant="heading" weight="semibold">
                            <Price
                                price={order.totalAmount}
                                currency={order.currency}
                                language={i18n.language}
                            />
                        </Typography>
                        <Typography variant="body" tone="muted">
                            Paid with {order.paymentCardBrand?.toUpperCase()} ****
                            {order.paymentCardLast4}
                        </Typography>
                    </Stack>
                </Stack>

                <Stack className={styles.metaItem} gap={6}>
                    <Stack gap={6}>
                        <Typography variant="heading" weight="semibold">
                            {t("settings.pages.orders.itemsCount", {count: itemsCount})}
                        </Typography>
                        <Typography variant="body" tone="muted">
                            {t("settings.pages.orders.itemsLabel")}
                        </Typography>
                    </Stack>
                </Stack>

                <div className={styles.statusColumn}>
                    <OrderStatusBadge status={order.status} />
                </div>

                <div className={styles.actionColumn}>
                    <Link
                        className={styles.detailsLink}
                        to={getLocalizedPath(routePaths[AppRoutes.ORDER], {
                            id: order.id,
                        })}
                    >
                        <Typography as="span" weight="semibold">
                            {t("settings.pages.orders.viewOrderDetails")}
                        </Typography>
                        <AppIcon Icon={ArrowRight} size={16} />
                    </Link>
                </div>
            </div>
        </Stack>
    );
};

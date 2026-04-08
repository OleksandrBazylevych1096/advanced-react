import {useTranslation} from "react-i18next";

import {
    resolveOrderStatusIcon,
    resolveOrderStatusTone,
} from "@/pages/Order/lib/resolveOrderStatus/resolveOrderStatus.ts";

import {getDeliveryLabel} from "@/features/choose-delivery-date";

import {OrderStatusBadge, type OrderDetails} from "@/entities/order";

import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Stack} from "@/shared/ui/Stack";
import {Timeline} from "@/shared/ui/Timeline";
import {Typography} from "@/shared/ui/Typography";

import {mapOrderTimelineToTimelineEvents} from "../../lib/mapOrderTimelineToTimeEvents/mapOrderTimelineToTimelineEvents";
import pageStyles from "../OrderPage/OrderPage.module.scss";

import styles from "./OrderTrackingSection.module.scss";

interface OrderTrackingSectionProps {
    order: OrderDetails;
}

export const OrderTrackingSection = ({order}: OrderTrackingSectionProps) => {
    const {i18n, t} = useTranslation("checkout");
    const mappedTimeline = mapOrderTimelineToTimelineEvents(order.status, order.timeline);
    const timelineEvents = mappedTimeline.events;
    const deliveryLabel = getDeliveryLabel(
        i18n.language,
        {
            date: order.deliveryDate,
            time: order.deliveryTime,
        },
        t("order.notAvailable"),
    );

    const currentStatus = mappedTimeline.currentStatus;
    const CurrentStatusIcon = resolveOrderStatusIcon(currentStatus);
    const currentStatusTone = resolveOrderStatusTone(currentStatus, order.status);

    return (
        <Stack className={cn(pageStyles.cardSurface)} gap={16}>
            <Stack direction="row" justify="space-between" align="flex-start" gap={12}>
                <Stack gap={8}>
                    <Stack direction="row" align="center" gap={8}>
                        <Typography variant="body" weight="medium">
                            {t("order.pageOrderNumber")}
                        </Typography>
                        <Typography copyable>{order.orderNumber}</Typography>
                    </Stack>
                    <Typography variant="body" tone="muted">
                        {`${t("order.promisedDelivery")}: ${deliveryLabel}`}
                    </Typography>
                </Stack>
                <OrderStatusBadge status={order.status} />
            </Stack>
            <Stack className={styles.currentStatus} gap={12} align="center">
                <Box
                    className={cn(styles.statusAura, {
                        [styles.statusAuraPrimary]: currentStatusTone === "primary",
                        [styles.statusAuraSuccess]: currentStatusTone === "success",
                        [styles.statusAuraDanger]: currentStatusTone === "danger",
                    })}
                >
                    <Box
                        className={cn(styles.statusIconCircle, {
                            [styles.statusIconCirclePrimary]: currentStatusTone === "primary",
                            [styles.statusIconCircleSuccess]: currentStatusTone === "success",
                            [styles.statusIconCircleDanger]: currentStatusTone === "danger",
                        })}
                    >
                        <AppIcon Icon={CurrentStatusIcon} size={48} className={styles.statusIcon} />
                    </Box>
                </Box>
                <Typography as="h2" variant="heading" weight="bold">
                    {mappedTimeline.currentLabel}
                </Typography>
                {mappedTimeline.currentNote && (
                    <Typography variant="body" tone="muted">
                        {mappedTimeline.currentNote}
                    </Typography>
                )}
            </Stack>
            <Timeline events={timelineEvents} />
        </Stack>
    );
};

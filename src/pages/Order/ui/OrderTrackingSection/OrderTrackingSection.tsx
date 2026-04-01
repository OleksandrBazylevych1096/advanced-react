import {useTranslation} from "react-i18next";

import {
    resolveOrderStatusIcon,
    resolveOrderStatusTone,
} from "@/pages/Order/lib/resolveOrderStatus/resolveOrderStatus.ts";
import {StatusBadge} from "@/pages/Order/ui/OrderTrackingSection/StatusBadge.tsx";

import {getDeliveryLabel} from "@/features/checkout/choose-delivery-date";

import type {OrderDetails} from "@/entities/order";

import CopyIcon from "@/shared/assets/icons/Copy.svg?react";
import {useToast} from "@/shared/lib/notifications";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Timeline} from "@/shared/ui/Timeline";
import {Typography} from "@/shared/ui/Typography";

import {mapOrderTimelineToTimelineEvents} from "../../lib/mapOrderTimelineToTimeEvents/mapOrderTimelineToTimelineEvents";
import pageStyles from "../OrderPage.module.scss";

import styles from "./OrderTrackingSection.module.scss";

interface OrderTrackingSectionProps {
    order: OrderDetails;
}

export const OrderTrackingSection = ({order}: OrderTrackingSectionProps) => {
    const {i18n, t} = useTranslation("checkout");
    const {success} = useToast();
    const timelineEvents = mapOrderTimelineToTimelineEvents(order.timeline.events);
    const deliveryLabel = getDeliveryLabel(
        i18n.language,
        {
            date: order.deliveryDate,
            time: order.deliveryTime,
        },
        t("order.notAvailable"),
    );

    const latestDoneEvent = timelineEvents.findLast((event) => event.state === "done");
    const activeRawTimelineEvent = order.timeline.events.find((event) => event.state === "active");
    const latestDoneRawTimelineEvent = order.timeline.events.findLast(
        (event) => event.state === "done",
    );
    const currentRawTimelineEvent = activeRawTimelineEvent ?? latestDoneRawTimelineEvent;
    const currentStatus = currentRawTimelineEvent?.status ?? order.status;
    const CurrentStatusIcon = resolveOrderStatusIcon(currentStatus);
    const currentStatusTone = resolveOrderStatusTone(currentRawTimelineEvent, order.status);

    const currentTimelineLabel =
        timelineEvents.find((event) => event.state === "active")?.label ??
        latestDoneEvent?.label ??
        t(`order.status.${order.status.toLowerCase()}`, {
            defaultValue: order.status,
        });

    const handleCopyOrderNumber = async () => {
        await navigator.clipboard.writeText(order.orderNumber);
        success(t("order.copied"));
    };

    return (
        <Stack className={cn(pageStyles.cardSurface)} gap={16}>
            <Stack direction="row" justify="space-between" align="flex-start" gap={12}>
                <Stack gap={8}>
                    <Stack direction="row" align="center" gap={8}>
                        <Typography variant="body" weight="medium">
                            {t("order.pageOrderNumber")}
                        </Typography>
                        <Button
                            type="button"
                            theme="ghost"
                            className={styles.orderNumberButton}
                            onClick={() => void handleCopyOrderNumber()}
                            aria-label={`${t("order.pageOrderNumber")}: ${order.orderNumber}`}
                        >
                            <Stack direction="row" align="center" gap={8}>
                                <AppIcon Icon={CopyIcon} size={16} className={styles.copyIcon} />
                                <Typography
                                    variant="body"
                                    weight="medium"
                                    className={styles.orderNumberText}
                                >
                                    {order.orderNumber}
                                </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                    <Typography variant="body" tone="muted">
                        {`${t("order.promisedDelivery")}: ${deliveryLabel}`}
                    </Typography>
                </Stack>
                <StatusBadge status={order.status} />
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
                    {currentTimelineLabel}
                </Typography>
            </Stack>
            <Timeline events={timelineEvents} />
        </Stack>
    );
};

import {useTranslation} from "react-i18next";

import type {OrderStatusType} from "@/entities/order";

import {cn} from "@/shared/lib/styling";
import {Box} from "@/shared/ui/Box";
import {Typography} from "@/shared/ui/Typography";

import {getBadgeView} from "../../lib/getBadgeView/getBadgeView";

import styles from "./OrderTrackingSection.module.scss";

interface StatusBadgeProps {
    status: OrderStatusType;
}

export const StatusBadge = ({status}: StatusBadgeProps) => {
    const {t} = useTranslation("checkout");
    const badgeView = getBadgeView(status);

    return (
        <Box as="span" className={cn(styles.statusPill, styles[badgeView.className])}>
            <Typography as="span" variant="bodySm" weight="medium" tone={badgeView.tone}>
                {t(badgeView.label)}
            </Typography>
        </Box>
    );
};

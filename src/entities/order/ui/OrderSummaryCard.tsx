import {useTranslation} from "react-i18next";

import {SummaryRow} from "@/entities/order/ui/SummaryRow.tsx";
import {selectUserCurrency} from "@/entities/user/@x/order";

import {formatCurrency} from "@/shared/lib/formatting";
import {useAppSelector} from "@/shared/lib/state";
import {cn} from "@/shared/lib/styling";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import styles from "./OrderSummaryCard.module.scss";

export interface OrderSummaryRow {
    label: string;
    amount: number;
}

interface OrderSummaryCardProps {
    rows: OrderSummaryRow[];
    totalAmount: number;
    className?: string;
}

export const OrderSummaryCard = ({rows, totalAmount, className}: OrderSummaryCardProps) => {
    const {i18n, t} = useTranslation("checkout");
    const currency = useAppSelector(selectUserCurrency);

    return (
        <Stack className={cn(styles.card, className)} gap={16}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("summary.title")}
            </Typography>

            <Stack gap={12}>
                {rows.map((row) => (
                    <SummaryRow
                        key={row.label}
                        label={row.label}
                        value={formatCurrency(currency, i18n.language, row.amount)}
                    />
                ))}
            </Stack>

            <SummaryRow
                label={t("summary.total")}
                value={formatCurrency(currency, i18n.language, totalAmount)}
                emphasized
            />
        </Stack>
    );
};

import {useTranslation} from "react-i18next";

import type {CartItem} from "@/entities/cart";
import {CartItemRow} from "@/entities/cart";

import type {CurrencyType} from "@/shared/config";
import {Stack, Typography} from "@/shared/ui";
import {Accordion} from "@/shared/ui/Accordion/Accordion.tsx";

import styles from "./ReviewOrderItems.module.scss";

interface ReviewOrderItemsProps {
    items: CartItem[];
    currency: CurrencyType;
}

export const ReviewOrderItems = ({items, currency}: ReviewOrderItemsProps) => {
    const {t} = useTranslation("checkout");
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Stack gap={12} className={styles.card}>
            <Typography as="h3" variant="heading" weight="bold">
                {t("reviewOrderTitle")}
            </Typography>

            <Accordion defaultValue={["items"]}>
                <Accordion.Item value="items">
                    <Accordion.Header className={styles.header}>
                        <Stack
                            direction="row"
                            justify="space-between"
                            align="center"
                            className={styles.headerInner}
                        >
                            <Typography as="span" variant={"body"} weight="medium">
                                {t("itemsName")}
                            </Typography>
                            <Typography as="span" variant={"body"} tone="muted">
                                {t("itemsCount", {count: totalItems})}
                            </Typography>
                        </Stack>
                    </Accordion.Header>
                    <Accordion.Content className={styles.content}>
                        <Stack gap={12}>
                            {items.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    compact
                                    currency={currency}
                                />
                            ))}
                        </Stack>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
        </Stack>
    );
};

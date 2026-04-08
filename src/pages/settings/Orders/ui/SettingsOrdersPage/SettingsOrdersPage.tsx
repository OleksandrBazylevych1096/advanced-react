import {useState} from "react";
import {useTranslation} from "react-i18next";

import {orderFilterTabs} from "@/pages/settings/Orders/config/orderFilterTabs";
import {
    SettingsOrdersStatusFilter,
    type SettingsOrderStatusFilterType,
} from "@/pages/settings/Orders/model/types/settingsOrders.ts";
import {OrderList} from "@/pages/settings/Orders/ui/OrderList/OrderList.tsx";

import {Stack} from "@/shared/ui/Stack";
import {Tabs} from "@/shared/ui/Tabs";
import {Typography} from "@/shared/ui/Typography";

import styles from "./SettingsOrdersPage.module.scss";

const SettingsOrdersPage = () => {
    const {t} = useTranslation();
    const [activeFilter, setActiveFilter] = useState<SettingsOrderStatusFilterType>(
        SettingsOrdersStatusFilter.ALL,
    );

    const handleFilterChange = (value: string) => {
        setActiveFilter(value);
        window.scrollTo({top: 0, behavior: "auto"});
    };

    return (
        <Stack className={styles.page} gap={20}>
            <Typography as="h2" variant="heading" weight="semibold">
                {t("settings.pages.orders.title")}
            </Typography>

            <Tabs defaultValue={SettingsOrdersStatusFilter.ALL} onChange={handleFilterChange}>
                <Tabs.List className={styles.filters}>
                    {orderFilterTabs.map((tab) => (
                        <Tabs.Trigger key={tab.value} value={tab.value}>
                            {t(tab.labelKey)}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </Tabs>

            <OrderList activeFilter={activeFilter} />
        </Stack>
    );
};

export default SettingsOrdersPage;

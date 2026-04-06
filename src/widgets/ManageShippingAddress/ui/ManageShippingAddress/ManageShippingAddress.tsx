import {Suspense} from "react";
import {useTranslation} from "react-i18next";

import {Loader} from "@/widgets/ManageShippingAddress/ui/Loader/Loader.tsx";

import {EditAddressAsync} from "@/features/save-shipping-address";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Box} from "@/shared/ui/Box";
import {Button} from "@/shared/ui/Button";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {ShippingAddressList} from "../ShippingAddressList/ShippingAddressList";

import styles from "./ManageShippingAddress.module.scss";
import {useManageShippingAddress} from "./useManageShippingAddress/useManageShippingAddress.ts";

export const ManageShippingAddress = () => {
    const {t} = useTranslation();

    const {
        data: {modalTitle, mode, isAuthenticated, shouldShowEditForm},
        actions: {goBack, openSignIn},
    } = useManageShippingAddress();

    return (
        <Stack className={styles.contentRoot} gap={16} data-testid="manage-address-content">
            <Box className={styles.header} data-testid="manage-address-header">
                {mode !== "choose" && (
                    <Button
                        theme="ghost"
                        size="sm"
                        onClick={goBack}
                        data-testid="manage-address-back-btn"
                    >
                        <AppIcon Icon={ArrowLeft}/>
                    </Button>
                )}
                <Typography as="h2" variant="heading" weight="semibold">
                    {modalTitle}
                </Typography>
            </Box>

            {!isAuthenticated ? (
                <Box className={styles.signInPrompt} data-testid="manage-address-signin-prompt">
                    <p>{t("manageAddress.signInPrompt")}</p>
                    <Button onClick={openSignIn} data-testid="manage-address-signin-btn">
                        {t("manageAddress.signIn")}
                    </Button>
                </Box>
            ) : shouldShowEditForm ? (
                <Suspense fallback={<Loader/>}>
                    <EditAddressAsync/>
                </Suspense>
            ) : (
                <ShippingAddressList/>
            )}
        </Stack>
    );
};

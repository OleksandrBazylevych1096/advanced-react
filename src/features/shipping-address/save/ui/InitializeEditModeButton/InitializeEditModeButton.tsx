import {useTranslation} from "react-i18next";

import type {ShippingAddress} from "@/entities/shipping-address";

import EditIcon from "@/shared/assets/icons/Edit.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";

import {useInitializeEditModeButtonController} from "../../state/controllers/useInitializeEditModeButtonController/useInitializeEditModeButtonController";

import styles from "./InitializeEditModeButton.module.scss";

interface InitializeEditModeButtonProps {
    address: ShippingAddress;
}

export const InitializeEditModeButton = (props: InitializeEditModeButtonProps) => {
    const {address} = props;
    const {t} = useTranslation();
    const {
        actions: {startEdit},
    } = useInitializeEditModeButtonController(address);

    return (
        <Button
            onClick={startEdit}
            theme="ghost"
            size="sm"
            className={styles.action}
            data-testid={`address-item-${address.id}-edit-btn`}
        >
            <AppIcon Icon={EditIcon} />
            {t("manageAddress.edit")}
        </Button>
    );
};


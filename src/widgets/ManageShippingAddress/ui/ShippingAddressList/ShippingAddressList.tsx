import {useTranslation} from "react-i18next";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?react";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";
import {EmptyState, ErrorState} from "@/shared/ui/StateViews";

import {useShippingAddressListController} from "../../state/controllers/useShippingAddressListController/useShippingAddressListController";
import {Loader} from "../Loader/Loader";

import styles from "./ShippingAddressList.module.scss";
import {ShippingAddressListItem} from "./ShippingAddressListItem";

export const ShippingAddressList = () => {
    const {t} = useTranslation();
    const {
        data: {addresses},
        status: {isLoading, isError},
        actions: {refetch, openAddAddress},
    } = useShippingAddressListController();

    if (isLoading) return <Loader />;

    if (isError) {
        return (
            <Modal.Body>
                <ErrorState message={t("manageAddress.error.title")} onRetry={refetch} />
            </Modal.Body>
        );
    }

    if (!addresses || addresses.length === 0) {
        return (
            <Modal.Body>
                <EmptyState
                    title={t("manageAddress.empty.title")}
                    description={t("manageAddress.empty.description")}
                    icon={MapPinIcon}
                />
                <Modal.Footer>
                    <Button onClick={openAddAddress} fullWidth data-testid="add-first-address-btn">
                        {t("manageAddress.addFirst")}
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        );
    }

    return (
        <>
            <Modal.Body className={styles.body} data-testid="address-list">
                <div className={styles.addressList}>
                    {addresses.map((address) => (
                        <ShippingAddressListItem key={address.id} address={address} />
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={openAddAddress}
                    theme="ghost"
                    fullWidth
                    className={styles.addAddressButton}
                    data-testid="address-list-add-btn"
                >
                    <AppIcon Icon={AddIcon} filled />
                    {t("manageAddress.addNew")}
                </Button>
            </Modal.Footer>
        </>
    );
};


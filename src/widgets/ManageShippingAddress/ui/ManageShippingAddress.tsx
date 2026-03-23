import {Suspense} from "react";
import {useTranslation} from "react-i18next";

import {Loader} from "@/widgets/ManageShippingAddress/ui/Loader/Loader.tsx";

import {EditAddressAsync, saveShippingAddressReducer} from "@/features/shipping-address/save";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import {DynamicModuleLoader} from "@/shared/lib/state";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";

import {useManageShippingAddressController} from "../model/controllers/useManageShippingAddressController/useManageShippingAddressController";

import {DisplayShippingAddress} from "./DisplayShippingAddress";
import styles from "./ManageShippingAddress.module.scss";
import {ShippingAddressList} from "./ShippingAddressList/ShippingAddressList";

const reducers = {
    saveShippingAddress: saveShippingAddressReducer,
};

export const ManageShippingAddress = () => {
    const {t} = useTranslation();

    const {
        data: {modalTitle, mode, isAuthenticated, defaultAddress, shouldShowEditForm, isModalOpen},
        status: {isLoading, isError},
        actions: {closeModal, goBack, openSignIn, openModal},
    } = useManageShippingAddressController();

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <Modal.Trigger asChild>
                    <Button
                        theme="ghost"
                        size="sm"
                        className={styles.addressButton}
                        onClick={openModal}
                        data-testid="manage-address-trigger"
                    >
                        <DisplayShippingAddress
                            isLoading={isLoading}
                            streetAddress={defaultAddress?.streetAddress}
                            isError={isError}
                        />
                    </Button>
                </Modal.Trigger>

                <Modal.Content className={styles.content} data-testid="manage-address-modal">
                    <Modal.Header data-testid="manage-address-header">
                        <div className={styles.header}>
                            {mode !== "choose" && (
                                <Button
                                    theme="ghost"
                                    size="sm"
                                    onClick={goBack}
                                    data-testid="manage-address-back-btn"
                                >
                                    <AppIcon Icon={ArrowLeft} />
                                </Button>
                            )}
                            {modalTitle}
                        </div>
                    </Modal.Header>
                    {!isAuthenticated ? (
                        <Modal.Body>
                            <div
                                className={styles.signInPrompt}
                                data-testid="manage-address-signin-prompt"
                            >
                                <p>{t("manageAddress.signInPrompt")}</p>
                                <Button
                                    onClick={openSignIn}
                                    data-testid="manage-address-signin-btn"
                                >
                                    {t("manageAddress.signIn")}
                                </Button>
                            </div>
                        </Modal.Body>
                    ) : shouldShowEditForm ? (
                        <Suspense fallback={<Loader />}>
                            <EditAddressAsync />
                        </Suspense>
                    ) : (
                        <ShippingAddressList />
                    )}
                </Modal.Content>
            </Modal>
        </DynamicModuleLoader>
    );
};

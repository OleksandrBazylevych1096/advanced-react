import {Suspense} from "react";
import {useTranslation} from "react-i18next";

import {useManageAddress} from "@/features/manageAddress/model/services/useManageAddress.ts";
import {DisplayManageAddress} from "@/features/manageAddress/ui/DisplayManageAddress.tsx";

import ArrowLeft from "@/shared/assets/icons/ArrowLeft.svg?react";
import MapPinIcon from "@/shared/assets/icons/MapPin.svg?react";
import {DynamicModuleLoader,} from "@/shared/lib";
import {AppIcon, Button, Modal, Spinner} from "@/shared/ui";

import {manageAddressReducer,} from "../model/slice/addressSlice";

import {AddressList} from "./AddressList/AddressList";
import {EditAddressAsync} from "./EditAddress/EditAddress.async";
import {Loader} from "./Loader/Loader";
import styles from "./ManageAddress.module.scss";

export const ManageAddress = () => {

    const {t} = useTranslation()

    const {
        defaultAddress,
        isError,
        handleClose,
        handleClickSignIn,
        handleGoBackClick,
        mode,
        shouldShowEditForm,
        isLoading,
        modalTitle,
        userData
    } = useManageAddress()


    return (
        <Modal onClose={handleClose}>
            <Modal.Trigger asChild>
                <Button className={styles.addressButton} theme="ghost">
                    {isLoading ? <Spinner size="sm"/> : <AppIcon Icon={MapPinIcon}/>}
                    <DisplayManageAddress isLoading={isLoading} isError={isError}
                                          streetAddress={defaultAddress?.streetAddress}/>
                </Button>
            </Modal.Trigger>

            <Modal.Content className={styles.content}>
                <Modal.Header childContainerClassName={styles.header}>
                    {mode !== "choose" && (
                        <Button onClick={handleGoBackClick} theme="tertiary" form="circle">
                            <AppIcon Icon={ArrowLeft}/>
                        </Button>
                    )}
                    {modalTitle}
                </Modal.Header>
                {userData ? (
                    <DynamicModuleLoader
                        reducers={{manageAddress: manageAddressReducer}}
                    >
                        {mode === "choose" && <AddressList/>}
                        {shouldShowEditForm && (
                            <Suspense fallback={<Loader/>}>
                                <EditAddressAsync/>
                            </Suspense>
                        )}
                    </DynamicModuleLoader>
                ) : (
                    <Modal.Body>
                        <div className={styles.signInPrompt}>
                            <p>{t("manageAddress.signInPrompt")}</p>
                            <Button size="md" onClick={handleClickSignIn}>
                                {t("manageAddress.signIn")}
                            </Button>
                        </div>
                    </Modal.Body>
                )}
            </Modal.Content>
        </Modal>
    );
};

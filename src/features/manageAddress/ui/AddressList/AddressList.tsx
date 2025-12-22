import { type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?react";
import { useAppDispatch } from "@/shared/lib";
import { Button, AppIcon, Modal } from "@/shared/ui";

import { useGetShippingAddressesQuery } from "../../api/manageAddressApi";
import { manageAddressActions } from "../../model/slice/addressSlice";
import { Loader } from "../Loader/Loader";

import styles from "./AddressList.module.scss";
import { AddressListItem } from "./AddressListItem";

export const AddressList = () => {
  const dispatch = useAppDispatch();

  const {
    data: addresses,
    isLoading: addressesIsLoading,
    isError,
    refetch,
  } = useGetShippingAddressesQuery(undefined);

  const handleRetry = () => {
    refetch();
  };

  const { t } = useTranslation();

  const handleClickAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(manageAddressActions.initializeAddMode({}));
  };

  if (addressesIsLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{t("manageAddress.failedToLoad")}</p>
        <Button onClick={handleRetry} theme="outline" size="sm">
          {t("manageAddress.tryAgain")}
        </Button>
      </div>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <AppIcon Icon={MapPinIcon} size={40} theme="background" />
        <h4 className={styles.emptyTitle}>
          {t("manageAddress.noAddressesTitle")}
        </h4>
        <p className={styles.emptyDescription}>
          {t("manageAddress.noAddressesDescription")}
        </p>
        <Button onClick={handleClickAdd}>
          <AppIcon filled Icon={AddIcon} />
          {t("manageAddress.addNewAddress")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <Modal.Body className={styles.body}>
        <div className={styles.addressList} role="radiogroup">
          {addresses.map((address) => (
            <AddressListItem key={address.id} address={address} />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          theme="ghost"
          className={styles.addAddressButton}
          onClick={handleClickAdd}
        >
          <AppIcon filled Icon={AddIcon} />
          {t("manageAddress.addAddress")}
        </Button>
      </Modal.Footer>
    </>
  );
};

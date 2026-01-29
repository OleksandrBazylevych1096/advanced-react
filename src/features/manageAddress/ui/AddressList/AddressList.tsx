import { type MouseEvent } from "react";
import { useTranslation } from "react-i18next";

import AddIcon from "@/shared/assets/icons/Add.svg?react";
import MapPinIcon from "@/shared/assets/icons/MapPinFilled.svg?react";
import { useAppDispatch } from "@/shared/lib";
import { Button, AppIcon, Modal, EmptyState, ErrorState } from "@/shared/ui";

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
      <ErrorState
        message={t("manageAddress.failedToLoad")}
        onRetry={handleRetry}
      />
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPinIcon}
        title={t("manageAddress.noAddressesTitle")}
        description={t("manageAddress.noAddressesDescription")}
        action={
          <Button onClick={handleClickAdd}>
            <AppIcon filled Icon={AddIcon} />
            {t("manageAddress.addNewAddress")}
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Modal.Body className={styles.body}>
        <div className={styles.addressList} role="radiogroup" data-testid="address-list">
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
          data-testid="address-list-add-btn"
        >
          <AppIcon filled Icon={AddIcon} />
          {t("manageAddress.addAddress")}
        </Button>
      </Modal.Footer>
    </>
  );
};

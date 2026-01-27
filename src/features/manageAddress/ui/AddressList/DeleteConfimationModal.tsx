import {t} from "i18next";

import {UseDeleteConfirmationModal} from "@/features/manageAddress/model/services/useDeleteConfirmationModal.ts";

import DeleteIcon from "@/shared/assets/icons/Delete.svg?react";
import {cn} from "@/shared/lib";
import {AppIcon, Button, Modal} from "@/shared/ui";

import type {ShippingAddress} from "../../model/types/Address";

import styles from "./AddressList.module.scss";

interface DeleteConfirmationModalProps {
    address: ShippingAddress;
}

export const DeleteConfirmationModal = (
    props: DeleteConfirmationModalProps
) => {
    const {address} = props;

    const {
        handleDeleteModalClose,
        handleDeleteModalOpen,
        handleClickDelete,
        isDeleteModalOpen
    } = UseDeleteConfirmationModal()

    return (
        <Modal
            lazy={false}
            isOpen={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
        >
            <Modal.Trigger asChild>
                <Button
                    onClick={handleDeleteModalOpen}
                    theme="ghost"
                    size="sm"
                    className={cn(styles.action, styles.deleteAction)}
                >
                    <AppIcon Icon={DeleteIcon}/>
                    {t("manageAddress.delete")}
                </Button>
            </Modal.Trigger>
            <Modal.Content className={styles.deleteModal}>
                <Modal.Header>Delete Confirmation</Modal.Header>
                <Modal.Body>Are you sure you want to delete this address ?</Modal.Body>
                <Modal.Footer className={styles.deleteModalFooter}>
                    <Button theme="outline" onClick={handleDeleteModalClose}>
                        Cancel
                    </Button>
                    <Button onClick={(e) => handleClickDelete(e, address)}>Delete</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

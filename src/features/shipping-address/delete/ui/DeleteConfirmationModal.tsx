import {t} from "i18next";

import type {ShippingAddress} from "@/entities/shipping-address";

import DeleteIcon from "@/shared/assets/icons/Delete.svg?react";
import {cn} from "@/shared/lib/styling";
import {AppIcon} from "@/shared/ui/AppIcon";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";

import {useDeleteConfirmationModalController} from "../state/controllers/useDeleteConfirmationModalController";

import styles from "./DeleteConfirmationModal.module.scss";

interface DeleteConfirmationModalProps {
    address: ShippingAddress;
}

export const DeleteConfirmationModal = (props: DeleteConfirmationModalProps) => {
    const {address} = props;

    const {
        data: {isDeleteModalOpen},
        actions: {closeDeleteModal, openDeleteModal, deleteAddress},
    } = useDeleteConfirmationModalController();

    return (
        <Modal lazy={false} isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
            <Modal.Trigger asChild>
                <Button
                    onClick={openDeleteModal}
                    theme="ghost"
                    size="sm"
                    className={cn(styles.action, styles.deleteAction)}
                    data-testid={`address-item-${address.id}-delete-btn`}
                >
                    <AppIcon Icon={DeleteIcon} />
                    {t("manageAddress.delete")}
                </Button>
            </Modal.Trigger>
            <Modal.Content className={styles.deleteModal} data-testid="delete-confirmation-modal">
                <Modal.Header data-testid="delete-confirmation-header">
                    Delete Confirmation
                </Modal.Header>
                <Modal.Body data-testid="delete-confirmation-body">
                    Are you sure you want to delete this address ?
                </Modal.Body>
                <Modal.Footer className={styles.deleteModalFooter}>
                    <Button
                        theme="outline"
                        onClick={closeDeleteModal}
                        data-testid="delete-confirmation-cancel-btn"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => deleteAddress(e, address)}
                        data-testid="delete-confirmation-confirm-btn"
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};


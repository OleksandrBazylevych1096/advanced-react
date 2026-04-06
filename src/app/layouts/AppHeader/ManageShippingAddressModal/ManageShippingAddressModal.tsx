import {ManageShippingAddress} from "@/widgets/ManageShippingAddress";
import {
    DisplayShippingAddress
} from "@/widgets/ManageShippingAddress/ui/DisplayShippingAddress/DisplayShippingAddress.tsx";

import {
    saveShippingAddressActions,
    saveShippingAddressReducer,
    selectIsManageShippingAddressModalOpen,
} from "@/features/save-shipping-address";

import {DynamicModuleLoader, useAppDispatch, useAppSelector} from "@/shared/lib/state";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";

import styles from "./ManageShippingAddressModal.module.scss";

const reducers = {
    saveShippingAddress: saveShippingAddressReducer,
};


export const ManageShippingAddressModal = () => {
    const dispatch = useAppDispatch();
    const isModalOpen = useAppSelector(selectIsManageShippingAddressModalOpen);

    const openModal = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
        dispatch(saveShippingAddressActions.openManageShippingAddressModal());
    };

    const closeModal = () => {
        dispatch(saveShippingAddressActions.returnToChoose());
        dispatch(saveShippingAddressActions.closeManageShippingAddressModal());
    };

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

                        />
                    </Button>
                </Modal.Trigger>

                <Modal.Content className={styles.content} data-testid="manage-address-modal">
                    <ManageShippingAddress/>
                </Modal.Content>
            </Modal>
        </DynamicModuleLoader>
    );
};

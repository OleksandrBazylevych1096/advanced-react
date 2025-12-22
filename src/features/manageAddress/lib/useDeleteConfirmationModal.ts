import {type MouseEvent, useState} from "react";

import {useDeleteShippingAddressMutation} from "@/features/manageAddress/api/manageAddressApi.ts";
import type {ShippingAddress} from "@/features/manageAddress/model/types/Address.ts";

import {useToast} from "@/shared/lib";

export const UseDeleteConfirmationModal = () => {
    const {success, error: toastError} = useToast();
    const [deleteAddress] = useDeleteShippingAddressMutation();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const handleClickDelete = async (
        e: MouseEvent<HTMLButtonElement>,
        address: ShippingAddress
    ) => {
        e.stopPropagation();

        try {
            await deleteAddress({id: address.id}).unwrap();
            success("Address deleted successfully");
        } catch (error) {
            console.log(error);
            toastError("Failed to delete address. Please try again.");
        }
    };
    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteModalOpen = () => {
        setIsDeleteModalOpen(true);
    };

    return {
        handleDeleteModalClose,
        handleDeleteModalOpen,
        handleClickDelete,
        isDeleteModalOpen
    }
}
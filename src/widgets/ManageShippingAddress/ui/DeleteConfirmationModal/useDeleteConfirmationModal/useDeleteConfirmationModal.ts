import {type MouseEvent, useState} from "react";

import type {ShippingAddress} from "@/entities/shipping-address";

import {useToast} from "@/shared/lib/notifications";

import {useDeleteShippingAddressMutation} from "../../../api/deleteShippingAddressApi.ts";

export const useDeleteConfirmationModal = () => {
    const {success} = useToast();
    const [deleteAddress] = useDeleteShippingAddressMutation();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const deleteSelectedAddress = async (
        e: MouseEvent<HTMLButtonElement>,
        address: ShippingAddress,
    ) => {
        e.stopPropagation();

        try {
            await deleteAddress({id: address.id}).unwrap();
            success("Address deleted successfully");
        } catch {
            return;
        }
    };
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const openDeleteModal = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setIsDeleteModalOpen(true);
    };

    return {
        data: {
            isDeleteModalOpen,
        },
        actions: {
            closeDeleteModal,
            openDeleteModal,
            deleteAddress: deleteSelectedAddress,
        },
    };
};

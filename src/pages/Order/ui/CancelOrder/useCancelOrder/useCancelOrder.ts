import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useToast} from "@/shared/lib/notifications";

import {useCancelOrderMutation} from "../../../api/cancelOrderApi.ts";

interface UseCancelOrderControllerParams {
    orderId: string;
}

export const useCancelOrder = ({orderId}: UseCancelOrderControllerParams) => {
    const {t} = useTranslation("checkout");
    const {success, error} = useToast();
    const [cancelOrder, {isLoading: isCancellingOrder}] = useCancelOrderMutation();
    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState<boolean>(false);

    const openCancelOrderModal = (): void => {
        setIsCancelOrderModalOpen(true);
    };

    const closeCancelOrderModal = (): void => {
        setIsCancelOrderModalOpen(false);
    };

    const confirmOrderCancellation = async (): Promise<void> => {
        if (isCancellingOrder) {
            return;
        }

        try {
            await cancelOrder({id: orderId}).unwrap();
            closeCancelOrderModal();
            success(t("order.cancelOrder.success"));
        } catch {
            error(t("order.cancelOrder.error"));
        }
    };

    return {
        data: {
            isCancelOrderModalOpen,
        },
        status: {
            isCancellingOrder,
        },
        actions: {
            openCancelOrderModal,
            closeCancelOrderModal,
            confirmOrderCancellation,
        },
    };
};

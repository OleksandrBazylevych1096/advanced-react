import {useTranslation} from "react-i18next";

import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";
import {Stack} from "@/shared/ui/Stack";

import {useCancelOrderController} from "../model/controllers/useCancelOrderController";

interface CancelOrderProps {
    orderId: string;
}

export const CancelOrder = ({orderId}: CancelOrderProps) => {
    const {t} = useTranslation("checkout");
    const {
        data: {isCancelOrderModalOpen},
        status: {isCancellingOrder},
        actions: {openCancelOrderModal, closeCancelOrderModal, confirmOrderCancellation},
    } = useCancelOrderController({orderId});

    return (
        <Modal isOpen={isCancelOrderModalOpen} onClose={closeCancelOrderModal}>
            <Modal.Trigger asChild>
                <Button type="button" theme="outline" size="lg" onClick={openCancelOrderModal}>
                    {t("order.cancelOrder.trigger")}
                </Button>
            </Modal.Trigger>

            <Modal.Content>
                <Modal.Header>{t("order.cancelOrder.modalTitle")}</Modal.Header>
                <Modal.Body>{t("order.cancelOrder.modalDescription")}</Modal.Body>
                <Modal.Footer>
                    <Stack gap={12} direction={"row"} justify={"flex-end"}>
                        <Button
                            type="button"
                            theme="outline"
                            onClick={closeCancelOrderModal}
                            disabled={isCancellingOrder}
                        >
                            {t("order.cancelOrder.keepOrder")}
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmOrderCancellation}
                            isLoading={isCancellingOrder}
                            disabled={isCancellingOrder}
                        >
                            {t("order.cancelOrder.confirmCancel")}
                        </Button>
                    </Stack>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

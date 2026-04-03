import {useTranslation} from "react-i18next";

import {cn} from "@/shared/lib/styling";
import {Button} from "@/shared/ui/Button";
import {Modal} from "@/shared/ui/Modal";
import {Spinner} from "@/shared/ui/Spinner";
import {Stack} from "@/shared/ui/Stack";
import {Typography} from "@/shared/ui/Typography";

import {getDeliveryLabel} from "../../lib/format/formatDate";
import {ChooseDeliveryDateContent} from "../ChooseDeliveryDateContent/ChooseDeliveryDateContent";

import styles from "./ChooseDeliveryDate.module.scss";
import {useChooseDeliveryDate} from "./useChooseDeliveryDate/useChooseDeliveryDate.ts";

interface ChooseDeliveryDateProps {
    className?: string;
}

export const ChooseDeliveryDate = ({className}: ChooseDeliveryDateProps) => {
    const {i18n, t} = useTranslation("checkout");
    const {
        data: {
            isAuthenticated,
            isOpen,
            availableDates,
            selectedDate,
            selectedDateSlots,
            selectedTime,
            savedSelection,
            canApply,
        },
        status: {isLoading, isError, isSaving, isUserHaveDefaultAddress},
        actions: {
            openModal,
            closeModal,
            selectDate,
            selectTime,
            cancelSelection,
            applySelection,
            navigateToLogin,
            refetchSlots,
        },
    } = useChooseDeliveryDate();
    const triggerLabel = getDeliveryLabel(
        i18n.language,
        savedSelection,
        t("chooseDeliveryDate.trigger"),
    );

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <Modal.Trigger asChild>
                <Button
                    type="button"
                    theme="ghost"
                    size="md"
                    className={cn(styles.trigger, className)}
                    onClick={openModal}
                    data-testid="delivery-date-trigger"
                >
                    {isLoading ? (
                        <Spinner size="sm" data-testid="delivery-date-trigger-spinner" />
                    ) : (
                        <Typography
                            as="span"
                            variant="body"
                            weight="semibold"
                            className={cn(styles.triggerLabel)}
                        >
                            {triggerLabel}
                        </Typography>
                    )}
                </Button>
            </Modal.Trigger>
            <Modal.Content className={styles.modalContent} data-testid="choose-delivery-date-modal">
                <Modal.Header
                    className={styles.modalHeader}
                    childContainerClassName={styles.modalHeaderContent}
                >
                    <Typography
                        as="h3"
                        variant="heading"
                        weight="semibold"
                        className={styles.title}
                    >
                        {t("chooseDeliveryDate.modalTitle")}
                    </Typography>
                </Modal.Header>

                <Modal.Body className={styles.modalBody}>
                    <ChooseDeliveryDateContent
                        isUserHaveDefaultAddress={isUserHaveDefaultAddress}
                        isAuthenticated={isAuthenticated}
                        isLoading={isLoading}
                        isError={isError}
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        selectedDateSlots={selectedDateSlots}
                        selectedTime={selectedTime}
                        isSaving={isSaving}
                        onNavigateToLogin={navigateToLogin}
                        onRetrySlots={refetchSlots}
                        onSelectDate={selectDate}
                        onSelectTime={selectTime}
                    />
                </Modal.Body>
                {isAuthenticated && (
                    <Modal.Footer className={styles.modalFooter}>
                        <Stack direction="row" justify="flex-end" gap={12}>
                            <Button
                                type="button"
                                theme="tertiary"
                                size="md"
                                onClick={cancelSelection}
                                disabled={isSaving}
                                data-testid="delivery-cancel-btn"
                            >
                                {t("chooseDeliveryDate.cancel")}
                            </Button>
                            <Button
                                type="button"
                                theme="primary"
                                size="md"
                                onClick={applySelection}
                                isLoading={isSaving}
                                disabled={!canApply}
                                data-testid="delivery-apply-btn"
                            >
                                {t("chooseDeliveryDate.apply")}
                            </Button>
                        </Stack>
                    </Modal.Footer>
                )}
            </Modal.Content>
        </Modal>
    );
};

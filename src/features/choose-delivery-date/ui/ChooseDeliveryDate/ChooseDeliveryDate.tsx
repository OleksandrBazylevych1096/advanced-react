import {useTranslation} from "react-i18next";

import {cn} from "@/shared/lib";
import {Button, Modal, Stack, Typography} from "@/shared/ui";

import {formatDeliveryTriggerLabel} from "../../lib/format/formatDate";
import {useChooseDeliveryDateController} from "../../model/controllers/useChooseDeliveryDateController";
import {ChooseDeliveryDateContent} from "../ChooseDeliveryDateContent/ChooseDeliveryDateContent";

import styles from "./ChooseDeliveryDate.module.scss";

interface ChooseDeliveryDateProps {
    className?: string;
}

export const ChooseDeliveryDate = ({className}: ChooseDeliveryDateProps) => {
    const {i18n} = useTranslation();
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
    } = useChooseDeliveryDateController();
    const triggerLabel = formatDeliveryTriggerLabel(i18n.language, savedSelection);

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <Modal.Trigger asChild>
                <Button
                    type="button"
                    theme="tertiary"
                    size="md"
                    className={cn(styles.trigger, className)}
                    onClick={openModal}
                    data-testid="delivery-date-trigger"
                >
                    <Stack
                        direction="column"
                        align="start"
                        gap={4}
                        className={styles.triggerContent}
                    >
                        {isLoading ? (
                            <div className={styles.triggerTextSkeleton}>
                                <div className={styles.triggerTitleSkeleton}/>
                                <div className={styles.triggerLabelSkeleton}/>
                            </div>
                        ) : (
                            <>
                                <Typography as="h4" variant="heading" weight="bold">
                                    Delivery
                                </Typography>
                                <Typography
                                    as="span"
                                    variant="body"
                                    weight="semibold"
                                    className={styles.triggerLabel}
                                >
                                    {triggerLabel}
                                </Typography>
                            </>
                        )}
                    </Stack>
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
                        Choose your delivery date
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
                                Cancel
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
                                Apply
                            </Button>
                        </Stack>
                    </Modal.Footer>
                )}
            </Modal.Content>
        </Modal>
    );
};

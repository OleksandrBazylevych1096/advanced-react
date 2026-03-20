import {useTranslation} from "react-i18next";

import {Button, EmptyState, ErrorState, Stack, Typography} from "@/shared/ui";

import {formatDateCard, formatSelectedDateTitle} from "../../lib/format/formatDate";

import styles from "./ChooseDeliveryDateContent.module.scss";
import {ChooseDeliveryDateContentSkeleton} from "./ChooseDeliveryDateContentSkeleton";

interface ChooseDeliveryDateContentProps {
    isUserHaveDefaultAddress: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    isError: boolean;
    availableDates: {date: string; slots: string[]}[];
    selectedDate: string | null;
    selectedDateSlots: string[];
    selectedTime: string | null;
    isSaving: boolean;
    onNavigateToLogin: () => void;
    onRetrySlots: () => void;
    onSelectDate: (date: string) => void;
    onSelectTime: (time: string) => void;
}

export const ChooseDeliveryDateContent = (props: ChooseDeliveryDateContentProps) => {
    const {i18n, t} = useTranslation("checkout");

    const {
        isUserHaveDefaultAddress,
        isAuthenticated,
        isLoading,
        isError,
        availableDates,
        selectedDate,
        selectedDateSlots,
        selectedTime,
        isSaving,
        onNavigateToLogin,
        onRetrySlots,
        onSelectDate,
        onSelectTime,
    } = props;

    if (!isAuthenticated) {
        return (
            <Stack className={styles.guestState} gap={12}>
                <Typography variant="body" tone="muted">
                    {t("chooseDeliveryDate.signInPrompt")}
                </Typography>
                <Button type="button" theme="primary" size="md" onClick={onNavigateToLogin}>
                    {t("chooseDeliveryDate.signIn")}
                </Button>
            </Stack>
        );
    }

    if (isLoading) {
        return <ChooseDeliveryDateContentSkeleton />;
    }

    if (isError) {
        return (
            <ErrorState
                message={t("chooseDeliveryDate.failedToLoadSlots")}
                onRetry={onRetrySlots}
                className={styles.errorState}
            />
        );
    }

    if (!isUserHaveDefaultAddress) {
        return (
            <EmptyState
                title={t("chooseDeliveryDate.noDefaultAddressTitle")}
                description={t("chooseDeliveryDate.noDefaultAddressDescription")}
                className={styles.emptyState}
            />
        );
    }

    if (!availableDates.length) {
        return (
            <EmptyState
                title={t("chooseDeliveryDate.noDeliverySlotsTitle")}
                description={t("chooseDeliveryDate.noDeliverySlotsDescription")}
                className={styles.emptyState}
            />
        );
    }

    return (
        <Stack gap={24} className={styles.content}>
            <Stack gap={12}>
                <Typography as="h4" variant="heading" weight="bold">
                    {t("chooseDeliveryDate.selectDate")}
                </Typography>
                <Stack direction="row" gap={16} className={styles.dateGrid}>
                    {availableDates.map((dateItem) => {
                        const formatted = formatDateCard(dateItem.date, i18n.language);
                        const isActive = selectedDate === dateItem.date;

                        return (
                            <Button
                                key={dateItem.date}
                                type="button"
                                onClick={() => onSelectDate(dateItem.date)}
                                theme={isActive ? "primary" : "tertiary"}
                                size="md"
                                className={styles.dateButton}
                                data-testid={`delivery-date-${dateItem.date}`}
                            >
                                <span className={styles.dayName}>{formatted.weekDay}</span>
                                <span className={styles.dayDate}>{formatted.monthDay}</span>
                            </Button>
                        );
                    })}
                </Stack>
            </Stack>

            {selectedDate && (
                <Stack gap={12}>
                    <Typography as="h4" variant="heading" weight="bold">
                        {t("chooseDeliveryDate.selectDeliveryTimeSlotOn", {
                            date: formatSelectedDateTitle(selectedDate, i18n.language),
                        })}
                    </Typography>
                    <Stack direction="row" gap={16} className={styles.timeSlots}>
                        {selectedDateSlots.map((slot) => {
                            const isActive = selectedTime === slot;

                            return (
                                <Button
                                    key={slot}
                                    type="button"
                                    onClick={() => onSelectTime(slot)}
                                    disabled={isSaving}
                                    theme={isActive ? "outline" : "tertiary"}
                                    size="md"
                                    className={styles.timeSlot}
                                    data-testid={`delivery-time-${slot}`}
                                >
                                    {slot}
                                </Button>
                            );
                        })}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
};

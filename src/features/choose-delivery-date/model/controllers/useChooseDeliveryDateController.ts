import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";

import {useGetDefaultShippingAddressQuery} from "@/entities/shipping-address";
import {selectIsAuthenticated} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {
    createControllerResult,
    useAppSelector,
    useLocalizedRoutePath,
    useToast,
} from "@/shared/lib";

import {
    useGetDeliverySelectionQuery,
    useGetDeliverySlotsQuery,
    useSetDeliverySlotMutation,
} from "../../api/chooseDeliveryDateApi";

interface SavedDeliverySelection {
    date: string;
    time: string;
}

const DEFAULT_DAYS = 7;

const toDateOnly = (value: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return value.slice(0, 10);
};

export const useChooseDeliveryDateController = () => {
    const {i18n} = useTranslation();
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const toast = useToast();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [savedSelection, setSavedSelection] = useState<SavedDeliverySelection | null>(null);

    const {
        data: deliverySelection,
        isFetching: isSelectionLoading,
        isError: isSelectionError,
    } = useGetDeliverySelectionQuery(
        {locale: i18n.language},
        {
            skip: !isAuthenticated,
        },
    );

    useEffect(() => {
        if (!deliverySelection?.deliveryDate || !deliverySelection?.deliveryTime) {
            setSavedSelection(null);
            return;
        }

        setSavedSelection({
            date: toDateOnly(deliverySelection.deliveryDate),
            time: deliverySelection.deliveryTime,
        });
    }, [deliverySelection?.deliveryDate, deliverySelection?.deliveryTime]);

    const {
        data: defaultAddress,
        isFetching: isAddressLoading,
        isError: isAddressError,
    } = useGetDefaultShippingAddressQuery(undefined, {
        skip: !isAuthenticated || !isOpen,
    });

    const addressId = defaultAddress?.id;

    const {
        data: slotsResponse,
        isFetching: isSlotsLoading,
        isError: isSlotsError,
        refetch: refetchSlots,
    } = useGetDeliverySlotsQuery(
        {
            addressId: addressId ?? "",
            days: DEFAULT_DAYS,
            locale: i18n.language,
        },
        {
            skip: !isAuthenticated || !isOpen || !addressId,
        },
    );

    const availableDates = useMemo(
        () => slotsResponse?.availableDates ?? [],
        [slotsResponse?.availableDates],
    );

    useEffect(() => {
        if (!availableDates.length) {
            if (isSlotsLoading) return;
            setSelectedDate(null);
            setSelectedTime(null);
            return;
        }

        const hasSelectedDate = selectedDate
            ? availableDates.some((dateItem) => dateItem.date === selectedDate)
            : false;

        if (!hasSelectedDate) {
            setSelectedDate(availableDates[0].date);
            setSelectedTime(null);
        }
    }, [availableDates, isSlotsLoading, selectedDate]);

    const selectedDateSlots = selectedDate
        ? (availableDates.find((dateItem) => dateItem.date === selectedDate)?.slots ?? [])
        : [];

    const [setDeliverySlot, {isLoading: isSaving}] = useSetDeliverySlotMutation();

    const restoreSavedSelection = () => {
        setSelectedDate(savedSelection?.date ?? null);
        setSelectedTime(savedSelection?.time ?? null);
    };

    const openModal = () => {
        restoreSavedSelection();
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const cancelSelection = () => {
        restoreSavedSelection();
        closeModal();
    };

    const selectDate = (date: string) => {
        setSelectedDate(date);

        setSelectedTime((currentTime) => {
            if (!currentTime) return null;

            const nextDateSlots = availableDates.find((dateItem) => dateItem.date === date)?.slots;
            if (nextDateSlots?.includes(currentTime)) return currentTime;

            return null;
        });
    };

    const selectTime = (time: string) => {
        setSelectedTime(time);
    };

    const applySelection = async () => {
        if (!selectedDate || !selectedTime) return;
        if (!selectedDateSlots.includes(selectedTime)) return;

        try {
            await setDeliverySlot({
                deliveryDate: selectedDate,
                deliveryTime: selectedTime,
                addressId,
                locale: i18n.language,
            }).unwrap();

            setSavedSelection({date: selectedDate, time: selectedTime});
            closeModal();
        } catch {
            toast.error("Failed to save delivery slot. Please try again.");
        }
    };

    const navigateToLogin = () => {
        navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
    };

    const canApply = Boolean(selectedDate && selectedTime);
    const hasChanges =
        (savedSelection?.date ?? null) !== selectedDate ||
        (savedSelection?.time ?? null) !== selectedTime;
    const isLoading = isAddressLoading || isSlotsLoading || isSelectionLoading;
    const isError = isAddressError || isSlotsError || isSelectionError;

    return createControllerResult({
        data: {
            isAuthenticated,
            isOpen,
            availableDates,
            selectedDate,
            selectedDateSlots,
            selectedTime,
            savedSelection,
            canApply: canApply && hasChanges,
        },
        status: {
            isUserHaveDefaultAddress: Boolean(defaultAddress),
            isLoading,
            isError,
            isSaving,
        },
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
    });
};

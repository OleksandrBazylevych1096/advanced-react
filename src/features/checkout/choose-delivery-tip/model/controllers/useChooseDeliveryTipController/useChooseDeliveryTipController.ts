import {useEffect, useMemo, useState} from "react";

import {
    PRESET_VALUES,
    TIP_INPUT_DEBOUNCE_MS,
} from "@/features/checkout/choose-delivery-tip/config/consts";

import {selectUserCurrency} from "@/entities/user";

import {useDebounce} from "@/shared/lib/async";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {selectChooseDeliveryTipAmount} from "../../selectors/chooseDeliveryTipSelectors";
import {chooseDeliveryTipActions} from "../../slice/chooseDeliveryTipSlice";

export const useChooseDeliveryTipController = () => {
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectUserCurrency);
    const amount = useAppSelector(selectChooseDeliveryTipAmount);

    const normalizedAmount = useMemo(() => (Number.isFinite(amount) ? amount : 0), [amount]);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const isPresetValue = PRESET_VALUES.some((preset) => preset === normalizedAmount);
    const shouldShowCustomInput = isOtherSelected || (!isPresetValue && normalizedAmount > 0);
    const [customTipValue, setCustomTipValue] = useState<string>(
        normalizedAmount > 0 ? String(normalizedAmount) : "",
    );
    const debouncedCustomTipValue = useDebounce(customTipValue, TIP_INPUT_DEBOUNCE_MS);

    useEffect(() => {
        if (!shouldShowCustomInput) return;
        setCustomTipValue(normalizedAmount > 0 ? String(normalizedAmount) : "");
    }, [normalizedAmount, shouldShowCustomInput]);

    useEffect(() => {
        if (!shouldShowCustomInput) return;

        const parsed = Number(debouncedCustomTipValue);
        if (!Number.isFinite(parsed)) {
            dispatch(chooseDeliveryTipActions.setAmount(0));
            return;
        }

        if (parsed < 0) {
            dispatch(chooseDeliveryTipActions.setAmount(0));
            return;
        }

        dispatch(chooseDeliveryTipActions.setAmount(parsed));
    }, [debouncedCustomTipValue, dispatch, shouldShowCustomInput]);

    const selectPresetTip = (preset: number) => {
        setIsOtherSelected(false);
        if (normalizedAmount === preset) {
            dispatch(chooseDeliveryTipActions.setAmount(0));
            return;
        }

        dispatch(chooseDeliveryTipActions.setAmount(preset));
    };

    const selectCustomTip = () => {
        if (shouldShowCustomInput) {
            setIsOtherSelected(false);
            dispatch(chooseDeliveryTipActions.setAmount(0));
            return;
        }

        setIsOtherSelected(true);

        if (isPresetValue) {
            dispatch(chooseDeliveryTipActions.setAmount(0));
        }
    };

    return createControllerResult({
        data: {
            amount: normalizedAmount,
            currency,
            customTipValue,
            shouldShowCustomInput,
            presetValues: PRESET_VALUES,
        },
        actions: {
            selectPresetTip,
            selectCustomTip,
            setCustomTipValue,
        },
    });
};

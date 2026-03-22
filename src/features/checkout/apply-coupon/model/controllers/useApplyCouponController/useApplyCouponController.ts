import {useTranslation} from "react-i18next";

import {selectIsAuthenticated, selectUserCurrency} from "@/entities/user";

import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {useLazyValidateCouponQuery} from "../../../api/validateCouponApi/validateCouponApi";
import {
    selectApplyCouponCode,
    selectApplyCouponDraftCode,
    selectApplyCouponIsApplying,
    selectApplyCouponIsModalOpen,
    selectApplyCouponMessage,
} from "../../selectors/applyCouponSelectors";
import {applyCouponActions} from "../../slice/applyCouponSlice";

const INVALID_COUPON_MESSAGE = "Invalid coupon code.";
const COUPON_REQUEST_ERROR = "Failed to validate coupon.";

export const useApplyCouponController = () => {
    const {i18n} = useTranslation();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currency = useAppSelector(selectUserCurrency);

    const code = useAppSelector(selectApplyCouponCode);
    const draftCode = useAppSelector(selectApplyCouponDraftCode);
    const message = useAppSelector(selectApplyCouponMessage);
    const isModalOpen = useAppSelector(selectApplyCouponIsModalOpen);
    const isApplying = useAppSelector(selectApplyCouponIsApplying);

    const [triggerValidateCoupon, {isFetching: isValidationLoading}] = useLazyValidateCouponQuery();

    const openModal = () => {
        dispatch(applyCouponActions.setDraftCode(code));
        dispatch(applyCouponActions.setModalOpen(true));
    };

    const closeModal = () => {
        dispatch(applyCouponActions.setDraftCode(code));
        dispatch(applyCouponActions.setIsApplying(false));
        dispatch(applyCouponActions.setModalOpen(false));
    };

    const setDraftCode = (nextDraft: string) => {
        dispatch(applyCouponActions.setDraftCode(nextDraft));
    };

    const removeCoupon = () => {
        dispatch(applyCouponActions.setCode(""));
        dispatch(applyCouponActions.setDraftCode(""));
        dispatch(applyCouponActions.setMessage(null));
        dispatch(applyCouponActions.setIsApplying(false));
    };

    const applyCoupon = async () => {
        const trimmedCoupon = draftCode.trim();
        dispatch(applyCouponActions.setIsApplying(true));

        if (trimmedCoupon.length === 0) {
            removeCoupon();
            dispatch(applyCouponActions.setModalOpen(false));
            return;
        }

        if (!isAuthenticated) {
            dispatch(applyCouponActions.setMessage(COUPON_REQUEST_ERROR));
            dispatch(applyCouponActions.setModalOpen(true));
            dispatch(applyCouponActions.setIsApplying(false));
            return;
        }

        try {
            const summary = await triggerValidateCoupon({
                locale: i18n.language,
                currency,
                couponCode: trimmedCoupon,
            }).unwrap();

            if (summary.isValid) {
                dispatch(applyCouponActions.setCode(trimmedCoupon));
                dispatch(applyCouponActions.setDraftCode(trimmedCoupon));
                dispatch(applyCouponActions.setMessage(null));
                dispatch(applyCouponActions.setModalOpen(false));
                return;
            }

            dispatch(applyCouponActions.setMessage(summary.message || INVALID_COUPON_MESSAGE));
            dispatch(applyCouponActions.setModalOpen(true));
        } catch {
            dispatch(applyCouponActions.setMessage(COUPON_REQUEST_ERROR));
            dispatch(applyCouponActions.setModalOpen(true));
        } finally {
            dispatch(applyCouponActions.setIsApplying(false));
        }
    };

    return createControllerResult({
        data: {
            code,
            draftCode,
            validationMessage: message,
            isModalOpen,
            isValidationLoading,
            isApplying,
        },
        actions: {
            openModal,
            closeModal,
            setDraftCode,
            applyCoupon,
            removeCoupon,
        },
    });
};

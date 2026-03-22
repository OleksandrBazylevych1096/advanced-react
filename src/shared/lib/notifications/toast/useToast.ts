import {useCallback} from "react";
import {useDispatch} from "react-redux";

import {toastActions} from "./state/slice/toastSlice";

export const useToast = () => {
    const dispatch = useDispatch();

    const info = useCallback(
        (message: string, duration?: number) => {
            dispatch(toastActions.addToast({message, type: "info", duration}));
        },
        [dispatch],
    );

    const success = useCallback(
        (message: string, duration?: number) => {
            dispatch(toastActions.addToast({message, type: "success", duration}));
        },
        [dispatch],
    );
    const error = useCallback(
        (message: string, duration?: number) => {
            dispatch(toastActions.addToast({message, type: "error", duration}));
        },
        [dispatch],
    );
    const warning = useCallback(
        (message: string, duration?: number) => {
            dispatch(toastActions.addToast({message, type: "warning", duration}));
        },
        [dispatch],
    );

    return {
        info,
        success,
        error,
        warning,
    };
};

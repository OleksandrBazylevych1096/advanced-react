import { useCallback } from "react";

import { toastActions } from "@/app/providers";

import { useAppDispatch } from "../redux/hooks";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const info = useCallback(
    (message: string, duration?: number) => {
      dispatch(toastActions.addToast({ message, type: "info", duration }));
    },
    [dispatch]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      dispatch(toastActions.addToast({ message, type: "success", duration }));
    },
    [dispatch]
  );
  const error = useCallback(
    (message: string, duration?: number) => {
      dispatch(toastActions.addToast({ message, type: "error", duration }));
    },
    [dispatch]
  );
  const warning = useCallback(
    (message: string, duration?: number) => {
      dispatch(toastActions.addToast({ message, type: "warning", duration }));
    },
    [dispatch]
  );

  return {
    info,
    success,
    error,
    warning,
  };
};

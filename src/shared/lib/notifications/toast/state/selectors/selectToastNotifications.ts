import type {ToastSchema} from "../types/toast";

type ToastState = {
    toast?: ToastSchema;
};

export const selectToastNotifications = (state: ToastState) => state.toast?.notifications ?? [];

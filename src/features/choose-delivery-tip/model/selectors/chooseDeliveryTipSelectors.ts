import type {StateSchema} from "@/app/store";

export const selectChooseDeliveryTipAmount = (state: StateSchema) =>
    state.chooseDeliveryTip?.amount ?? 0;

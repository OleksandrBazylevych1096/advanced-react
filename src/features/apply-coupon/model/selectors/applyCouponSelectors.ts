import type {StateSchema} from "@/app/store";

export const selectApplyCouponCode = (state: StateSchema) => state.applyCoupon?.code ?? "";
export const selectApplyCouponDraftCode = (state: StateSchema) =>
    state.applyCoupon?.draftCode ?? "";
export const selectApplyCouponMessage = (state: StateSchema) => state.applyCoupon?.message ?? null;
export const selectApplyCouponIsModalOpen = (state: StateSchema) =>
    state.applyCoupon?.isModalOpen ?? false;
export const selectApplyCouponIsApplying = (state: StateSchema) =>
    state.applyCoupon?.isApplying ?? false;

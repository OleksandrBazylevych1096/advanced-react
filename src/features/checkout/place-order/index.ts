import {
    useCreatePaymentSessionMutation,
    useGetCheckoutSummaryQuery,
} from "./api/checkoutApi/checkoutApi.ts";
import {useLazyGetOrderByIdQuery} from "./api/orderApi/orderApi.ts";
import {buildCheckoutSummaryRows} from "./lib/buildCheckoutSummaryRows/buildCheckoutSummaryRows.ts";
import {checkIsCheckoutReady} from "./lib/validation/checkIsCheckoutReady.ts";
import {usePlaceOrderController} from "./state/controllers/usePlaceOrderController/usePlaceOrderController.ts";
import {calculateCheckoutTotals} from "./state/services/calculateCheckoutTotals/calculateCheckoutTotals.ts";
import {PlaceOrder} from "./ui/PlaceOrder.tsx";

export {
    usePlaceOrderController,
    useGetCheckoutSummaryQuery,
    useCreatePaymentSessionMutation,
    useLazyGetOrderByIdQuery,
    buildCheckoutSummaryRows,
    checkIsCheckoutReady,
    calculateCheckoutTotals,
    PlaceOrder,
};
export type {
    DeliverySelection,
    CheckoutSummary,
    PlaceOrderRequest,
    PlaceOrderResponse,
    OrderDetails,
} from "./types/checkoutTypes";
export type {OrderStatusType} from "@/entities/order";


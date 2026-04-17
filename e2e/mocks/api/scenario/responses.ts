import type {
    CheckoutSummary,
    PlaceOrderResponse,
} from "@/pages/Checkout/model/types/checkoutTypes.ts";
import {mockCheckoutSummary, mockPlaceOrderResponse} from "@/pages/Checkout/testing";
import {mockCheckoutSessionPaid} from "@/pages/CheckoutResult/testing";

import type {Cart} from "@/entities/cart/index.ts";
import {mockCartValidation} from "@/entities/cart/testing";
import {mockOrderDetailsProcessing, OrderStatus, type OrderDetails} from "@/entities/order/testing";
import type {ProductsApiResponse} from "@/entities/product/index.ts";

import {cloneValue} from "./cloneValue";
import {DEFAULT_TIP_AMOUNT} from "./constants";
import {calculateCartTotals, resolveCoupon} from "./helpers";
import type {ApiScenario, CheckoutOptions} from "./types";

export const createProductsResponse = (scenario: ApiScenario): ProductsApiResponse => ({
    products: scenario.products,
    facets: scenario.productFacets,
    pagination: {
        hasNext: false,
        hasPrev: false,
        limit: scenario.products.length,
        page: 1,
        total: scenario.products.length,
        totalPages: 1,
    },
});

export const createCartResponse = (scenario: ApiScenario): Cart => ({
    items: scenario.cartItems,
    totals: calculateCartTotals(scenario.cartItems),
});

export const createCheckoutSummary = (
    scenario: ApiScenario,
    options: Pick<CheckoutOptions, "couponCode" | "tipAmount"> = {},
): CheckoutSummary => {
    const coupon = resolveCoupon(options.couponCode);

    return {
        ...cloneValue(mockCheckoutSummary),
        items: scenario.cartItems,
        totals: calculateCartTotals(scenario.cartItems, options),
        coupon,
        validation: cloneValue(mockCartValidation),
    };
};

export const createOrderFromScenario = (
    scenario: ApiScenario,
    orderId: string,
    options: CheckoutOptions = {},
): OrderDetails => {
    const coupon = resolveCoupon(options.couponCode);
    const tipAmount = options.tipAmount ?? DEFAULT_TIP_AMOUNT;
    const totals = calculateCartTotals(scenario.cartItems, {
        couponCode: options.couponCode,
        tipAmount,
    });
    const status =
        options.orderStatus ??
        mockCheckoutSessionPaid.order?.status ??
        mockOrderDetailsProcessing.status;

    return {
        ...cloneValue(mockOrderDetailsProcessing),
        id: orderId,
        status,
        paymentStatus:
            mockCheckoutSessionPaid.order?.paymentStatus ??
            mockOrderDetailsProcessing.paymentStatus,
        totalAmount: totals.total,
        shippingAmount: totals.estimatedShipping,
        subtotalAmount: totals.subtotal,
        taxAmount: totals.estimatedTax,
        discountAmount: coupon.discountAmount,
        tipAmount,
        couponCode: coupon.code,
        shippingAddress: {
            streetAddress: scenario.defaultAddress.streetAddress,
            city: scenario.defaultAddress.city,
            numberOfApartment: scenario.defaultAddress.numberOfApartment,
            zipCode: scenario.defaultAddress.zipCode,
        },
        deliveryDate: scenario.deliverySelection.deliveryDate,
        deliveryTime: scenario.deliverySelection.deliveryTime,
        timeline:
            status === OrderStatus.CANCELLED
                ? [
                      ...cloneValue(mockOrderDetailsProcessing.timeline),
                      {
                          id: "cancelled",
                          status: OrderStatus.CANCELLED,
                          timestamp: "2026-03-24T02:00:00.000Z",
                          progress: 100,
                      },
                  ]
                : cloneValue(mockOrderDetailsProcessing.timeline),
        orderItems: scenario.cartItems.map((item, index) => ({
            id: `oi-${index + 1}`,
            quantity: item.quantity,
            price: item.product.price,
            total: item.product.price * item.quantity,
            product: item.product,
        })),
    };
};

export const createPaymentSessionResponse = (
    scenario: ApiScenario,
    checkoutUrl: string,
    options: Pick<CheckoutOptions, "couponCode" | "tipAmount"> = {},
): PlaceOrderResponse => {
    const orderId = mockCheckoutSessionPaid.order?.id ?? "order-1";
    const coupon = resolveCoupon(options.couponCode);
    const tipAmount = options.tipAmount ?? DEFAULT_TIP_AMOUNT;
    const order = createOrderFromScenario(scenario, orderId, {
        couponCode: options.couponCode,
        tipAmount,
    });

    scenario.createdOrder = order;
    scenario.checkoutSession = {
        ...cloneValue(mockCheckoutSessionPaid),
        amount: order.totalAmount,
        tipAmount,
        discountAmount: coupon.discountAmount,
        couponCode: coupon.code,
        order: {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
        },
    };

    return {
        ...cloneValue(mockPlaceOrderResponse),
        amount: order.totalAmount,
        tipAmount,
        discountAmount: coupon.discountAmount,
        couponCode: coupon.code,
        checkoutUrl,
    };
};

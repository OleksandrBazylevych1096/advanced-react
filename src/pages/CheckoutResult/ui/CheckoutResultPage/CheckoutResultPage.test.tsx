import {fireEvent, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {renderWithProviders} from "@/shared/lib/testing/react/renderWithProviders";

import CheckoutResultPage from "./CheckoutResultPage";

const testCtx = vi.hoisted(() => ({
    navigateMock: vi.fn(),
    useCheckoutResultPageMock: vi.fn(),
}));

vi.mock("react-i18next", async () => {
    const actual = await vi.importActual<typeof import("react-i18next")>("react-i18next");
    return {
        ...actual,
        useTranslation: () => ({
            t: (key: string) => key,
        }),
    };
});

vi.mock("react-router", async () => {
    const actual = await vi.importActual<typeof import("react-router")>("react-router");
    return {
        ...actual,
        useNavigate: () => testCtx.navigateMock,
    };
});

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedRoutePath: () => (path: string, params?: {id?: string}) =>
        path.replace(":lng", "en").replace(":id", params?.id ?? ""),
}));

vi.mock("../../lib/useSessionIdFromParams.ts", () => ({
    useSessionIdFromParams: () => "sess_123",
}));

vi.mock("./useCheckoutResultPage/useCheckoutResultPage.ts", () => ({
    useCheckoutResultPage: (...args: unknown[]) => testCtx.useCheckoutResultPageMock(...args),
}));

describe("CheckoutResultPage", () => {
    test("navigates to order page when track order is clicked", () => {
        testCtx.useCheckoutResultPageMock.mockReturnValue({
            data: {
                paymentStatus: "PAID",
                orderDetails: {
                    id: "order-1",
                    orderNumber: "ORD-2026-0001",
                },
            },
            status: {
                isPolling: false,
                isPaymentDeclined: false,
                isSystemError: false,
            },
        });

        renderWithProviders(<CheckoutResultPage />);

        fireEvent.click(screen.getByRole("button", {name: "result.trackOrder"}));

        expect(testCtx.navigateMock).toHaveBeenCalledWith("/en/order/order-1");
    });

    test("disables track order button when order id is missing", () => {
        testCtx.useCheckoutResultPageMock.mockReturnValue({
            data: {
                paymentStatus: "PAID",
                orderDetails: null,
            },
            status: {
                isPolling: false,
                isPaymentDeclined: false,
                isSystemError: false,
            },
        });

        renderWithProviders(<CheckoutResultPage />);

        const trackOrderButton = screen.getByRole("button", {name: "result.trackOrder"});
        expect(trackOrderButton).toBeDisabled();
    });
});

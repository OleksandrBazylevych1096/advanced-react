import {render} from "@testing-library/react";
import type React from "react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {ChooseDeliveryDate} from "./ChooseDeliveryDate";

const useChooseDeliveryDateMock = vi.fn();

vi.mock("./useChooseDeliveryDate", () => ({
    useChooseDeliveryDate: () => useChooseDeliveryDateMock(),
}));

const formatDeliveryTriggerLabelMock = vi.fn(
    (_locale: string, _selection: unknown, _defaultLabel?: string) => "Choose delivery date",
);

vi.mock("../../lib/format/formatDate", () => ({
    getDeliveryLabel: (locale: string, selection: unknown, defaultLabel?: string) =>
        formatDeliveryTriggerLabelMock(locale, selection, defaultLabel),
}));

vi.mock("@/shared/ui", () => {
    const ModalRoot = ({children}: {children: React.ReactNode}) => <>{children}</>;
    const Trigger = ({children}: {children: React.ReactNode}) => <>{children}</>;
    const Content = ({children}: {children: React.ReactNode}) => <>{children}</>;
    const Header = ({children}: {children: React.ReactNode}) => <>{children}</>;
    const Body = ({children}: {children: React.ReactNode}) => <>{children}</>;
    const Footer = ({children}: {children: React.ReactNode}) => <>{children}</>;

    const Modal = Object.assign(ModalRoot, {Trigger, Content, Header, Body, Footer});

    return {
        Modal,
        Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
        Spinner: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
        Stack: ({children}: {children: React.ReactNode}) => <div>{children}</div>,
        Typography: ({children}: {children: React.ReactNode}) => <span>{children}</span>,
    };
});

describe("ChooseDeliveryDate", () => {
    beforeEach(() => {
        useChooseDeliveryDateMock.mockReset();
        formatDeliveryTriggerLabelMock.mockClear();
        useChooseDeliveryDateMock.mockReturnValue({
            data: {
                isAuthenticated: true,
                isOpen: false,
                availableDates: [],
                selectedDate: null,
                selectedDateSlots: [],
                selectedTime: null,
                savedSelection: null,
                canApply: false,
            },
            status: {
                isLoading: false,
                isError: false,
                isSaving: false,
                isUserHaveDefaultAddress: true,
            },
            actions: {
                openModal: vi.fn(),
                closeModal: vi.fn(),
                selectDate: vi.fn(),
                selectTime: vi.fn(),
                cancelSelection: vi.fn(),
                applySelection: vi.fn(),
                navigateToLogin: vi.fn(),
                refetchSlots: vi.fn(),
            },
        });
    });

    test("renders without crash when loading state is active", () => {
        useChooseDeliveryDateMock.mockReturnValueOnce({
            data: {
                isAuthenticated: true,
                isOpen: false,
                availableDates: [],
                selectedDate: null,
                selectedDateSlots: [],
                selectedTime: null,
                savedSelection: null,
                canApply: false,
            },
            status: {
                isLoading: true,
                isError: false,
                isSaving: false,
                isUserHaveDefaultAddress: true,
            },
            actions: {
                openModal: vi.fn(),
                closeModal: vi.fn(),
                selectDate: vi.fn(),
                selectTime: vi.fn(),
                cancelSelection: vi.fn(),
                applySelection: vi.fn(),
                navigateToLogin: vi.fn(),
                refetchSlots: vi.fn(),
            },
        });

        expect(() => render(<ChooseDeliveryDate />)).not.toThrow();
    });
});

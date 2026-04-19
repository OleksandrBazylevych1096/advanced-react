import type {Meta, StoryObj} from "@storybook/react-vite";

import {applyCouponReducer} from "@/features/apply-coupon";
import {applyCouponHandlers} from "@/features/apply-coupon/testing";

import {mockAuthSession} from "@/entities/user/testing";

import {createHandlersScenario} from "@/shared/lib/testing";

import {Coupon} from "./Coupon";

const handlersMap = {
    validateCoupon: applyCouponHandlers.validateCoupon,
};

const baseInitialState: Partial<StateSchema> = {
    user: {
        currency: "USD",
        userData: mockAuthSession.user,
        accessToken: mockAuthSession.accessToken,
        accessTokenExpiresAt: mockAuthSession.accessTokenExpiresAt,
        isSessionReady: true,
    },
    applyCoupon: {
        code: "",
        draftCode: "",
        message: null,
        isModalOpen: false,
        isApplying: false,
    },
};

const meta = {
    title: "features/apply-coupon/Coupon",
    component: Coupon,
    parameters: {
        initialState: baseInitialState,
        asyncReducers: {
            applyCoupon: applyCouponReducer,
        },
    },
    decorators: [
        (Story) => (
            <div style={{width: "360px", background: "#fff", padding: "16px"}}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Coupon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: createHandlersScenario("default", handlersMap),
        },
    },
};

export const WithAppliedCode: Story = {
    parameters: {
        initialState: {
            ...baseInitialState,
            applyCoupon: {
                ...baseInitialState.applyCoupon,
                code: "SAVE20",
                draftCode: "SAVE20",
            },
        } as Partial<StateSchema>,
    },
};

export const ValidationError: Story = {
    parameters: {
        initialState: {
            ...baseInitialState,
            applyCoupon: {
                ...baseInitialState.applyCoupon,
                isModalOpen: true,
                draftCode: "BAD",
                message: "Invalid coupon code.",
            },
        } as Partial<StateSchema>,
        msw: {
            handlers: createHandlersScenario("default", handlersMap, {
                validateCoupon: applyCouponHandlers.validateCoupon.invalid,
            }),
        },
    },
};

export const Guest: Story = {
    parameters: {
        initialState: {
            ...baseInitialState,
            user: {
                currency: "USD",
                userData: undefined,
            },
        } as Partial<StateSchema>,
    },
};

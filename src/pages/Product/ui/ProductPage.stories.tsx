import type {Meta, StoryObj} from "@storybook/react-vite";

import {productPageHandlers} from "@/pages/Product/api/test/handlers";
import {mockProductPageProduct} from "@/pages/Product/api/test/mockData";

import {bestSellingProductsHandlers} from "@/widgets/BestSellingProducts/api/test/handlers";

import {categoryBreadcrumbsHandlers} from "@/entities/category/api/test/handlers";

import {AppRoutes, routePaths} from "@/shared/config";

import ProductPage from "./ProductPage";

const meta = {
    title: "pages/ProductPage",
    component: ProductPage,
    parameters: {
        route: `/en/product/${mockProductPageProduct.slug}`,
        routePath: routePaths[AppRoutes.PRODUCT],
        initialState: {
            user: {
                currency: "USD",
                userData: undefined,
            },
            cart: {
                guestItems: [],
                isInitialized: true,
            },
        } as Partial<StateSchema>,
    },
} satisfies Meta<typeof ProductPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.default,
                categoryBreadcrumbsHandlers.default,
                productPageHandlers.productBySlug.default,
            ],
        },
    },
};

export const Error: Story = {
    parameters: {
        msw: {
            handlers: [
                bestSellingProductsHandlers.default,
                categoryBreadcrumbsHandlers.default,
                productPageHandlers.productBySlug.error,
            ],
        },
    },
};

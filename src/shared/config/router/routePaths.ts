export const AppRoutes = {
    HOME: "home",
    LOGIN: "login",
    REGISTER: "register",
    AUTH_CALLBACK: "auth_callback",
    AUTH_2FA: "auth_2fa",
    FORGOT_PASSWORD: "forgot_password",
    RESET_PASSWORD: "reset_password",
    VERIFY_EMAIL_SUCCESS: "verify_email_success",
    VERIFY_EMAIL_ERROR: "verify_email_error",
    SESSIONS: "sessions",
    CATEGORY: "category",
    PRODUCT: "product",
    CART: "cart",
    CHECKOUT: "checkout",
    CHECKOUT_RESULT: "checkout_result",
    NOT_FOUND: "not_found",
} as const;

type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export const routePaths: Record<AppRoutes, string> = {
    [AppRoutes.HOME]: "/:lng",
    [AppRoutes.LOGIN]: "/:lng/login",
    [AppRoutes.REGISTER]: "/:lng/register",
    [AppRoutes.AUTH_CALLBACK]: "/:lng/oauth",
    [AppRoutes.AUTH_2FA]: "/:lng/two-factor",
    [AppRoutes.FORGOT_PASSWORD]: "/:lng/forgot-password",
    [AppRoutes.RESET_PASSWORD]: "/:lng/reset-password",
    [AppRoutes.VERIFY_EMAIL_SUCCESS]: "/:lng/verify-email-success",
    [AppRoutes.VERIFY_EMAIL_ERROR]: "/:lng/verify-email-error",
    [AppRoutes.SESSIONS]: "/:lng/sessions",
    [AppRoutes.CATEGORY]: "/:lng/category/:slug",
    [AppRoutes.PRODUCT]: "/:lng/product/:slug",
    [AppRoutes.CART]: "/:lng/cart",
    [AppRoutes.CHECKOUT]: "/:lng/checkout",
    [AppRoutes.CHECKOUT_RESULT]: "/:lng/checkout/result",

    // last
    [AppRoutes.NOT_FOUND]: "*",
};

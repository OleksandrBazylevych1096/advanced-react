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
    NOT_FOUND: "not_found",
} as const;

type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export const routePaths: Record<AppRoutes, string> = {
    [AppRoutes.HOME]: "/",
    [AppRoutes.LOGIN]: "/login",
    [AppRoutes.REGISTER]: "/register",
    [AppRoutes.AUTH_CALLBACK]: "/oauth",
    [AppRoutes.AUTH_2FA]: "/two-factor",
    [AppRoutes.FORGOT_PASSWORD]: "/forgot-password",
    [AppRoutes.RESET_PASSWORD]: "/reset-password",
    [AppRoutes.VERIFY_EMAIL_SUCCESS]: "/verify-email-success",
    [AppRoutes.VERIFY_EMAIL_ERROR]: "/verify-email-error",
    [AppRoutes.SESSIONS]: "/sessions",
    [AppRoutes.CATEGORY]: "/:lng/category/:slug",
    [AppRoutes.PRODUCT]: "/:lng/product/:slug",
    [AppRoutes.CART]: "/cart",

    // last
    [AppRoutes.NOT_FOUND]: "*",
};

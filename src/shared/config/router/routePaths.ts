export const AppRoutes = {
    HOME: "home",
    LOGIN: "login",
    REGISTER: "register",
    AUTH_CALLBACK: "auth_callback",
    CATEGORY: 'category',
    NOT_FOUND: "not_found",
} as const;

type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export const routePaths: Record<AppRoutes, string> = {
    [AppRoutes.HOME]: "/",
    [AppRoutes.LOGIN]: "/login",
    [AppRoutes.REGISTER]: "/register",
    [AppRoutes.AUTH_CALLBACK]: "/oauth",
    [AppRoutes.CATEGORY]: '/category/:slug',

    // last
    [AppRoutes.NOT_FOUND]: "*",
};

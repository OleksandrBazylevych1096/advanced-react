export const AppRoutes = {
  HOME: "home",
  LOGIN: "login",
  register: "register",
  AUTH_CALLBACK: "auth_callback",
  NOT_FOUND: "not_found",
} as const;

type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export const routePaths: Record<AppRoutes, string> = {
  [AppRoutes.HOME]: "/",
  [AppRoutes.LOGIN]: "/login",
  [AppRoutes.register]: "/register",
  [AppRoutes.AUTH_CALLBACK]: "/oauth",

  // last
  [AppRoutes.NOT_FOUND]: "*",
};

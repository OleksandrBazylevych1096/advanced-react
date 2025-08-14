export const AuthProviders = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
} as const;

export type AuthProvidersType =
  (typeof AuthProviders)[keyof typeof AuthProviders];

export const AuthMethod = {
  EMAIL: "email",
  PHONE: "phone",
};
export type AuthMethodType = (typeof AuthMethod)[keyof typeof AuthMethod];

export const LOCAL_STORAGE_USER_KEY = "user";

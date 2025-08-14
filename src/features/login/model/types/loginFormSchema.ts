import type { AuthMethodType } from "@/shared/config";

export interface LoginFormSchema {
  email?: string;
  phone?: string;
  password: string;
  isLoading: boolean;
  error?: string;
  method: AuthMethodType;
}

import type { AuthMethodType } from "@/shared/config";

export interface RegisterFormSchema {
  email?: string;
  phone?: string;
  password: string;
  isLoading: boolean;
  error?: string;
  step: FormStepsType;
  method: AuthMethodType;
}

export const FormSteps = {
  CREDENTIALS: 1,
  PASSWORD: 2,
  VERIFICATION: 3,
} as const;

export type FormStepsType = (typeof FormSteps)[keyof typeof FormSteps];

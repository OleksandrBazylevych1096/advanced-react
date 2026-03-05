export const FormSteps = {
    CREDENTIALS: 1,
    PASSWORD: 2,
    VERIFICATION: 3,
} as const;

export type FormStepsType = (typeof FormSteps)[keyof typeof FormSteps];

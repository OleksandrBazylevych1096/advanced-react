import {createContext, useContext} from "react";
import type {UseFormReturn} from "react-hook-form";

import type {FormStepsType} from "../config/formSteps";

import type {RegisterFlowValues} from "./registerFormValidationSchema";

export interface RegisterFlowContextValue {
    form: UseFormReturn<RegisterFlowValues>;
    step: FormStepsType;
    verificationRequired: "email" | "phone" | null | undefined;
    error: string | undefined;
    setError: (error: string | undefined) => void;
    setVerificationRequired: (value: "email" | "phone" | null | undefined) => void;
    goToStep: (step: FormStepsType) => void;
    goToPreviousStep: () => void;
    resetFlow: () => void;
}

export const RegisterFlowContext = createContext<RegisterFlowContextValue | null>(null);

export const useRegisterFlow = (): RegisterFlowContextValue => {
    const context = useContext(RegisterFlowContext);
    if (!context) {
        throw new Error("useRegisterFlow must be used within RegisterFlowProvider");
    }

    return context;
};

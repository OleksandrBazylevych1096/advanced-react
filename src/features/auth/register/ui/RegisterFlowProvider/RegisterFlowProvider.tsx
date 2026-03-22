import {zodResolver} from "@hookform/resolvers/zod";
import {useState, type ReactNode} from "react";
import {useForm} from "react-hook-form";

import {AuthMethod} from "@/shared/config";

import {FormSteps, type FormStepsType} from "../../config/formSteps";
import {RegisterFlowContext} from "../../model/registerFlowContext";
import {
    registerFormValidationSchema,
    type RegisterFlowValues,
} from "../../model/registerFormValidationSchema";

interface RegisterFlowProviderProps {
    children: ReactNode;
}

export const RegisterFlowProvider = ({children}: RegisterFlowProviderProps) => {
    const [step, setStep] = useState<FormStepsType>(FormSteps.CREDENTIALS);
    const [verificationRequired, setVerificationRequired] = useState<
        "email" | "phone" | null | undefined
    >(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    const form = useForm<RegisterFlowValues>({
        resolver: zodResolver(registerFormValidationSchema),
        defaultValues: {
            method: AuthMethod.EMAIL,
            email: "",
            phone: "",
            password: "",
            code: "",
        },
    });

    const goToStep = (nextStep: FormStepsType) => {
        setError(undefined);
        setStep(nextStep);
    };

    const goToPreviousStep = () => {
        setError(undefined);
        setStep((currentStep) => {
            if (currentStep === FormSteps.VERIFICATION) {
                return FormSteps.PASSWORD;
            }
            if (currentStep === FormSteps.PASSWORD) {
                return FormSteps.CREDENTIALS;
            }
            return FormSteps.CREDENTIALS;
        });
    };

    const resetFlow = () => {
        setError(undefined);
        setVerificationRequired(undefined);
        form.reset({
            method: AuthMethod.EMAIL,
            email: "",
            phone: "",
            password: "",
            code: "",
        });
        setStep(FormSteps.CREDENTIALS);
    };

    const value = {
        form,
        step,
        verificationRequired,
        error,
        setError,
        setVerificationRequired,
        goToStep,
        goToPreviousStep,
        resetFlow,
    };

    return <RegisterFlowContext value={value}>{children}</RegisterFlowContext>;
};

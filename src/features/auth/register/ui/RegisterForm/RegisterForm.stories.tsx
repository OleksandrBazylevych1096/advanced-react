import type {Meta, StoryObj} from "@storybook/react-vite";
import {useEffect} from "react";

import {AuthMethod} from "@/shared/config";

import {FormSteps, type FormStepsType} from "../../config/formSteps";
import {useRegisterFlow} from "../../state/registerFlowContext";
import {RegisterFlowProvider} from "../RegisterFlowProvider/RegisterFlowProvider.tsx";

import {RegisterForm} from "./RegisterForm.tsx";

interface RegisterFormStoryParams {
    step: FormStepsType;
}

const RegisterStepInitializer = ({step}: RegisterFormStoryParams) => {
    const {goToStep, form, setVerificationRequired} = useRegisterFlow();

    useEffect(() => {
        goToStep(step);

        if (step === FormSteps.VERIFICATION) {
            form.setValue("method", AuthMethod.EMAIL);
            form.setValue("email", "user@example.com");
            setVerificationRequired("email");
            return;
        }

        setVerificationRequired(undefined);
    }, [form, goToStep, setVerificationRequired, step]);

    return null;
};

const meta = {
    title: "features/register/RegisterForm",
    component: RegisterForm,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story, context) => (
            <div style={{width: "460px", background: "#fff", padding: "20px"}}>
                <RegisterFlowProvider>
                    <RegisterStepInitializer
                        step={
                            (context.parameters as RegisterFormStoryParams | undefined)?.step ??
                            FormSteps.CREDENTIALS
                        }
                    />
                    <Story />
                </RegisterFlowProvider>
            </div>
        ),
    ],
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CredentialsStep: Story = {
    parameters: {
        step: FormSteps.CREDENTIALS,
    },
};

export const PasswordStep: Story = {
    parameters: {
        step: FormSteps.PASSWORD,
    },
};

export const VerificationStep: Story = {
    parameters: {
        step: FormSteps.VERIFICATION,
    },
};


import {FormSteps} from "../../config/formSteps";
import {useRegisterFlow} from "../../model/registerFlowContext";

import {CreatePasswordStep} from "./steps/CreatePasswordStep/CreatePasswordStep";
import {CredentialsStep} from "./steps/CredentialsStep/CredentialStep";
import {VerificationStep} from "./steps/VerificationStep/VerificationStep";

export const RegisterForm = () => {
    const {step} = useRegisterFlow();

    return (
        <>
            {step === FormSteps.CREDENTIALS && <CredentialsStep />}
            {step === FormSteps.PASSWORD && <CreatePasswordStep />}
            {step === FormSteps.VERIFICATION && <VerificationStep />}
        </>
    );
};

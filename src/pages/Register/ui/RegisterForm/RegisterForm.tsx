import {FormSteps} from "../../config/formSteps";
import {useRegisterFlow} from "../../model/registerFlowContext";
import {CreatePasswordStep} from "../CreatePasswordStep/CreatePasswordStep";
import {CredentialsStep} from "../CredentialsStep/CredentialStep";
import {VerificationStep} from "../VerificationStep/VerificationStep";

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

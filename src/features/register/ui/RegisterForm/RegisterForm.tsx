import { useAppSelector } from "@/shared/lib";

import { selectRegisterStep } from "../../model/selectors/selectRegisterStep/selectRegisterStep";
import { FormSteps } from "../../model/types/registerForm";

import { CreatePasswordStep } from "./steps/CreatePasswordStep/CreatePasswordStep";
import { CredentialsStep } from "./steps/CredentialsStep/CredentialStep";
import { VerificationStep } from "./steps/VerificationStep/VerificationStep";

export const RegisterForm = () => {
  const step = useAppSelector(selectRegisterStep);
  return (
    <>
      {step === FormSteps.CREDENTIALS && <CredentialsStep />}
      {step === FormSteps.PASSWORD && <CreatePasswordStep />}
      {step === FormSteps.VERIFICATION && <VerificationStep />}
    </>
  );
};

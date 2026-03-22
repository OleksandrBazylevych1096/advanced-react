import {type FormStepsType, FormSteps} from "./config/formSteps";
import {useRegisterFlow} from "./model/registerFlowContext";
import {RegisterFlowProvider} from "./ui/RegisterFlowProvider/RegisterFlowProvider";
import {RegisterForm} from "./ui/RegisterForm/RegisterForm";

export type {FormStepsType};

export {RegisterForm, FormSteps, RegisterFlowProvider, useRegisterFlow};

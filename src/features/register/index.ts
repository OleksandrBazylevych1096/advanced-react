import { selectRegisterStep } from "./model/selectors/selectRegisterStep/selectRegisterStep";
import { registerActions, registerReducer } from "./model/slice/registerSlice";
import {
  type RegisterFormSchema,
  type FormStepsType,
  FormSteps,
} from "./model/types/registerForm";
import { RegisterForm } from "./ui/RegisterForm/RegisterForm";

export type { RegisterFormSchema, FormStepsType };

export {
  registerReducer,
  registerActions,
  RegisterForm,
  FormSteps,
  selectRegisterStep,
};

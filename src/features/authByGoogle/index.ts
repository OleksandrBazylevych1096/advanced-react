import { selectAuthByGoogleError } from "./model/selectors/selectAuthByGoogleError/selectAuthByGoogleError";
import { selectAuthByGoogleIsLoading } from "./model/selectors/selectAuthByGoogleIsLoading/selectAuthByGoogleIsLoading";
import { authByGoogleReducer } from "./model/slice/authByGoogleSlice";
import type { AuthByGoogleSchema } from "./model/types/authByGoogle";
import { AuthByGoogleButton } from "./ui/AuthByGoogleButton/AuthByGoogleButton";

export type { AuthByGoogleSchema };
export {
  authByGoogleReducer,
  AuthByGoogleButton,
  selectAuthByGoogleError,
  selectAuthByGoogleIsLoading,
};

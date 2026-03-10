import {selectAccessToken} from "../selectAccessToken/selectAccessToken";
import {selectUserData} from "../selectUserData/selectUserData";

export const selectIsAuthenticated = (state: StateSchema) =>
    Boolean(selectUserData(state) && selectAccessToken(state));

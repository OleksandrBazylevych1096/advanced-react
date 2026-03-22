import {
    useGetAuthSessionsQuery,
    useRevokeAllAuthSessionsMutation,
    useRevokeAuthSessionMutation,
} from "./api/authSessionsApi/authSessionsApi";
import {useRefreshSessionMutation} from "./api/sessionApi/sessionApi";
import {selectAccessToken} from "./state/selectors/selectAccessToken/selectAccessToken";
import {selectIsAuthenticated} from "./state/selectors/selectIsAuthenticated/selectIsAuthenticated";
import {selectPendingMfaChallenge} from "./state/selectors/selectPendingMfaChallenge/selectPendingMfaChallenge";
import {selectUserCurrency} from "./state/selectors/selectUserCurrency/selectUserCurrency";
import {selectUserData} from "./state/selectors/selectUserData/selectUserData";
import {
    applyAuthSession,
    applyUserSession,
} from "./state/services/applyUserSession/applyUserSession";
import {clearUserSession} from "./state/services/clearUserSession/clearUserSession";
import {userActions, userReducer} from "./state/slice/userSlice";
import type {
    AuthSessionResponse,
    AuthSessionsListItem,
    MfaChallengeResponse,
    MfaMethod,
    PendingMfaChallenge,
} from "./state/types/AuthSession";
import {isAuthSessionResponse, isMfaChallengeResponse} from "./state/types/AuthSession";
import type {User, UserSchema} from "./state/types/UserSchema";

export {
    userActions,
    userReducer,
    applyAuthSession,
    applyUserSession,
    clearUserSession,
    selectAccessToken,
    selectIsAuthenticated,
    selectPendingMfaChallenge,
    selectUserData,
    selectUserCurrency,
    useRefreshSessionMutation,
    useGetAuthSessionsQuery,
    useRevokeAuthSessionMutation,
    useRevokeAllAuthSessionsMutation,
    isAuthSessionResponse,
    isMfaChallengeResponse,
};
export type {
    User,
    UserSchema,
    AuthSessionResponse,
    MfaChallengeResponse,
    MfaMethod,
    PendingMfaChallenge,
    AuthSessionsListItem,
};


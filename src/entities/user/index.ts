import {
    useGetAuthSessionsQuery,
    useRevokeAllAuthSessionsMutation,
    useRevokeAuthSessionMutation,
} from "./api/authSessionsApi";
import {useRefreshSessionMutation} from "./api/sessionApi";
import {selectAccessToken} from "./model/selectors/selectAccessToken/selectAccessToken";
import {selectPendingMfaChallenge} from "./model/selectors/selectPendingMfaChallenge/selectPendingMfaChallenge";
import {selectUserCurrency} from "./model/selectors/selectUserCurrency/selectUserCurrency";
import {selectUserData} from "./model/selectors/selectUserData/selectUserData";
import {
    applyAuthSession,
    applyUserSession,
} from "./model/services/applyUserSession/applyUserSession";
import {clearUserSession} from "./model/services/clearUserSession/clearUserSession";
import {userActions, userReducer} from "./model/slice/userSlice";
import type {
    AuthSessionResponse,
    AuthSessionsListItem,
    MfaChallengeResponse,
    MfaMethod,
    PendingMfaChallenge,
} from "./model/types/AuthSession";
import {isAuthSessionResponse, isMfaChallengeResponse} from "./model/types/AuthSession";
import type {User, UserSchema} from "./model/types/UserSchema";

export {
    userActions,
    userReducer,
    applyAuthSession,
    applyUserSession,
    clearUserSession,
    selectAccessToken,
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

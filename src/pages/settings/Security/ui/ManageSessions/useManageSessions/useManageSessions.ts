import {useState} from "react";
import {useNavigate} from "react-router";

import {
    clearUserSession,
    useGetAuthSessionsQuery,
    useRevokeAllAuthSessionsMutation,
    useRevokeAuthSessionMutation,
} from "@/entities/user";

import {AppRoutes, routePaths} from "@/shared/config";
import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useLocalizedRoutePath} from "@/shared/lib/routing";
import {useAppDispatch} from "@/shared/lib/state";

export const useManageSessions = () => {
    const navigate = useNavigate();
    const getLocalizedPath = useLocalizedRoutePath();
    const dispatch = useAppDispatch();
    const [actionError, setActionError] = useState<string | undefined>(undefined);

    const sessionsQuery = useGetAuthSessionsQuery();
    const [revokeSession, revokeSessionState] = useRevokeAuthSessionMutation();
    const [revokeAllSessions, revokeAllSessionsState] = useRevokeAllAuthSessionsMutation();

    const sessions = sessionsQuery.data ?? [];

    const revokeOne = async (sessionId: string, isCurrent?: boolean) => {
        setActionError(undefined);
        try {
            await revokeSession(sessionId).unwrap();
            if (isCurrent) {
                clearUserSession(dispatch);
                navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
            }
        } catch (requestError) {
            setActionError(extractApiErrorMessage(requestError));
        }
    };

    const revokeAll = async (includeCurrent: boolean) => {
        setActionError(undefined);
        try {
            await revokeAllSessions({includeCurrent}).unwrap();
            if (includeCurrent) {
                clearUserSession(dispatch);
                navigate(getLocalizedPath(routePaths[AppRoutes.LOGIN]));
            }
        } catch (requestError) {
            setActionError(extractApiErrorMessage(requestError));
        }
    };

    return {
        data: {sessions},
        status: {
            isLoading:
                sessionsQuery.isLoading ||
                revokeSessionState.isLoading ||
                revokeAllSessionsState.isLoading,
            error:
                actionError ??
                (sessionsQuery.error ? extractApiErrorMessage(sessionsQuery.error) : undefined),
            isFetching: sessionsQuery.isFetching,
        },
        actions: {
            retry: sessionsQuery.refetch,
            revokeOne,
            revokeAll,
        },
    };
};

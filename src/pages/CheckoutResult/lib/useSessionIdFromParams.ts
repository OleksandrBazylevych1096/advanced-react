import {useMemo} from "react";
import {useLocation} from "react-router";

export const useSessionIdFromParams = (): string | null => {
    const location = useLocation();

    return useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get("sessionId") ?? query.get("checkout_session_id");
    }, [location.search]);
};

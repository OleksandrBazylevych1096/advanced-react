import {useState} from "react";

import {extractApiErrorMessage} from "@/shared/lib/errors";

import {useUnlinkGoogleMutation} from "../../../api/unlinkGoogleApi.ts";

export const useUnlinkGoogle = () => {
    const [error, setError] = useState<string | undefined>(undefined);
    const [unlinkGoogle, unlinkGoogleState] = useUnlinkGoogleMutation();

    const unlink = async () => {
        setError(undefined);
        try {
            await unlinkGoogle().unwrap();
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return {
        status: {
            isLoading: unlinkGoogleState.isLoading,
            isSuccess: unlinkGoogleState.isSuccess,
            error,
        },
        actions: {unlink},
    };
};

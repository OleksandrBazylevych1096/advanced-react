import {useState} from "react";

import {extractApiErrorMessage} from "@/shared/api";
import {createControllerResult} from "@/shared/lib";

import {useUnlinkGoogleMutation} from "../../api/unlinkGoogleApi";

export const useUnlinkGoogleController = () => {
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

    return createControllerResult({
        status: {
            isLoading: unlinkGoogleState.isLoading,
            isSuccess: unlinkGoogleState.isSuccess,
            error,
        },
        actions: {unlink},
    });
};

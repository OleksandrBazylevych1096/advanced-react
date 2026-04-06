import {useEffect, useState} from "react";

import {selectUserData, userActions} from "@/entities/user";

import {extractApiErrorMessage} from "@/shared/lib/errors";
import {useAppDispatch, useAppSelector} from "@/shared/lib/state";

import {
    useSettingsEnableTwoFactorMutation,
    useSettingsSetupTwoFactorMutation,
} from "../../../api/setupTwoFactorApi.ts";

type SetupData = {
    qrCodeDataUrl: string;
    backupCodes: string[];
};

export const useSetupTwoFactor = () => {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);

    const [setupData, setSetupData] = useState<SetupData | undefined>(undefined);
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState(Boolean(userData?.isTwoFactorEnabled));

    const [setupTwoFactor, setupTwoFactorState] = useSettingsSetupTwoFactorMutation();
    const [enableTwoFactor, enableTwoFactorState] = useSettingsEnableTwoFactorMutation();

    useEffect(() => {
        setIsEnabled(Boolean(userData?.isTwoFactorEnabled));
    }, [userData?.isTwoFactorEnabled]);

    const startSetup = async () => {
        setError(undefined);
        setCode("");
        try {
            const result = await setupTwoFactor().unwrap();
            setSetupData(result);
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    const changeCode = (value: string) => {
        setCode(value.replace(/[^0-9]/g, "").slice(0, 6));
        setError(undefined);
    };

    const enable = async () => {
        setError(undefined);
        if (!/^\d{6}$/.test(code)) return;

        try {
            await enableTwoFactor({code}).unwrap();
            setIsEnabled(true);
            if (userData) {
                dispatch(
                    userActions.setUserData({
                        ...userData,
                        isTwoFactorEnabled: true,
                    }),
                );
            }
        } catch (requestError) {
            setError(extractApiErrorMessage(requestError));
        }
    };

    return {
        data: {
            isEnabled,
            setupData,
            code,
        },
        status: {
            error,
            isLoading: setupTwoFactorState.isLoading || enableTwoFactorState.isLoading,
        },
        actions: {
            startSetup,
            changeCode,
            enable,
        },
    };
};

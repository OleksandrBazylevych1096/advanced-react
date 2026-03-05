import {useEffect, useState} from "react";

import {selectUserData, userActions} from "@/entities/user";

import {extractApiErrorMessage} from "@/shared/api";
import {createControllerResult, useAppDispatch, useAppSelector} from "@/shared/lib";

import {useEnableTwoFactorMutation, useSetupTwoFactorMutation} from "../../api/setupTwoFactorApi";

type SetupData = {
    qrCodeDataUrl: string;
    backupCodes: string[];
};

export const useSetupTwoFactorController = () => {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);

    const [setupData, setSetupData] = useState<SetupData | undefined>(undefined);
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | undefined>(undefined);
    const [isEnabled, setIsEnabled] = useState(Boolean(userData?.isTwoFactorEnabled));

    const [setupTwoFactor, setupTwoFactorState] = useSetupTwoFactorMutation();
    const [enableTwoFactor, enableTwoFactorState] = useEnableTwoFactorMutation();

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

    return createControllerResult({
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
    });
};

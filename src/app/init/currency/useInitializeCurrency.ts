import {useEffect} from "react";

import {userActions} from "@/entities/user";

import {languageCurrencyList, type SupportedLngsType} from "@/shared/config";
import i18n from "@/shared/config/i18n/i18n";
import {useAppDispatch} from "@/shared/lib";

export const useInitializeCurrency = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handler = (lng: string) => {
            dispatch(userActions.setCurrency(languageCurrencyList[lng as SupportedLngsType]));
        };

        i18n.on("languageChanged", handler);

        handler(i18n.language);

        return () => {
            i18n.off("languageChanged", handler);
        };
    }, [dispatch]);
};

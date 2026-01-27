import {Suspense, useEffect} from "react";

import {refreshSession, userActions} from "@/entities/user";

import {setAuthFailureHandler} from "@/shared/api";
import {languageCurrencyList, type SupportedLngsType} from "@/shared/config";
import i18n from "@/shared/config/i18n/i18n";
import {useAppDispatch} from "@/shared/lib";

import {AppRouter} from "./providers";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userActions.initUserData());
        dispatch(refreshSession());
        setAuthFailureHandler(() => {
            dispatch(userActions.clearUserData());
        });
        dispatch(
            userActions.setCurrency(
                languageCurrencyList[i18n.language as SupportedLngsType]
            )
        );
    }, [dispatch]);

    useEffect(() => {
        const handler = (lng: string) => {
            dispatch(
                userActions.setCurrency(
                    languageCurrencyList[lng as SupportedLngsType]
                )
            );
        };

        i18n.on("languageChanged", handler);

        return () => {
            i18n.off("languageChanged", handler);
        };
    }, [dispatch]);


    return (
        <Suspense fallback={<></>}>
            <AppRouter/>
        </Suspense>
    );
}

export default App;

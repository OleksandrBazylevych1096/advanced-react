import type {ReactNode} from "react";
import {useParams} from "react-router";

import type {SupportedLngsType} from "@/shared/config";
import {useLanguageSync} from "@/shared/lib/routing";

export const LanguageSyncWrapper = ({
    children,
    hasLocalizedParams = false,
}: {
    children: ReactNode;
    hasLocalizedParams?: boolean;
}) => {
    const {lng} = useParams<{lng?: SupportedLngsType}>();
    useLanguageSync({languageParam: lng, hasLocalizedParams});

    return <>{children}</>;
};

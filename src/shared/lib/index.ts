import {useIntersectionObserver} from "@/shared/lib/browser/intersectionObserver/useIntersectionObserver.ts";
import {isAbortError} from "@/shared/lib/errors/isAbortError";
import {getFallbackLanguage} from "@/shared/lib/i18n/getFallbackLanguage.ts";
import {isSupportedLanguage} from "@/shared/lib/i18n/isSupportedLanguage.ts";
import {clampOptionalRange, clampRange, clampValue} from "@/shared/lib/math/range/clampRange.ts";
import {useLocalizedRoutePath} from "@/shared/lib/routing/localizedPath/useLocalizedRoutePath.ts";
import {
    useLanguageSync,
    useLocalizedSlugSync,
} from "@/shared/lib/routing/localizedSlug/useSlugSync.ts";
import {createControllerResult} from "@/shared/lib/state/controllerResult";
import {createVersionGuard} from "@/shared/lib/state/optimisticTransaction/createVersionGuard/createVersionGuard.ts";
import {runOptimisticTxn} from "@/shared/lib/state/optimisticTransaction/runOptimisticTxn/runOptimisticTxn.ts";

import {formatCurrency} from "./formatting/currency/formatCurrency";
import {formatCompactNumber} from "./formatting/number/formatCompactNumber";
import {useToast} from "./notifications/toast/useToast";
import {DynamicModuleLoader} from "./state/dynamicReducers/DynamicModuleLoader";
import {useAppDispatch, useAppSelector, useAppStore} from "./state/redux/hooks";
import {classNames as cn} from "./styling/classNames/classNames";
import {
    passwordRequirements,
    getPasswordRequirementsState,
    isPasswordValid,
} from "./validation/passwordRequirements";

export {
    cn,
    useAppDispatch,
    useAppSelector,
    useAppStore,
    DynamicModuleLoader,
    formatCompactNumber,
    useToast,
    useIntersectionObserver,
    formatCurrency,
    clampOptionalRange,
    clampRange,
    clampValue,
    createVersionGuard,
    runOptimisticTxn,
    isAbortError,
    getFallbackLanguage,
    isSupportedLanguage,
    useLocalizedRoutePath,
    createControllerResult,
    useLanguageSync,
    useLocalizedSlugSync,
    passwordRequirements,
    getPasswordRequirementsState,
    isPasswordValid,
};
export type {DeepPartial} from "./state/redux/types";
export type {ControllerResult} from "./state/controllerResult";


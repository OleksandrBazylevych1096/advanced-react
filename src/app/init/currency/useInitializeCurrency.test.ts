import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useInitializeCurrency} from "./useInitializeCurrency";

const testCtx = vi.hoisted(() => {
    const listeners = new Set<(lng: string) => void>();

    const i18nMock = {
        language: "de",
        resolvedLanguage: "de",
        options: {fallbackLng: "en"},
        on: vi.fn((event: string, cb: (lng: string) => void) => {
            if (event === "languageChanged") {
                listeners.add(cb);
            }
        }),
        off: vi.fn((event: string, cb: (lng: string) => void) => {
            if (event === "languageChanged") {
                listeners.delete(cb);
            }
        }),
    };

    return {
        dispatchMock: vi.fn(),
        listeners,
        i18nMock,
        emitLanguageChanged: (lng: string) => {
            listeners.forEach((cb) => cb(lng));
        },
    };
});

vi.mock("@/entities/user", () => ({
    userActions: {
        setCurrency: (payload: string) => ({type: "user/setCurrency", payload}),
    },
}));

vi.mock("@/shared/lib/state", () => ({
    useAppDispatch: () => testCtx.dispatchMock,
}));

vi.mock("@/shared/config", () => ({
    supportedLngs: ["en", "de"],
    languageCurrencyList: {
        en: "USD",
        de: "EUR",
    },
    default: testCtx.i18nMock,
}));

vi.mock("@/shared/lib/i18n", () => ({
    isSupportedLanguage: (language?: string) => language === "en" || language === "de",
    getFallbackLanguage: () => "en",
}));

describe("useInitializeCurrency", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.listeners.clear();
        testCtx.i18nMock.language = "de";
        testCtx.i18nMock.resolvedLanguage = "de";
    });

    test("syncs currency immediately from current i18n language and listens for updates", () => {
        renderHook(() => useInitializeCurrency());

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/setCurrency",
            payload: "EUR",
        });

        testCtx.emitLanguageChanged("en");

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/setCurrency",
            payload: "USD",
        });
    });

    test("falls back to EN currency for unsupported language code", () => {
        renderHook(() => useInitializeCurrency());

        testCtx.emitLanguageChanged("en-US");

        expect(testCtx.dispatchMock).toHaveBeenCalledWith({
            type: "user/setCurrency",
            payload: "USD",
        });
    });
});

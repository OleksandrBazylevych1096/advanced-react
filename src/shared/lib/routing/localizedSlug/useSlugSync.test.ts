import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";

import {
    useLanguageSync,
    useLocalizedSlugSync,
} from "./useSlugSync.ts";

const mockNavigate = vi.fn();
const mockChangeLanguage = vi.fn();
const mockI18n = {
    get language() {
        return mockLanguage;
    },
    changeLanguage: mockChangeLanguage,
};

let mockLanguage = "en";
let mockParams: Record<string, string | undefined> = {
    slug: "electronics",
};
let mockLocation = {
    pathname: "/en/category/electronics",
    search: "",
    hash: "",
};

vi.mock("react-router", () => ({
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
    useLocation: () => mockLocation,
    generatePath: (path: string, params: Record<string, string>) =>
        path.replace(":lng", params.lng).replace(":slug", params.slug),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        i18n: mockI18n,
    }),
}));

const slugMap = {
    en: "electronics",
    de: "elektronik",
} as const;

describe("useSlugSync split hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLanguage = "en";
        mockParams = {slug: "electronics"};
        mockLocation = {
            pathname: "/en/category/electronics",
            search: "",
            hash: "",
        };
    });

    it("changes i18n language from route language", () => {
        renderHook(() => useLanguageSync({languageParam: "de"}));

        expect(mockChangeLanguage).toHaveBeenCalledWith("de");
    });

    it("updates route language when i18n language changes after initial sync", () => {
        mockParams = {lng: "en"};
        mockLocation = {
            pathname: "/en",
            search: "",
            hash: "",
        };
        const {rerender} = renderHook(() => useLanguageSync({languageParam: "en"}));

        mockLanguage = "de";
        rerender();

        expect(mockNavigate).toHaveBeenCalledWith("/de", {replace: true});
    });

    it("redirects to localized slug when slug does not match current i18n language", () => {
        mockLanguage = "de";

        renderHook(() =>
            useLocalizedSlugSync({
                languageParam: "de",
                slugMap,
                enabled: true,
                routePath: "/:lng/category/:slug",
            }),
        );

        expect(mockNavigate).toHaveBeenCalledWith("/de/category/elektronik", {replace: true});
    });

    it("redirects to localized slug and language when route language and i18n language are not synced", () => {
        mockLanguage = "de";

        renderHook(() =>
            useLocalizedSlugSync({
                languageParam: "en",
                slugMap,
                enabled: true,
                routePath: "/:lng/category/:slug",
            }),
        );

        expect(mockNavigate).toHaveBeenCalledWith("/de/category/elektronik", {replace: true});
    });

    it("does not redirect when slug is outside slug map", () => {
        mockLanguage = "de";
        mockParams = {slug: "unknown-slug"};

        renderHook(() =>
            useLocalizedSlugSync({
                languageParam: "de",
                slugMap,
                enabled: true,
                routePath: "/:lng/category/:slug",
            }),
        );

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("skips redirect on the render where slug changes manually", () => {
        mockLanguage = "de";

        const {rerender} = renderHook(
            ({slug}) => {
                mockParams = {slug};
                return useLocalizedSlugSync({
                    languageParam: "de",
                    slugMap,
                    enabled: true,
                    routePath: "/:lng/category/:slug",
                });
            },
            {initialProps: {slug: "electronics"}},
        );

        mockNavigate.mockClear();
        rerender({slug: "elektronik"});

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});


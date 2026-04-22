import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useTagPage} from "./useTagPage";

const testCtx = vi.hoisted(() => ({
    params: {slug: "organic", lng: "en"},
    resolveTagIdMock: vi.fn(),
    localizedSlugSyncMock: vi.fn(),
}));

vi.mock("react-router", () => ({
    useParams: () => testCtx.params,
}));

vi.mock("@/entities/tag", () => ({
    useResolvedTagId: (...args: unknown[]) => testCtx.resolveTagIdMock(...args),
}));

vi.mock("@/shared/config", () => ({
    AppRoutes: {TAG: "tag"},
    routePaths: {
        tag: "/:lng/tag/:slug",
    },
}));

vi.mock("@/shared/lib/state", () => ({}));

vi.mock("@/shared/lib/routing", () => ({
    useLocalizedSlugSync: (...args: unknown[]) => testCtx.localizedSlugSyncMock(...args),
}));

describe("useTagPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.resolveTagIdMock.mockReturnValue({
            data: {
                tag: {id: "tag-1", name: "Organic", slugMap: {en: "organic", de: "bio"}},
                resolvedTagId: "tag-1",
            },
            status: {isLoading: false, isSuccess: true},
        });
    });

    test("loads tag by slug and syncs localized slug", () => {
        const {result} = renderHook(() => useTagPage());

        expect(testCtx.resolveTagIdMock).toHaveBeenCalledWith({
            slug: "organic",
            locale: "en",
        });
        expect(testCtx.localizedSlugSyncMock).toHaveBeenCalledWith({
            languageParam: "en",
            slugMap: {en: "organic", de: "bio"},
            enabled: true,
            routePath: "/:lng/tag/:slug",
        });
        expect(result.current.data).toEqual({
            breadcrumbs: [{label: "Organic"}],
            tagId: "tag-1",
        });
        expect(result.current.status).toEqual({
            isLoading: false,
        });
    });
});

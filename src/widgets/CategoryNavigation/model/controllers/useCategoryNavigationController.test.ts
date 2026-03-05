import {act, renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {useCategoryNavigationController} from "./useCategoryNavigationController";

const testCtx = vi.hoisted(() => ({
    queryMock: vi.fn(),
    refetchMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({i18n: {language: "uk"}}),
}));

vi.mock("react-router", () => ({
    useParams: () => ({slug: "phones", lng: "en"}),
}));

vi.mock("@/widgets/CategoryNavigation/api/categoryNavigationApi.ts", () => ({
    useGetCategoryNavigationQuery: (...args: unknown[]) => testCtx.queryMock(...args),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

describe("useCategoryNavigationController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.refetchMock = vi.fn();
        testCtx.queryMock.mockReturnValue({
            data: [{id: "c1"}],
            isLoading: false,
            isError: false,
            refetch: testCtx.refetchMock,
        });
    });

    test("prefers route language and exposes refetch", () => {
        const {result} = renderHook(() => useCategoryNavigationController());

        expect(testCtx.queryMock).toHaveBeenCalledWith(
            {slug: "phones", locale: "en"},
            {skip: false},
        );
        expect(result.current.data.data).toEqual([{id: "c1"}]);

        act(() => {
            result.current.actions.refetch();
        });

        expect(testCtx.refetchMock).toHaveBeenCalled();
    });
});

import {renderHook} from "@testing-library/react";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {usePromoCarouselController} from "./usePromoCarouselController";

const testCtx = vi.hoisted(() => ({
    queryMock: vi.fn(),
    generatePlaceholderMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({t: (key: string) => `t:${key}`}),
}));

vi.mock("@/widgets/PromoCarousel/api/promoCarouselApi.ts", () => ({
    useGetPromoBannersQuery: () => testCtx.queryMock(),
}));

vi.mock("@/widgets/PromoCarousel/lib/generatePlaceholder/generatePlaceholder.ts", () => ({
    generatePlaceholder: (...args: unknown[]) => testCtx.generatePlaceholderMock(...args),
}));

vi.mock("@/shared/lib", () => ({
    createControllerResult: <T>(value: T) => value,
}));

describe("usePromoCarouselController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        testCtx.queryMock.mockReturnValue({data: ["a.jpg"], isLoading: false});
        testCtx.generatePlaceholderMock.mockReturnValue("data:image/svg+xml;base64,xxx");
    });

    test("returns banners and generated placeholder", () => {
        const {result} = renderHook(() => usePromoCarouselController());

        expect(testCtx.generatePlaceholderMock).toHaveBeenCalledWith("t:carousel.imageError");
        expect(result.current.data.bannerUrls).toEqual(["a.jpg"]);
        expect(result.current.data.dynamicFallbackImg).toBe("data:image/svg+xml;base64,xxx");
        expect(result.current.status.isLoading).toBe(false);
    });
});

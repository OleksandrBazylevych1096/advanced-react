import {waitFor} from "@testing-library/react";
import {afterAll, beforeAll, describe, expect, test} from "vitest";

import {renderWithProviders} from "@/shared/lib/testing/react/renderWithProviders";

import {AppImage} from "./AppImage";
import styles from "./AppImage.module.scss";

describe("AppImage", () => {
    const completeDescriptor = Object.getOwnPropertyDescriptor(
        HTMLImageElement.prototype,
        "complete",
    );
    const naturalWidthDescriptor = Object.getOwnPropertyDescriptor(
        HTMLImageElement.prototype,
        "naturalWidth",
    );

    beforeAll(() => {
        Object.defineProperty(HTMLImageElement.prototype, "complete", {
            configurable: true,
            get() {
                return this.getAttribute("src") === "cached-image.jpg";
            },
        });

        Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
            configurable: true,
            get() {
                return this.getAttribute("src") === "cached-image.jpg" ? 1200 : 0;
            },
        });
    });

    afterAll(() => {
        if (completeDescriptor) {
            Object.defineProperty(HTMLImageElement.prototype, "complete", completeDescriptor);
        }

        if (naturalWidthDescriptor) {
            Object.defineProperty(
                HTMLImageElement.prototype,
                "naturalWidth",
                naturalWidthDescriptor,
            );
        }
    });

    test("reveals cached images even when load event does not fire", async () => {
        const {container} = renderWithProviders(
            <AppImage src="cached-image.jpg" alt="Cached product image" />,
        );

        const image = container.querySelector("img");

        expect(image).not.toBeNull();

        await waitFor(() => {
            expect(image).not.toHaveClass(styles.hidden);
        });
    });
});

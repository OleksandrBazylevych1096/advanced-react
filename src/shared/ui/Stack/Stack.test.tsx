import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";

import {Stack} from "./Stack";
import styles from "./Stack.module.scss";

describe("Stack", () => {
    test("applies row direction class", () => {
        render(
            <Stack data-testid="stack" direction="row">
                Content
            </Stack>,
        );
        const stack = screen.getByTestId("stack");

        expect(stack.className).toContain(styles.row);
    });

    test("applies tokenized gap style", () => {
        render(
            <Stack data-testid="stack" gap={12}>
                Content
            </Stack>,
        );
        const stack = screen.getByTestId("stack");

        const style = stack.getAttribute("style");
        expect(style).toContain("row-gap: 12px");
        expect(style).toContain("column-gap: 12px");
    });

    test("applies px fallback for non-token gap", () => {
        render(
            <Stack data-testid="stack" gap={6}>
                Content
            </Stack>,
        );
        const stack = screen.getByTestId("stack");

        expect(stack.getAttribute("style")).toContain("gap: 6px");
    });

    test("applies rowGap and columnGap when provided", () => {
        render(
            <Stack data-testid="stack" rowGap={12} columnGap={8}>
                Content
            </Stack>,
        );
        const stack = screen.getByTestId("stack");

        const style = stack.getAttribute("style");
        expect(style).toContain("row-gap: 12px");
        expect(style).toContain("column-gap: 8px");
    });
});

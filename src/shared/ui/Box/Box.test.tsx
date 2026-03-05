import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";

import {Box} from "./Box";

describe("Box", () => {
    test("applies padding shorthands and specific overrides", () => {
        render(
            <Box data-testid="box" p={16} px={20} py={12} pt={8}>
                Content
            </Box>,
        );
        const box = screen.getByTestId("box");
        const style = box.getAttribute("style");

        expect(style).toContain("padding: 8px 20px 12px 20px");
    });

    test("applies margin shorthands and specific overrides", () => {
        render(
            <Box data-testid="box" m={16} mx={20} my={12} mb={4}>
                Content
            </Box>,
        );
        const box = screen.getByTestId("box");
        const style = box.getAttribute("style");

        expect(style).toContain("margin: 12px 20px 4px 20px");
    });
});

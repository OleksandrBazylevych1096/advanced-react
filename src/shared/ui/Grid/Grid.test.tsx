import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";

import {Grid} from "./Grid";
import styles from "./Grid.module.scss";

describe("Grid", () => {
    test("applies base grid class", () => {
        render(<Grid data-testid="grid">Content</Grid>);
        const grid = screen.getByTestId("grid");

        expect(grid.className).toContain(styles.grid);
    });

    test("applies cols and gap styles", () => {
        render(
            <Grid data-testid="grid" cols={3} gap={12}>
                Content
            </Grid>,
        );
        const grid = screen.getByTestId("grid");

        expect(grid).toHaveStyle({
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        });
        expect(grid.getAttribute("style")).toContain("row-gap: 12px");
        expect(grid.getAttribute("style")).toContain("column-gap: 12px");
    });

    test("applies rowGap and columnGap when provided", () => {
        render(
            <Grid data-testid="grid" rowGap={20} columnGap={8}>
                Content
            </Grid>,
        );
        const grid = screen.getByTestId("grid");

        expect(grid.getAttribute("style")).toContain("row-gap: 20px");
        expect(grid.getAttribute("style")).toContain("column-gap: 8px");
    });
});

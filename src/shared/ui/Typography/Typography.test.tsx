import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";

import {Typography} from "./Typography";
import styles from "./Typography.module.scss";

describe("Typography", () => {
    test("renders requested semantic tag", () => {
        render(
            <Typography as="h2" data-testid="typography">
                Title
            </Typography>,
        );

        expect(screen.getByRole("heading", {level: 2})).toBeInTheDocument();
    });

    test("applies variant, tone and weight classes", () => {
        render(
            <Typography data-testid="typography" tone="muted" variant="heading" weight="bold">
                Title
            </Typography>,
        );
        const typography = screen.getByTestId("typography");

        expect(typography.className).toContain(styles.heading);
        expect(typography.className).toContain(styles.muted);
        expect(typography.className).toContain(styles.bold);
    });
});

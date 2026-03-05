import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";

import {Container} from "./Container";
import styles from "./Container.module.scss";

describe("Container", () => {
    test("applies default content size", () => {
        render(<Container data-testid="container">Content</Container>);
        const container = screen.getByTestId("container");

        expect(container.className).toContain(styles.content);
    });

    test("applies fluid size", () => {
        render(
            <Container data-testid="container" size="fluid">
                Content
            </Container>,
        );
        const container = screen.getByTestId("container");

        expect(container.className).toContain(styles.fluid);
    });
});

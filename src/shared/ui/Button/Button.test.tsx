import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";

import {Button} from "./Button";

describe("Button", () => {
    test("render", () => {
        render(<Button>test</Button>);
        expect(screen.getByText("test")).toBeInTheDocument();
    });

    test("calls onClick", () => {
        const clickSpy = vi.fn();
        render(<Button onClick={clickSpy}>test</Button>);
        fireEvent.click(screen.getByText("test"));
        expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    test("applies disabled", () => {
        render(<Button disabled>test</Button>);
        expect(screen.getByText("test")).toBeDisabled();
    });
});

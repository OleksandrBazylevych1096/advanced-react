import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  test("render", () => {
    render(<Button>test</Button>);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  test("calls onClick", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>test</Button>);
    fireEvent.click(screen.getByText("test"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies disabled", () => {
    render(<Button disabled>test</Button>);
    expect(screen.getByText("test")).toBeDisabled();
  });
});

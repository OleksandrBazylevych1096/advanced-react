import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";

import {RangeSlider} from "./RangeSlider";

const mockGetBoundingClientRect = (element: HTMLElement) => {
    element.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        right: 100,
        top: 0,
        bottom: 20,
        width: 100,
        height: 20,
        x: 0,
        y: 0,
        toJSON: () => ({})
    }));
};

describe("RangeSlider", () => {
    describe("Rendering", () => {
        it("should render with default props", () => {
            render(<RangeSlider/>);
            expect(screen.getByTestId("range-slider")).toBeInTheDocument();
            expect(screen.getByTestId("slider-thumb-0")).toBeInTheDocument();
            expect(screen.getByTestId("slider-thumb-1")).toBeInTheDocument();
        });

        it("should render with label", () => {
            render(<RangeSlider label="Price Range"/>);
            expect(screen.getByTestId("range-slider-label")).toHaveTextContent("Price Range");
        });

        it("should apply custom className", () => {
            render(<RangeSlider className="custom-class"/>);
            expect(screen.getByTestId("range-slider")).toHaveClass(/custom-class/);
        });

        it("should render with disabled state", () => {
            render(<RangeSlider disabled/>);
            const thumb0 = screen.getByTestId("slider-thumb-0");
            const thumb1 = screen.getByTestId("slider-thumb-1");

            expect(thumb0).toHaveClass(/disabled/);
            expect(thumb1).toHaveClass(/disabled/);
        });
    });

    describe("Initial values", () => {
        it("should use defaultValue when provided", () => {
            render(<RangeSlider defaultValue={[20, 80]} min={0} max={100}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "20");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "80");
        });

        it("should use controlled value over defaultValue", () => {
            render(<RangeSlider value={[30, 70]} defaultValue={[20, 80]} min={0} max={100}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "30");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "70");
        });

        it("should clamp initial values to min/max bounds", () => {
            render(<RangeSlider value={[-10, 110]} min={0} max={100}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "0");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "100");
        });

        it("should respect minRange on initial values", () => {
            render(<RangeSlider value={[40, 45]} minRange={10} min={0} max={100}/>);
            const thumb0 = screen.getByTestId("slider-thumb-0");
            const thumb1 = screen.getByTestId("slider-thumb-1");
            const val1 = Number(thumb0.getAttribute("aria-valuenow"));
            const val2 = Number(thumb1.getAttribute("aria-valuenow"));
            expect(val2 - val1).toBeGreaterThanOrEqual(10);
        });
    });

    describe("Thumb interactions", () => {
        it("should update value on thumb drag", () => {
            const onChange = vi.fn();
            render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});
            fireEvent.mouseMove(document, {clientX: 50});
            fireEvent.mouseUp(document);

            expect(onChange).toHaveBeenCalled();
        });

        it("should call onChangeEnd when drag ends", () => {
            const onChangeEnd = vi.fn();
            render(<RangeSlider min={0} max={100} value={[20, 80]} onChangeEnd={onChangeEnd}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});
            fireEvent.mouseMove(document, {clientX: 50});
            fireEvent.mouseUp(document);

            expect(onChangeEnd).toHaveBeenCalledTimes(1);
        });

        it("should not update value when disabled", () => {
            const onChange = vi.fn();
            render(<RangeSlider disabled min={0} max={100} value={[20, 80]} onChange={onChange}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});
            fireEvent.mouseMove(document, {clientX: 50});
            fireEvent.mouseUp(document);

            expect(onChange).not.toHaveBeenCalled();
        });

        it("should support touch events", () => {
            const onChange = vi.fn();
            render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.touchStart(thumb, {touches: [{clientX: 20}]});
            fireEvent.touchMove(document, {touches: [{clientX: 50}]});
            fireEvent.touchEnd(document);

            expect(onChange).toHaveBeenCalled();
        });

        it("should handle both thumbs independently", () => {
            const onChange = vi.fn();
            render(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange}/>);

            const thumb0 = screen.getByTestId("slider-thumb-0");
            const thumb1 = screen.getByTestId("slider-thumb-1");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb0, {clientX: 20});
            fireEvent.mouseMove(document, {clientX: 30});
            fireEvent.mouseUp(document);

            const firstCallCount = onChange.mock.calls.length;

            fireEvent.mouseDown(thumb1, {clientX: 80});
            fireEvent.mouseMove(document, {clientX: 90});
            fireEvent.mouseUp(document);

            expect(onChange.mock.calls.length).toBeGreaterThan(firstCallCount);
        });
    });

    describe("Step functionality", () => {
        it("should snap to step values", () => {
            const onChange = vi.fn();
            render(<RangeSlider min={0} max={100} step={10} value={[20, 80]} onChange={onChange}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});
            fireEvent.mouseMove(document, {clientX: 25});
            fireEvent.mouseUp(document);

            if (onChange.mock.calls.length > 0) {
                const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
                expect(lastCall[0] % 10).toBe(0);
                expect(lastCall[1] % 10).toBe(0);
            }
        });
    });

    describe("MinRange enforcement", () => {
        it("should maintain minimum range between thumbs", () => {
            const onChange = vi.fn();
            render(
                <RangeSlider
                    min={0}
                    max={100}
                    minRange={20}
                    value={[40, 60]}
                    onChange={onChange}
                />
            );

            const minThumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(minThumb, {clientX: 40});
            fireEvent.mouseMove(document, {clientX: 55});
            fireEvent.mouseUp(document);

            if (onChange.mock.calls.length > 0) {
                const values = onChange.mock.calls[onChange.mock.calls.length - 1][0];
                expect(values[1] - values[0]).toBeGreaterThanOrEqual(20);
            }
        });
    });

    describe("Tooltip behavior", () => {
        it('should show tooltip always when tooltip="always"', () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]} tooltip="always"/>);

            expect(screen.getByTestId("slider-tooltip-0")).toBeInTheDocument();
            expect(screen.getByTestId("slider-tooltip-1")).toBeInTheDocument();
        });

        it('should not show tooltip when tooltip="never"', () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]} tooltip="never"/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});

            expect(screen.queryByTestId("slider-tooltip-0")).not.toBeInTheDocument();
            expect(screen.queryByTestId("slider-tooltip-1")).not.toBeInTheDocument();
        });

        it('should show tooltip on drag when tooltip="auto"', () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]} tooltip="auto"/>);

            expect(screen.queryByTestId("slider-tooltip-0")).not.toBeInTheDocument();

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            fireEvent.mouseDown(thumb, {clientX: 20});

            expect(screen.getByTestId("slider-tooltip-0")).toBeInTheDocument();
        });

        it("should display floor value for min thumb and ceil for max thumb", () => {
            render(<RangeSlider min={0} max={100} value={[20.7, 80.3]} tooltip="always"/>);

            expect(screen.getByTestId("slider-tooltip-0")).toHaveTextContent("20");
            expect(screen.getByTestId("slider-tooltip-1")).toHaveTextContent("81");
        });

        it("should apply correct tooltip placement", () => {
            const {rerender} = render(
                <RangeSlider
                    min={0}
                    max={100}
                    value={[20, 80]}
                    tooltip="always"
                    tooltipPlacement="top"
                />
            );

            const tooltip = screen.getByTestId("slider-tooltip-0");
            expect(tooltip).toHaveClass(/top/);

            rerender(
                <RangeSlider
                    min={0}
                    max={100}
                    value={[20, 80]}
                    tooltip="always"
                    tooltipPlacement="bottom"
                />
            );

            const tooltipBottom = screen.getByTestId("slider-tooltip-0");
            expect(tooltipBottom).toHaveClass(/bottom/);
        });
    });

    describe("Controlled component behavior", () => {
        it("should update when controlled value changes", () => {
            const {rerender} = render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "20");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "80");

            rerender(<RangeSlider min={0} max={100} value={[30, 70]}/>);

            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "30");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "70");
        });
    });

    describe("Accessibility", () => {
        it("should have correct ARIA attributes", () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            const thumb0 = screen.getByTestId("slider-thumb-0");
            const thumb1 = screen.getByTestId("slider-thumb-1");

            [thumb0, thumb1].forEach((thumb) => {
                expect(thumb).toHaveAttribute("aria-valuemin", "0");
                expect(thumb).toHaveAttribute("aria-valuemax", "100");
                expect(thumb).toHaveAttribute("aria-valuenow");
                expect(thumb).toHaveAttribute("role", "slider");
            });
        });

        it("should be keyboard accessible when not disabled", () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("tabIndex", "0");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("tabIndex", "0");
        });

        it("should not be keyboard accessible when disabled", () => {
            render(<RangeSlider disabled min={0} max={100} value={[20, 80]}/>);

            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("tabIndex", "-1");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("tabIndex", "-1");
        });
    });

    describe("Track styling", () => {
        it("should render filled track between thumbs", () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            const filled = screen.getByTestId("slider-filled");
            expect(filled).toBeInTheDocument();
            expect(filled.style.left).toBe("20%");
            expect(filled.style.width).toBe("60%");
        });

        it("should update filled track on value change", () => {
            const {rerender} = render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            let filled = screen.getByTestId("slider-filled");
            expect(filled.style.left).toBe("20%");
            expect(filled.style.width).toBe("60%");

            rerender(<RangeSlider min={0} max={100} value={[30, 70]}/>);

            filled = screen.getByTestId("slider-filled");
            expect(filled.style.left).toBe("30%");
            expect(filled.style.width).toBe("40%");
        });
    });

    describe("Active state", () => {
        it("should mark thumb as active during drag", () => {
            render(<RangeSlider min={0} max={100} value={[20, 80]}/>);

            const thumb = screen.getByTestId("slider-thumb-0");
            const track = screen.getByTestId("slider-track");
            mockGetBoundingClientRect(track);

            expect(thumb).not.toHaveClass(/active/);

            fireEvent.mouseDown(thumb, {clientX: 50});

            expect(thumb).toHaveClass(/active/);

            fireEvent.mouseUp(document);

            expect(thumb).not.toHaveClass(/active/);
        });
    });

    describe("Edge cases", () => {
        it("should handle min and max being equal", () => {
            render(<RangeSlider min={50} max={50} value={[50, 50]}/>);
            expect(screen.getByTestId("slider-thumb-0")).toBeInTheDocument();
            expect(screen.getByTestId("slider-thumb-1")).toBeInTheDocument();
        });

        it("should handle negative ranges", () => {
            render(<RangeSlider min={-100} max={-50} value={[-80, -60]}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "-80");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "-60");
        });

        it("should handle very small step values", () => {
            render(<RangeSlider min={0} max={1} step={0.01} value={[0.25, 0.75]}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "0.25");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "0.75");
        });

        it("should handle decimal values correctly", () => {
            render(<RangeSlider min={0} max={10} step={0.5} value={[2.5, 7.5]}/>);
            expect(screen.getByTestId("slider-thumb-0")).toHaveAttribute("aria-valuenow", "2.5");
            expect(screen.getByTestId("slider-thumb-1")).toHaveAttribute("aria-valuenow", "7.5");
        });
    });

    describe("Wrapper elements", () => {
        it("should render slider wrapper", () => {
            render(<RangeSlider/>);
            expect(screen.getByTestId("slider-wrapper")).toBeInTheDocument();
        });

        it("should render track element", () => {
            render(<RangeSlider/>);
            expect(screen.getByTestId("slider-track")).toBeInTheDocument();
        });
    });
});
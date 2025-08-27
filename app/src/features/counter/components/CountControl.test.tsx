// src/features/counter/components/CountControls.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CountControls } from "./CountControls";

describe("CountControls", () => {
  it("CountUp クリックで onCountUp が呼ばれる", () => {
    const onCountUp = vi.fn();
    const onCountDown = vi.fn();
    const onCountUpFive = vi.fn();
    const onCountDownFive = vi.fn();
    const onReset = vi.fn();

    render(
      <CountControls
        onCountUp={onCountUp}
        onCountDown={onCountDown}
        onCountUpFive={onCountUpFive}
        onCountDownFive={onCountDownFive}
        onReset={onReset}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "CountUp" }));
    expect(onCountUp).toHaveBeenCalledTimes(1);
  });

  it("Reset クリックで onReset が呼ばれる", () => {
    const onCountUp = vi.fn();
    const onCountDown = vi.fn();
    const onCountUpFive = vi.fn();
    const onCountDownFive = vi.fn();
    const onReset = vi.fn();

    render(
      <CountControls
        onCountUp={onCountUp}
        onCountDown={onCountDown}
        onCountUpFive={onCountUpFive}
        onCountDownFive={onCountDownFive}
        onReset={onReset}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

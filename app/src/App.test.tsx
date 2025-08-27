// src/App.test.tsx
import { describe, it, expect,vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/App";

vi.mock("./features/todo/components/TodoContainer", () => ({
  TodoContainer: () => <div>Todo Page</div>,
}));
vi.mock("./features/counter/components/CounterContainer", () => ({
  CounterContainer: () => <div>Counter Page</div>,
}));
vi.mock("./features/echo/components/EchoContainer", () => ({
  EchoContainer: () => <div>Echo Page</div>,
}));
vi.mock("./features/coffee/components/CoffeeContainer", () => ({
  CoffeeContainer: () => <div>Coffee Page</div>,
}));

describe("App routing", () => {
  it("リンククリックでページが切り替わる", async () => {
    const user = userEvent.setup();
    render(<App />); // ← MemoryRouter で包まない

    await user.click(screen.getByText("Todo"));
    expect(screen.getByText("Todo Page")).toBeInTheDocument();

    await user.click(screen.getByText("Counter"));
    expect(screen.getByText("Counter Page")).toBeInTheDocument();

    await user.click(screen.getByText("Echo"));
    expect(screen.getByText("Echo Page")).toBeInTheDocument();

    await user.click(screen.getByText("Coffee"));
    expect(screen.getByText("Coffee Page")).toBeInTheDocument();
  });
});

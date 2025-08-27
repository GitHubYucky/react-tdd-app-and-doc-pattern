// src/features/counter/components/CounterContainer.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CounterContainer } from "./CounterContainer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../../stores/counter/counterSlice";

// ✅ テスト用store生成関数
const createTestStore = () =>
  configureStore({
    reducer: { counter: counterReducer },
  });

const renderWithProvider = (ui: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{ui}</Provider>);
};

describe("CounterContainer", () => {
  it("カウントが表示される", () => {
    renderWithProvider(<CounterContainer />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("CountUpボタンで1増える", () => {
    renderWithProvider(<CounterContainer />);
    fireEvent.click(screen.getByText("CountUp"));
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("CountDownボタンで1減る", () => {
    renderWithProvider(<CounterContainer />);
    fireEvent.click(screen.getByText("CountDown"));
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("CountUp5ボタンで5増える", () => {
    renderWithProvider(<CounterContainer />);
    fireEvent.click(screen.getByText("CountUp5"));
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("CountDown5ボタンで5減る", () => {
    renderWithProvider(<CounterContainer />);
    fireEvent.click(screen.getByText("CountDown5"));
    expect(screen.getByText("-5")).toBeInTheDocument();
  });

  it("Resetボタンで0に戻る", () => {
    renderWithProvider(<CounterContainer />);
    fireEvent.click(screen.getByText("CountUp5"));
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});

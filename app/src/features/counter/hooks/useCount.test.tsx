import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCount } from "./useCount";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../../stores/counter/counterSlice";
import { Provider } from "react-redux";
import type { ReactNode } from "react";

describe("useCount (Redux)", () => {
    const createWrapper = () => {
      const store = configureStore({
        reducer: { counter: counterReducer },
      });

      return {
        wrapper: ({ children }: { children: ReactNode }) => (
          <Provider store={store}>{children}</Provider>
        ),
      };
    };

    it("初期状態では0", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      expect(result.current.count).toBe(0);
    });

    it("countUpで1増える", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      act(() => result.current.countUp());
      expect(result.current.count).toBe(1);
    });

    it("countDownで1減る", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      act(() => result.current.countDown());
      expect(result.current.count).toBe(-1);
    });

    it("countUpFiveで5増える", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      act(() => result.current.countUpFive());
      expect(result.current.count).toBe(5);
    });

    it("countDownFiveで5減る", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      act(() => result.current.countDownFive());
      expect(result.current.count).toBe(-5);
    });

    it("resetで0に戻る", () => {
      const { wrapper } = createWrapper();
      const { result } = renderHook(() => useCount(), { wrapper });
      act(() => result.current.countUpFive());
      act(() => result.current.resetCount());
      expect(result.current.count).toBe(0);
    });
  });

// src/features/counter/counterSlice.test.ts
import { describe, it, expect } from "vitest";
import counterReducer, {
  increment,
  decrement,
  reset,
} from "./counterSlice";

describe("counterSlice", () => {
    it("初期状態を返す", () => {
        expect(counterReducer(undefined, { type: "@@INIT" })).toEqual({ value: 0 });
        });

  it("incrementで1増加する", () => {
    const initialState = { value: 0 };
    const newState = counterReducer(initialState, increment());
    expect(newState.value).toBe(1);
  });

  it("decrementで1減少する", () => {
    const initialState = { value: 3 };
    const newState = counterReducer(initialState, decrement());
    expect(newState.value).toBe(2);
  });

  it("resetで0に戻る", () => {
    const initialState = { value: 10 };
    const newState = counterReducer(initialState, reset());
    expect(newState.value).toBe(0);
  });
});

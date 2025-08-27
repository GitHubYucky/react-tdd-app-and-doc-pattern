Redux Toolkit を使った Store 周りの実装例

1. Store の作成

アプリ全体の状態管理を担う store を configureStore で構築します。

## store

```ts
// src/app/store.ts
// common
import { configureStore } from "@reduxjs/toolkit";
// slice
import counterReducer from "./counter/counterSlice";

export const store = configureStore({
  reducer: {
    // add counterstore
    counter: counterReducer,
  },
});

// export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## test

```ts
// src/features/counter/counterSlice.test.ts
// common
import { describe, it, expect } from "vitest";
// slice
import counterReducer, { increment, decrement, reset } from "./counterSlice";

describe("counterSlice", () => {
  it("初期状態を返す", () => {
    expect(counterReducer(undefined, { type: "@@INIT" })).toEqual({ value: 0 });
  });

  it("incrementで1増加する", () => {
    // set initial
    const initialState = { value: 0 };
    // act
    // 1stArg: value, 2ndArg: action
    const newState = counterReducer(initialState, increment());
    // assert
    expect(newState.value).toBe(1);
  });

  it("decrementで1減少する", () => {
    // set initial
    const initialState = { value: 3 };
    // 1stArg: value, 2ndArg: actiondddddddddddddddddddddddd
    const newState = counterReducer(initialState, decrement());
    expect(newState.value).toBe(2);
  });

  it("resetで0に戻る", () => {
    const initialState = { value: 10 };
    const newState = counterReducer(initialState, reset());
    expect(newState.value).toBe(0);
  });
});
```

## store

```ts
// src/features/counter/counterSlice.ts
// common
import { createSlice } from "@reduxjs/toolkit";

// set initial
const initialState: { value: number } = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter", // name
  initialState, // initialVal
  reducers: {
    // action1
    increment: (state) => {
      state.value += 1;
    },
    // action2
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
    incrementByFive: (state) => {
      state.value += 5;
    },
    decrementByFive: (state) => {
      state.value -= 5;
    },
  },
});

// export each action
export const { increment, decrement, reset, incrementByFive, decrementByFive } =
  counterSlice.actions;
// export reducer
export default counterSlice.reducer;
```

## call them

```ts
// src/features/counter/hooks/useCount.ts
// common
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../stores/store";
// for your store
import {
  increment,
  decrement,
  reset,
  incrementByFive,
  decrementByFive,
} from "../../../stores/counter/counterSlice";

export const useCount = () => {
  // set data value
  const count = useSelector((state: RootState) => state.counter.value);
  // dispatch
  const dispatch = useDispatch<AppDispatch>();

  // make them into each func
  const countUp = () => dispatch(increment());
  const countDown = () => dispatch(decrement());
  const countUpFive = () => dispatch(incrementByFive());
  const countDownFive = () => dispatch(decrementByFive());
  const resetCount = () => dispatch(reset());

  // return all
  return {
    count,
    countUp,
    countDown,
    countUpFive,
    countDownFive,
    reset: resetCount,
  };
};
```

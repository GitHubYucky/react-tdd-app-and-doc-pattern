// src/features/counter/hooks/useCount.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../stores/store";
import {
  increment,
  decrement,
  reset,
  incrementByFive,
  decrementByFive,
} from "../../../stores/counter/counterSlice";

export const useCount = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  const countUp = () => dispatch(increment());
  const countDown = () => dispatch(decrement());
  const countUpFive = () => dispatch(incrementByFive());
  const countDownFive = () => dispatch(decrementByFive());
  const resetCount = () => dispatch(reset());

  return {
    count,
    countUp,
    countDown,
    countUpFive,
    countDownFive,
    resetCount,
  };
};

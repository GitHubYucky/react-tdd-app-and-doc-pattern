// src/features/counter/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState:{value:number} = {
  value:0
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
    incrementByFive:(state)=>{
      state.value+=5;
    },
    decrementByFive:(state)=>{
      state.value-=5;
    },
  },
});

export const { increment, decrement, reset,incrementByFive,decrementByFive } = counterSlice.actions;
export default counterSlice.reducer;

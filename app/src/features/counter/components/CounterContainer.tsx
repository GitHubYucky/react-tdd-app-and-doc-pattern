// src/features/counter/components/CounterContainer.tsx
import { useCount } from "../hooks/useCount";
import { CountDisplay } from "./CountDisplay";
import { CountControls } from "./CountControls";

export const CounterContainer = () => {
  const { count, countUp, countDown, countUpFive, countDownFive, resetCount } =
    useCount();

  return (
    <div className="flex flex-col items-center gap-4 p-5 bg-[#f9f9f9] rounded-xl shadow-md">
      <CountDisplay count={count} />
      <CountControls
        onCountUp={countUp}
        onCountDown={countDown}
        onCountUpFive={countUpFive}
        onCountDownFive={countDownFive}
        onReset={resetCount}
      />
    </div>
  );
};

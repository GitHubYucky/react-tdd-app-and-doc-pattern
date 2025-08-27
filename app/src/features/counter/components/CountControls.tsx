// src/features/counter/components/CountControls.tsx
import { Button } from "../../../components/button/button";
import styles from "./CountControls.module.css";

type Props = {
  onCountUp: () => void;
  onCountDown: () => void;
  onCountUpFive: () => void;
  onCountDownFive: () => void;
  onReset: () => void;
};

export const CountControls = ({
  onCountUp,
  onCountDown,
  onCountUpFive,
  onCountDownFive,
  onReset,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button onClick={onCountUp}>CountUp</Button>
      <Button onClick={onCountDown}>CountDown</Button>
      <Button onClick={onCountUpFive}>CountUp5</Button>
      <Button onClick={onCountDownFive}>CountDown5</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

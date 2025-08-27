import type { InputHTMLAttributes } from "react";
import styles from "./input.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> &{
  className?:string;
}

export const Input = ({className="",...props}:Props) => {
  return <input className={`${styles.input} ${className}`} {...props} />;
};

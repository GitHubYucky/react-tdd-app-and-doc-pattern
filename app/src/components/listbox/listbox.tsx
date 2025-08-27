// src/components/listbox/listbox.tsx
import type { SelectHTMLAttributes } from "react";
import styles from "./listbox.module.css";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string;
};

export const ListBox = ({ className = "", children, ...props }: Props) => {
  return (
    <select className={`${styles.listbox} ${className}`} {...props}>
      {children}
    </select>
  );
};

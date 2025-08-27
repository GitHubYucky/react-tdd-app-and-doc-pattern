import type { CoffeeType } from "@/features/coffee/type/coffee";
import { Coffee } from "@/features/coffee/components/Coffee";
import styles from "@/features/coffee/components/CoffeeList.module.css";

type Props = {
  coffees: CoffeeType[];
  loading?:boolean;
  error?:Error|null;
};

export const CoffeeList = ({ coffees,loading=false,error=null }: Props) => {
  if (loading) return <p>送信中...</p>;
  if (error) return <p style={{ color: "red" }}>Error</p>;
  if (!coffees) return null;

  return (
    <section className={styles.list} aria-label="coffee list">
      {coffees.map((c) => (
        <Coffee key={c.id} coffee={c} />
      ))}
    </section>
  );
};

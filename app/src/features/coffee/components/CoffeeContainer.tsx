import { useCoffee } from "../hooks/useCoffee";
import { CoffeeInput } from "./CoffeeInput";
import { CoffeeList } from "./CoffeeList";
import styles from "./CoffeeContainer.module.css";

export const CoffeeContainer = () => {
  const { coffees, fetchCoffees, loading,error } = useCoffee();

  const handleSearch = (type: string,title:string) => {
    fetchCoffees(type,title);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <CoffeeInput onSearch={handleSearch} disabled={loading}/>
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}

      <CoffeeList coffees={coffees} loading={loading} error={error}/>
    </div>
  );
};

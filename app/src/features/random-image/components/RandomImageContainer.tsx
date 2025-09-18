import { RandomImage } from "./RandomImage";
import { useRandomImage } from "../hooks/useRandomImage";
import { RandomButton } from "./RandomButton";
import styles from "./RandomImageContainer.module.css";

export const RandomImageContainer = () => {
  const { imageUrl, loading, error, loadImage } = useRandomImage();

  const handleClick = () => {
    loadImage();
  };

  return (
    <div className={styles.container}>
      <RandomImage imageUrl={imageUrl} isLoading={loading} error={error} />
      <RandomButton onClick={handleClick} />
    </div>
  );
};

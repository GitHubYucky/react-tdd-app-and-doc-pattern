import React from 'react';
import styles from './RandomImage.module.css';

interface Props {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export const RandomImage: React.FC<Props> = ({ imageUrl, isLoading, error }) => {
  // 状態ごとにクラス名を切り替え
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  if (imageUrl === null) {
    return <div className={styles.noImage}>No image</div>;
  }

  return (
    <div>
      <img src={imageUrl} alt="Shown Image" className={styles.image} />
    </div>
  );
};

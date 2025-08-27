# 目次

- [コンポーネント概要](#コンポーネント概要)
- [ソースコード説明](#ソースコード説明)
- [使用例](#使用例)

## コンポーネント概要

CoffeeContainer コンポーネントの概要を記述します。

## ソースコード説明

```tsx
// src/features/coffee/components/CoffeeContainer.tsx
import { useCoffee } from "../hooks/useCoffee"; // useCoffeeフックをインポート
import { CoffeeInput } from "./CoffeeInput"; // CoffeeInputコンポーネントをインポート
import { CoffeeList } from "./CoffeeList"; // CoffeeListコンポーネントをインポート
import styles from "./CoffeeContainer.module.css"; // スタイルをインポート

// CoffeeContainerコンポーネント
export const CoffeeContainer = () => {
  // useCoffeeフックを使用して、コーヒーデータ、ローディング状態、エラー状態を取得
  const { coffees, fetchCoffees, loading, error } = useCoffee();

  // 検索処理を行う関数
  const handleSearch = (type: string, title: string) => {
    fetchCoffees(type, title); // fetchCoffees関数を呼び出してコーヒーデータを取得
  };

  return (
    // コンテナ要素
    <div className={styles.container}>
      {/* 検索セクション */}
      <div className={styles.searchSection}>
        {/* CoffeeInputコンポーネントを表示 */}
        <CoffeeInput onSearch={handleSearch} disabled={loading} />
      </div>

      {/* ローディング中はローディングメッセージを表示 */}
      {loading && <p className={styles.loading}>Loading...</p>}

      {/* CoffeeListコンポーネントを表示 */}
      <CoffeeList coffees={coffees} loading={loading} error={error} />
    </div>
  );
};
```

このコンポーネントは、コーヒーコンポーネントを管理します。

## 使用例

```tsx
import CoffeeContainer from "./CoffeeContainer";

function App() {
  return <CoffeeContainer />; // CoffeeContainerコンポーネントを表示
}
```

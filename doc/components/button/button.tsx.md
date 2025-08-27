## 目次

- [Button コンポーネント](#buttonコンポーネント)
- [Props](#props)
- [使用例](#使用例)

## Button コンポーネント

```typescript
// src/components/button/button.tsx
import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

type Variant = "primary" | "secondary" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: Props) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

これは Button コンポーネントです。

このコンポーネントは、React の Button 要素をラップし、スタイルとバリアントを提供します。

### Props:

<a name="props"></a>

- `children`: ボタン内に表示されるコンテンツ (文字列、アイコン、その他のコンポーネント)。
- `variant`: ボタンのスタイルを決定するバリアント。"primary"、"secondary"、"danger"のいずれかを指定できます。デフォルトは"primary"です。
- `className`: 追加の CSS クラスを適用するために使用します。
- `...props`: その他の HTML 属性をボタン要素に渡すために使用します。

このコンポーネントは、`ButtonHTMLAttributes`型を拡張した`Props`型を使用しています。これにより、標準の HTML ボタン属性をすべて受け入れることができます。

スタイルは、`button.module.css`ファイルからインポートされた CSS モジュールを使用して適用されます。

### 使用例：

<a name="使用例"></a>

```jsx
<Button variant="primary">送信</Button>
<Button variant="secondary">キャンセル</Button>
<Button variant="danger">削除</Button>
```

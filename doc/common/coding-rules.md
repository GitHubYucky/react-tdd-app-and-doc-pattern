# React コーディングルール（features 構成対応版）

> 本プロジェクトは **Feature 単位（`src/features/*`）** で責務を分離します。テストは実装と **同一フォルダ** に配置し、**Vitest + React Testing Library** を標準とします。

## 1. ディレクトリ構成

```
src/
  assets/                   # 画像・フォントなど静的資産
  components/               # 全体で再利用する汎用UI
    button.tsx
    input.tsx
  features/                 # 機能ごとに完結させる
    coffee/
      apis/                 # 外部API呼び出し（fetch等）
      components/           # 機能専用UI（*.tsx, *.module.css, *.test.tsx）
        CoffeeContainer.tsx # 部品Aと部品B+hooksを使う
        CoffeeContainer.module.css
        CoffeeContainer.test.tsx
        CoffeeInput.tsx     # 部品A
        CoffeeInput.module.css
        CoffeeInput.test.tsx
        CoffeeList.tsx      # 部品B
        CoffeeList.module.css
        CoffeeList.test.tsx
      hooks/                # ロジック/状態管理（Custom Hooks）
        useCoffee.ts        # useState,Funcs
        useCoffee.test.ts
      type/                 # 型定義（ローカル専用）
        coffee.ts
    counter/
    echo/
    mp3-downloader/
    todo/
  stores/                   # アプリ横断の状態（Redux/Zustand等）
    counter/
      counterSlice.test.ts
      counterSlice.ts
  types/                    # アプリ全体で再利用する型
```

### フォルダの責務

- **apis/**: データ取得/更新の I/O（HTTP・ストレージ）。副作用を集約し、UI から切り離す。 ex. echo/apis/echo.ts
- **components/**: プレゼンテーション中心。容器（Container）と部品（Input/List 等）を分け、Props でやり取り。ex. echo/components/
- **hooks/**: ビジネスロジック・状態管理をカスタムフックに集約。UI から独立してテスト可能に。 ex. echo/hooks/useEcho.ts
- **type/**: その機能だけで使う型。横断的な型は `src/types` へ。 ex. coffee/type/coffee

---

## 2. 命名規則

- **コンポーネント/ファイル**: パスカルケース（`CoffeeList.tsx`）
- **フック**: `use` + キャメルケース（`useCoffee`、`useEcho`）
- **テスト**: `*.test.ts` / `*.test.tsx` を実装と同フォルダに配置
- **スタイル**: `ComponentName.module.css`
- **定数**: スネークケース大文字（`MAX_RETRY`）

---

## 3. コーディングスタイル（TypeScript）

- **Props の型定義は必須**（`type` または `interface`）。外部公開の Props は `Props` サフィックス。

```ts
// Coffee.tsx
type Props = {
  coffee: CoffeeType;
};
```

- 非同期は `async/await` を標準化。

```ts
const fetchCoffees = async (type: string, title: string) => {
  setLoading(true);
  setError(null);
  try {
    const endpoint =
      type === "hot" || type === "iced"
        ? `https://api.sampleapis.com/coffee/${type}`
        : "https://api.sampleapis.com/coffee/iced";

    const resp = await fetch(endpoint);
    const data = (await resp.json()) as any[];

    // 正規化してからセット
    const normalized: CoffeeType[] = (data || []).map((item) => ({
      ...item,
      ingredients: normalizeIngredients(item.ingredients),
    }));

    // Coffeeのtitleを引数のTitleでFilterする
    const filtered =
      title && title.trim().length > 0
        ? normalized.filter((c) =>
            (c.title ?? "").toLowerCase().includes(title.toLowerCase())
          )
        : normalized;

    setCoffees(filtered);
  } catch (err: any) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

- import は **絶対パスエイリアス**を推奨（例：`@/features/coffee/...`）。

---

## 4. Hooks とコンポーネントの分離

- UI ロジック以外（取得・計算・永続化・状態合成）は **カスタムフックへ**。

```tsx
// 例: features/coffee/hooks/useCoffee.ts
export const useCoffee = () => {
  // 状態・取得・フィルタ等をここに集約
};
```

---

## 5. API 通信（apis/ 指針）

- **1 関数 = 1 エンドポイント**。引数は型で定義、戻り値も厳格に型付け。
- 例外を握りつぶさず、呼び出し側に **成功/失敗の情報**を返す。
- **キー/シークレットは絶対にクライアントに埋め込まない**。必要に応じて **サーバ or エッジ関数**を仲介。
- 取得直後の値は **型ガード or zod** でバリデーション。
  ex. echo/apis/echo.ts

---

## 6. スタイル

- **CSS Modules** を標準。グローバルは極小化。
- クラス名の粒度は **意味（役割）**ベース（`container`, `title`, `list` 等）。
- デザインシステム/トークン（色・余白・フォント）を定義して再利用。
  ex. Coffee.module.css

---

## 7. ルーティング / デプロイ注意

- GitHub Pages のサブパス配信時は `BrowserRouter basename={import.meta.env.BASE_URL}` を使用。
- 404 対策（SPA 用リダイレクト）を設定。
  ex. App.tsx

---

## 8. テスト（Vitest + RTL）

- **方針**: ユーザ行動起点（ボタン押下、入力、表示）で検証。実装詳細への過剰依存を避ける。
- **配置**: 実装と同階層に `*.test.ts(x)` を置く。
- **モック**: API 呼び出しや時間依存コードは `vi.fn()` / `vi.mock()` でモック化。
- **カバレッジ**: 重要ロジックは分岐網羅（条件分岐、例外系）。
  ex. Coffee.test.tsx

---

## 9. アクセシビリティ

- 画像には `alt` 属性必須。
- インタラクティブ要素には `aria-label` または適切なテキスト。
- キーボード操作可能な UI を担保。

---

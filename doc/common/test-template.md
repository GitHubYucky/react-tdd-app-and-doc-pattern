# React テストルール（Coffee 系を例に・Markdown 版）

**対象**

- 小さいコンポーネント：`<Coffee />`
- 小さいコンポーネントの一覧：`<CoffeeList />`
- ロジック：`useCoffee` フック

**ツール前提**：Vitest / React Testing Library / `@testing-library/jest-dom` / TypeScript

---

## 0. 共通ポリシー

- **テスト名は仕様の日本語**（ユーザー視点の振る舞い＋結果）
- **AAA（Arrange / Act / Assert）**で段落を分ける
- **クエリ優先度**：`getByRole`（必要に応じ `{ name: /.../i }`）＞ `getByLabelText` ＞ `getByPlaceholderText`
- **スコープ**：`within(container)` でカード毎など範囲を限定
- **操作**：`userEvent` を標準（`fireEvent` は特殊ケースのみ）
- **非同期**：`await waitFor(...)` で状態反映を待つ
- **モック**：`vi.spyOn(globalThis, "fetch")` → `afterEach` で `vi.restoreAllMocks()`
- **想定外 URL は失敗させる**（サイレントフォールバック禁止）
- **境界・失敗系を最低 1 本**（空配列、ネットワークエラー 等）
- **スナップショットは局所的に**（広い DOM は避ける）

---

## 1. 小さいコンポーネントの例：`<Coffee />` Coffee.tsx

### 実装例（ソース）

```tsx
// src/features/coffee/components/Coffee.tsx
import type { CoffeeType } from "@/features/coffee/type/coffee";

type Props = { coffee: CoffeeType };

export const Coffee = ({ coffee }: Props) => {
  const { id, title, description, image, ingredients } = coffee;
  return (
    <article aria-label={`coffee-${id}`}>
      <h2>{title}</h2>
      <img src={image} alt={title} />
      <p>{description}</p>

      <section aria-labelledby={`ingredients-${id}`}>
        <h3 id={`ingredients-${id}`}>Ingredients</h3>
        <ul>
          {ingredients.map((ing, i) => (
            <li key={`${id}-${i}`}>{ing}</li>
          ))}
        </ul>
      </section>

      <small>ID: {id}</small>
    </article>
  );
};
```

### サンプルテスト

```tsx
// src/features/coffee/components/Coffee.test.tsx
// import commons
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
// import component
import { Coffee } from "./Coffee";
// import type
import type { CoffeeType } from "@/features/coffee/type/coffee";

// set sample data
const sample: CoffeeType = {
  id: 42,
  title: "Iced Latte",
  description: "Smooth and refreshing.",
  image: "https://example.com/iced-latte.jpg",
  ingredients: ["Espresso", "Milk", "Ice"],
};

describe("<Coffee />", () => {
  it("見出し・画像・説明・材料・ID が表示される", () => {
    // arrange
    // render the component
    render(<Coffee coffee={sample} />);

    // assert
    const card = screen.getByRole("article", { name: /coffee-42/ });
    const ui = within(card);

    expect(ui.getByRole("heading", { name: sample.title })).toBeInTheDocument();

    const img = ui.getByRole("img", { name: sample.title });
    expect(img).toHaveAttribute("src", sample.image);

    expect(ui.getByText(sample.description)).toBeInTheDocument();
    expect(
      ui.getByRole("heading", { name: /ingredients/i })
    ).toBeInTheDocument();

    const items = ui.getAllByRole("listitem");
    expect(items).toHaveLength(sample.ingredients.length);
    sample.ingredients.forEach((ing) => {
      expect(ui.getByText(ing)).toBeInTheDocument();
    });

    expect(ui.getByText(/ID:\s*42/)).toBeInTheDocument();
  });

  it("材料が空でも描画できる", () => {
    const empty: CoffeeType = { ...sample, ingredients: [] };
    render(<Coffee coffee={empty} />);

    const card = screen.getByRole("article", { name: /coffee-42/ });
    const ui = within(card);

    expect(ui.queryAllByRole("listitem")).toHaveLength(0);
  });
});
```

---

## 2. 小さいコンポーネントの一覧：`<CoffeeList />`

### 実装例（ソース）

```tsx
// src/features/coffee/components/CoffeeList.tsx
import type { CoffeeType } from "@/features/coffee/type/coffee";
import { Coffee } from "./Coffee";

type Props = { coffees: CoffeeType[]; emptyText?: string };

export const CoffeeList = ({ coffees, emptyText = "No coffees" }: Props) => {
  if (coffees.length === 0) {
    return <p role="status">{emptyText}</p>;
  }

  return (
    <section aria-label="coffee-list">
      {coffees.map((c) => (
        <Coffee key={c.id} coffee={c} />
      ))}
    </section>
  );
};
```

### サンプルテスト

```tsx
// src/features/coffee/components/CoffeeList.test.tsx
// common
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
// component
import { CoffeeList } from "@/features/coffee/components/CoffeeList";
// type
import type { CoffeeType } from "@/features/coffee/type/coffee";

// sample datas
const coffees: CoffeeType[] = [
  {
    id: 1,
    title: "Espresso",
    description: "Strong and bold.",
    image: "https://example.com/espresso.jpg",
    ingredients: ["Espresso"],
  },
  {
    id: 2,
    title: "Iced Latte",
    description: "Smooth and refreshing.",
    image: "https://example.com/iced-latte.jpg",
    ingredients: ["Espresso", "Milk", "Ice"],
  },
];

describe("<CoffeeList />", () => {
  it("渡したコーヒー配列の件数分、カード(article)が表示される", () => {
    // act
    render(<CoffeeList coffees={coffees} />);

    // assert
    // <Coffee /> が <article> を使っている想定（あなたの Coffee コンポーネントに合わせる）
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(coffees.length);

    // タイトルが表示されていること
    coffees.forEach((c) => {
      expect(
        screen.getByRole("heading", { level: 2, name: c.title })
      ).toBeInTheDocument();
    });
  });

  it("画像(alt=title)も各カードに表示される", () => {
    render(<CoffeeList coffees={coffees} />);

    coffees.forEach((c) => {
      const img = screen.getByRole("img", { name: c.title });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", c.image);
    });
  });

  it("空配列のときはカードが表示されない（必要なら空メッセージも検証）", () => {
    render(<CoffeeList coffees={[]} />);

    // article が 0 件
    expect(screen.queryAllByRole("article")).toHaveLength(0);

    // もし空状態メッセージを出す実装なら、以下のように検証
    // expect(screen.getByText(/no coffees/i)).toBeInTheDocument();
  });
});
```

## 3. ロジックの例　 useCoffee.ts

### 実装例（ソース）

```ts
// src/features/coffee/hooks/useCoffee.ts
import { useState } from "react";
import type { CoffeeType } from "@/features/coffee/type/coffee";

export const useCoffee = () => {
  const [coffees, setCoffees] = useState<CoffeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 正規化関数（配列 or 文字列 → 配列）
  const normalizeIngredients = (
    value: string[] | string | null | undefined
  ): string[] => {
    if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

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

  return { coffees, loading, error, fetchCoffees };
};
```

### サンプルテスト

```ts
// useCoffee.test.ts
// これは useCoffee という機能をテストする例です。
// 「どう書けばいいか」をわかりやすくコメントしています。
// common
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
// hook
import { useCoffee } from "@/features/coffee/hooks/useCoffee";

// testDatas
const icedData = [
  {
    id: 1,
    title: "Iced Americano",
    description: "desc",
    image: "/img1",
    ingredients: "espresso, water, ice",
  },
  {
    id: 2,
    title: "Iced Latte",
    description: "desc",
    image: "/img2",
    ingredients: ["espresso", "milk", "ice"],
  },
];

// testDatas2
const icedExpected = [
  {
    id: 1,
    title: "Iced Americano",
    description: "desc",
    image: "/img1",
    ingredients: ["espresso", "water", "ice"],
  },
  {
    id: 2,
    title: "Iced Latte",
    description: "desc",
    image: "/img2",
    ingredients: ["espresso", "milk", "ice"],
  },
];

// create sampleRes
const makeRes = (data) => new Response(JSON.stringify(data), { status: 200 });

describe("useCoffee のテスト", () => {
  // before each test
  // if you call fetch then makeRes is called
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(makeRes(icedData));
  });

  // restore after each
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("最初は空っぽの状態", () => {
    // arrange
    // set useCoffee to result
    const { result } = renderHook(() => useCoffee());
    // assert
    // toEqual=object, toBe=value
    expect(result.current.coffees).toEqual([]); // データなし
    expect(result.current.loading).toBe(false); // 読み込み中じゃない
    expect(result.current.error).toBeNull(); // エラーなし
  });

  it("データを取得して変換できる", async () => {
    // arrange
    const { result } = renderHook(() => useCoffee());

    // act
    // you should use with await async
    // if you test fetch func, you should use async await
    await act(async () => {
      await result.current.fetchCoffees("iced", "");
    });

    // assert
    // the value is changed when you call fetch func, you should use waitFor
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.coffees).toEqual(icedExpected);
  });
});
```

## 4. Container の例: `<CoffeeContainer /> CoffeeContainer.tsx

### 実装例(ソース)

```tsx
// coffee/components/CoffeeContainer.tsx
import { useCoffee } from "../hooks/useCoffee";
import { CoffeeInput } from "./CoffeeInput";
import { CoffeeList } from "./CoffeeList";
import styles from "./CoffeeContainer.module.css";

export const CoffeeContainer = () => {
  const { coffees, fetchCoffees, loading } = useCoffee();

  const handleSearch = (type: string, title: string) => {
    fetchCoffees(type, title);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <CoffeeInput onSearch={handleSearch} />
      </div>

      {loading && <p className={styles.loading}>Loading...</p>}

      <CoffeeList coffees={coffees} />
    </div>
  );
};
```

### テスト例

```tsx
// coffee/components/CoffeeContainer.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CoffeeContainer } from "./CoffeeContainer";

// fetch をグローバルにモック
global.fetch = vi.fn();

describe("CoffeeContainer", () => {
  // before test: clear mock
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("CoffeeInputとCoffeeListが表示される", () => {
    // render
    render(<CoffeeContainer />);
    expect(
      screen.getByPlaceholderText("Search coffeeType...")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search CoffeeTitle...")
    ).toBeInTheDocument();
  });

  it("CoffeeInputでSearchを押すと入力値が表示される", async () => {
    // sample fetch
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ echoed: "新しいタスク" }),
    });

    // render
    render(<CoffeeContainer />);

    const input = screen.getByPlaceholderText("Search coffeeType...");
    fireEvent.change(input, { target: { value: "iced" } });

    const button = screen.getByText("Search");
    fireEvent.click(button);

    //assert
    // when you call api, you should use await,waitfor
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.sampleapis.com/coffee/iced"
      );
    });
  });

  it("通信中はローディングメッセージが表示される", async () => {
    // sample fetching...
    let resolveFetch: ((value: any) => void) | undefined;

    (fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    // render
    render(<CoffeeContainer />);

    const input = screen.getByPlaceholderText("Search coffeeType...");
    fireEvent.change(input, { target: { value: "iced" } });

    fireEvent.click(screen.getByText("Search"));

    expect(screen.getByText("送信中...")).toBeInTheDocument();

    // resolve=finish your fetch
    resolveFetch?.({
      ok: true,
      json: async () => ({ echoed: "loading中" }),
    });

    // assert
    await waitFor(() => {
      expect(screen.queryByText("送信中...")).not.toBeInTheDocument();
    });
  });

  it("API失敗時にエラー表示される", async () => {
    // sample fetching...
    (fetch as any).mockResolvedValue({
      ok: false,
    });

    render(<CoffeeContainer />);

    const input = screen.getByPlaceholderText("Search coffeeType...");
    fireEvent.change(input, { target: { value: "iced" } });

    fireEvent.click(screen.getByText("Search"));

    // assert
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });
  it("ローディング中は入力とボタンが無効化される", async () => {
    // sample fetching...
    let resolveFetch: ((value: any) => void) | undefined;

    (fetch as any).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<CoffeeContainer />);

    const input = screen.getByPlaceholderText(
      "Search coffeeType..."
    ) as HTMLInputElement; // to check if the input is disabled, you should type this
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "iced" } });
    fireEvent.click(button);

    // input type should be HTMLInputElement
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    // finish your fetch
    resolveFetch?.({
      ok: true,
      json: async () => ({ echoed: "待機" }),
    });

    // assert
    await waitFor(() => {
      expect(input.disabled).toBe(false);
      expect(button).not.toBeDisabled();
    });
  });
});
```

## 5. Store の例: counterSlice.ts

### 実装例(ソース)

```ts
// src/features/counter/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
    incrementByFive: (state) => {
      state.value += 5;
    },
    decrementByFive: (state) => {
      state.value -= 5;
    },
  },
});

export const { increment, decrement, reset, incrementByFive, decrementByFive } =
  counterSlice.actions;
export default counterSlice.reducer;
```

### テスト

```ts
// src/features/counter/counterSlice.test.ts
import { describe, it, expect } from "vitest";
import counterReducer, { increment, decrement, reset } from "./counterSlice";

describe("counterSlice", () => {
  it("初期状態を返す", () => {
    expect(counterReducer(undefined, { type: "@@INIT" })).toEqual({ value: 0 });
  });

  it("incrementで1増加する", () => {
    const initialState = { value: 0 };
    const newState = counterReducer(initialState, increment());
    expect(newState.value).toBe(1);
  });

  it("decrementで1減少する", () => {
    const initialState = { value: 3 };
    const newState = counterReducer(initialState, decrement());
    expect(newState.value).toBe(2);
  });

  it("resetで0に戻る", () => {
    const initialState = { value: 10 };
    const newState = counterReducer(initialState, reset());
    expect(newState.value).toBe(0);
  });
});
```

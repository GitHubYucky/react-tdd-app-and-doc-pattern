// src/hooks/useCoffee.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCoffee } from "./useCoffee";
import type { CoffeeApiType, CoffeeType } from "../type/coffee";

// APIレスポンス用のモック（string と string[] を混在させる）
const icedMockApi: CoffeeApiType[] = [
  {
    id: 1,
    title: "Iced Americano",
    description: "desc",
    image: "/img1",
    ingredients: "espresso, water, ice", // ← string
  },
  {
    id: 2,
    title: "Iced Latte",
    description: "desc",
    image: "/img2",
    ingredients: ["espresso", "milk", "ice"], // ← string[]
  },
  {
    id: 3,
    title: "Cold Brew",
    description: "desc",
    image: "/img3",
    ingredients: "coffee, water",
  },
];

const hotMockApi: CoffeeApiType[] = [
  {
    id: 10,
    title: "Espresso",
    description: "desc",
    image: "/img10",
    ingredients: "espresso", // 単一要素 string
  },
  {
    id: 11,
    title: "Cappuccino",
    description: "desc",
    image: "/img11",
    ingredients: ["espresso", "milk", "foam"],
  },
  {
    id: 12,
    title: "Latte",
    description: "desc",
    image: "/img12",
    ingredients: "espresso, milk",
  },
];

// 期待値（正規化後）
const icedNormalized: CoffeeType[] = [
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
  {
    id: 3,
    title: "Cold Brew",
    description: "desc",
    image: "/img3",
    ingredients: ["coffee", "water"],
  },
];

const hotNormalized: CoffeeType[] = [
  {
    id: 10,
    title: "Espresso",
    description: "desc",
    image: "/img10",
    ingredients: ["espresso"],
  },
  {
    id: 11,
    title: "Cappuccino",
    description: "desc",
    image: "/img11",
    ingredients: ["espresso", "milk", "foam"],
  },
  {
    id: 12,
    title: "Latte",
    description: "desc",
    image: "/img12",
    ingredients: ["espresso", "milk"],
  },
];

// ✅ これに差し替え（or 追加）
const mkRes = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("useCoffee", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: any) => {
      const urlStr = typeof input === "string" ? input : (input as Request).url;
      const url = new URL(urlStr);
      const last = url.pathname.split("/").pop();
      if (last === "hot") return mkRes(hotMockApi);
      if (last === "iced") return mkRes(icedMockApi);
      return mkRes(icedMockApi); // フォールバック
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("初期状態", () => {
    const { result } = renderHook(() => useCoffee());
    expect(result.current.coffees).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("iced を取得し ingredients を正規化", async () => {
    const { result } = renderHook(() => useCoffee());
    await act(async () => {
      await result.current.fetchCoffees("iced","");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.coffees).toEqual(icedNormalized);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.sampleapis.com/coffee/iced"
    );
  });

  it("hot を取得し ingredients を正規化", async () => {
    const { result } = renderHook(() => useCoffee());
    await act(async () => {
      await result.current.fetchCoffees("hot","");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.coffees).toEqual(hotNormalized);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.sampleapis.com/coffee/hot"
    );
  });

  it("不正 type は iced にフォールバック", async () => {
    const { result } = renderHook(() => useCoffee());
    await act(async () => {
      await result.current.fetchCoffees("hoge" as any,"");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.coffees).toEqual(icedNormalized);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.sampleapis.com/coffee/iced"
    );
  });

  // タイトルによるフィルタのテスト
  it("title 指定で部分一致（大文字小文字無視）でフィルタされる", async () => {
    const { result } = renderHook(() => useCoffee());

    await act(async () => {
      // 'all' は実装上 iced を取得 → そこから "latTE" にマッチする 1 件を期待
      await result.current.fetchCoffees("all" as any, "laTte");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.coffees).toEqual([icedMockApi[1]]);
  });
})

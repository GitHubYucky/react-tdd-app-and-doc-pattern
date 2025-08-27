//import
import { useState } from "react";
import type { CoffeeType } from "@/features/coffee/type/coffee";

export const useCoffee = () => {
  const [coffees, setCoffees] = useState<CoffeeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 正規化関数（配列 or 文字列 → 配列）
  const normalizeIngredients = (value: string[] | string | null | undefined): string[] => {
    if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
    if (typeof value === "string") {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const fetchCoffees = async (type: string,title:string) => {
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

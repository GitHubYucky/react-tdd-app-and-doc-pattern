import type { Request, Response } from "express";

// ランダム画像のURLを取得する純粋な関数
export async function fetchRandomImageUrl(): Promise<string> {
    const response = await fetch('https://picsum.photos/800');
    return response.url; // 画像URLだけ返す
  }

export const randomImageHandler = async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const imageUrl = await fetchRandomImageUrl();
    return res.status(200).json({ imageUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch random image" });
  }
};

// src/features/mp3/hooks/useMp3Downloader.ts
import { useState } from "react";
import type { mp3DownloderType } from "../type/mp3Downloader";

export const useMp3Downloader = () => {
  const [mp3Download, setMp3Download] = useState<mp3DownloderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  // 連打対策：前回リクエストを中断
  const fetchMp3Download = async (video_url: string) => {
    setLoading(true);
    setError(null);
    setMp3Download(null);

    // video_urlからIDを取得
    const url = new URL(video_url);
    const id = url.searchParams.get("v");
    if (!id) {
      throw new Error(`Invalid YouTube URL: video ID not found url:${url}`);
    }

    try {

      const res = await fetch(`/api/mp3?id=${encodeURIComponent(id)}`, { method: "GET" });
      const data:mp3DownloderType = (await res.json()) as mp3DownloderType;
      setMp3Download(data ?? null);
    } catch (e: unknown) {
      if ((e as any)?.name === "AbortError") return; // 中断は無視
      const msg =
        e instanceof Error ? e.message : typeof e === "string" ? e : "通信エラー";
      setError(msg);
      setMp3Download(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    mp3Download,
    loading,
    error,
    fetchMp3Download,
  };
};

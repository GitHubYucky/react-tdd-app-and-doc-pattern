import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMp3Downloader } from "./useMp3Downloader";
import type { mp3DownloderType } from "../type/mp3Downloader";

// fetchモック
global.fetch = vi.fn();
const sample_video_url = 'https://www.youtube.com/watch?v=UxxajLWwzqY';
const okPayload: mp3DownloderType = {
    link: "https://cdn02.ytjar.xyz/get.php/6/29/UxxajLWwzqY.mp3?h=JHV8tm8x78TScrDLmcUiIA&s=1633873888&n=Icona-Pop-I-Love-It-feat-Charli-XCX-OFFICIAL-VIDEO",
    title: "Icona Pop - I Love It (feat. Charli XCX) [OFFICIAL VIDEO]",
    progress: 0,
    duration: 180.062,
    status: "ok",
    msg: "success",
  };
describe("useMp3Downloader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("初期状態は空のecho、falseのloading、空のerror", () => {
    const { result } = renderHook(() => useMp3Downloader());

    expect(result.current.mp3Download).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("正常系:status:okならdataがセットされる", async () => {
    // fetchのモックレスポンス
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => okPayload
    });

    const { result } = renderHook(() => useMp3Downloader());

    await act(async () => {
      await result.current.fetchMp3Download(sample_video_url);
    });

    expect(result.current.mp3Download).toEqual(okPayload)
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

})

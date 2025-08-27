import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { mp3DownloderType } from "../type/mp3Downloader";
import { Mp3Link } from "./mp3-link";

const sample_res: mp3DownloderType = {
    link: "https://cdn02.ytjar.xyz/get.php/6/29/UxxajLWwzqY.mp3?h=JHV8tm8x78TScrDLmcUiIA&s=1633873888&n=Icona-Pop-I-Love-It-feat-Charli-XCX-OFFICIAL-VIDEO",
    title: "Icona Pop - I Love It (feat. Charli XCX) [OFFICIAL VIDEO]",
    progress: 0,
    duration: 180.062,
    status: "ok",
    msg: "success",
  };

describe("<mp3Link>",()=>{
    it("showLink: タイトルでリンクが表示され、href と download が正しい", () => {
        render(<Mp3Link mp3_res={sample_res} />);

        // タイトルでリンクを取る（アクセシブル名）
        const link = screen.getByRole("link", { name: sample_res.title });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", sample_res.link);
        // download 属性（ファイル名が付与されていること）
        expect(link).toHaveAttribute("download");
      });

      it("mp3_res が null/undefined なら表示しない", () => {
        const { rerender } = render(<Mp3Link mp3_res={null} />);
        expect(screen.queryByRole("link")).toBeNull();

        rerender(<Mp3Link mp3_res={undefined} />);
        expect(screen.queryByRole("link")).toBeNull();
      });

      it("status !== ok なら表示しない", () => {
        const bad: mp3DownloderType = { ...sample_res, status: "fail", msg: "error" };
        render(<Mp3Link mp3_res={bad} />);
        expect(screen.queryByRole("link")).toBeNull();
      });
})

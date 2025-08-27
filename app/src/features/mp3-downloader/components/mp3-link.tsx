// src/components/Mp3Link.tsx
import type { mp3DownloderType } from "../type/mp3Downloader";

type Props = {
  mp3_res?: mp3DownloderType | null;
};

export const Mp3Link = ({ mp3_res }: Props) => {
  if (!mp3_res || mp3_res.status !== "ok" || !mp3_res.link) return null;

  // ダウンロード時のファイル名（link の &n= 末尾を優先、なければ title）
  const fileName =
    decodeURIComponent(mp3_res.link.split("&n=").pop() || "") ||
    mp3_res.title;

  return (
    <a
      href={mp3_res.link}
      target="_blank"
      rel="noopener noreferrer"
      download={fileName}
      aria-label={`${mp3_res.title}`}
    >
      {mp3_res.title}
    </a>
  );
};

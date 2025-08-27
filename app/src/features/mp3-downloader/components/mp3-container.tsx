import { useMp3Downloader } from "../hooks/useMp3Downloader";
import { Mp3Input } from "./mp3-input";
import { Mp3Link } from "./mp3-link";

export const Mp3Container = () => {
  const { mp3Download, loading, fetchMp3Download } = useMp3Downloader();

  return (
    <>
      <Mp3Input onSubmit={fetchMp3Download} />

      {loading && <p>ダウンロード中...</p>}
      {mp3Download && <Mp3Link mp3_res={mp3Download} />}
    </>
  );
};

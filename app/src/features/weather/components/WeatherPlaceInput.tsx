// src/features/weather/components/WeatherPlaceInput.tsx
import { useState } from "react";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";

type Props = {
  onSearch: (lat: number, lon: number) => void;
  loading: boolean;
};

export const WeatherPlaceInput = ({ onSearch, loading }: Props) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat.trim());
    const lonNum = parseFloat(lon.trim());
    if (Number.isNaN(latNum) || Number.isNaN(lonNum)) return;
    onSearch(latNum, lonNum);
  };

  return (
    // 幅は親で管理 → ここは w-full のみ
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div>
        <label className="block text-left font-bold mb-2 text-[#555]">緯度</label>
        <Input
          type="text"
          placeholder="例: 35.0"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-left font-bold mb-2 text-[#555]">経度</label>
        <Input
          type="text"
          placeholder="例: 135.0"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        天気を取得
      </Button>
    </form>
  );
};

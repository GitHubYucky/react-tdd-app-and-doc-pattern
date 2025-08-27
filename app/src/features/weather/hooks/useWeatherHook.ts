import { useState } from "react";
import type {Weather} from "@/features/weather/types/weather"
// 型定義（必要に応じて拡張できます）

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setWeather(data.current_weather);
    } catch (err) {
      setError(new Error("WeatherError"));
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    loading,
    error,
    fetchWeather,
  };
};

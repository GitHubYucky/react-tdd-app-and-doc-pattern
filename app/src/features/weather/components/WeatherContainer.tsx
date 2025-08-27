// src/features/weather/components/WeatherContainer.tsx
import { useWeather } from "../hooks/useWeatherHook";
import { WeatherPlaceInput } from "./WeatherPlaceInput";
import { WeatherDisplay } from "./WeatherDisplay";

export const WeatherContainer = () => {
  const { weather, fetchWeather, loading, error } = useWeather();

  return (
    <div className="flex flex-col items-center gap-4 p-5 bg-[#f9f9f9] rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-[#333] text-center">天気検索</h1>

      <WeatherPlaceInput onSearch={fetchWeather} loading={loading} />
      <WeatherDisplay weather={weather} error={error} />
    </div>
  );
};


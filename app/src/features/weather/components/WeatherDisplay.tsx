// src/features/weather/components/WeatherDisplay.tsx
import type { Weather } from "../types/weather";

type Props = { weather: Weather | null; error: Error | null };

export const WeatherDisplay = ({ weather, error }: Props) => {
  if (error) {
    return (
      <div className="  flex flex-col items-center gap-4 p-5 bg-[#f9f9f9] rounded-xl shadow-md">
        Error!
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex flex-col items-center gap-4 p-5 bg-[#f9f9f9] rounded-xl shadow-md">
        NoWeatherInfo
      </div>
    );
  }


  return (
    <div className="  flex flex-col items-center gap-4 p-5 bg-[#f9f9f9] rounded-xl shadow-md">
      <h2 className="text-xl text-[#444] mb-4 text-left">現在の天気</h2>
      <div>
        <p>気温: {weather.temperature}℃</p>
        <p>風速: {weather.windspeed} m/s</p>
        <p>風向: {weather.winddirection}°</p>
        <p>天気コード: {weather.weathercode}</p>
        <p>昼夜: {weather.is_day === 1 ? "昼" : "夜"}</p>
        <p>時間: {weather.time}</p>
      </div>
    </div>
  );
};

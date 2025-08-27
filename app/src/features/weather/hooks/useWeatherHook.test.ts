import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it,expect, beforeEach, vi, afterEach } from "vitest";
import { useWeather } from "./useWeatherHook";
import { Weather } from "../types/weather";

const weatherMock: Weather = {
    temperature: 26.9,
    windspeed: 1.5,
    winddirection: 284,
    is_day: 0,
    weathercode: 1,
    time: "2025-08-20T14:00",
  };


describe("useWeatherHook",()=>{

    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch=vi.fn().mockResolvedValue({
            ok:true,
            json:async()=>({current_weather:weatherMock})
        } as any)
      });

      afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
      });

    it("初期状態は空のecho、falseのloading、空のerror", () => {
        const { result } = renderHook(() => useWeather());

        expect(result.current.weather).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });


      it("fetchWeather で weather が更新される（成功）", async () => {
        const { result } = renderHook(() => useWeather());

        await act(async () => {
          await result.current.fetchWeather(35.0, 135.0); // ← lat/lon を渡す
        });

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });
        expect(result.current.error).toBeNull();
        expect(result.current.weather).toEqual(weatherMock);
      });
})

import { describe,it,expect } from "vitest";
import { render,screen } from "@testing-library/react";
import { WeatherDisplay } from "@/features/weather/components/WeatherDisplay";
import { Weather } from "../types/weather";

describe("WeatherDisplay",()=>{
    const weatherMock: Weather = {
        temperature: 26.9,
        windspeed: 1.5,
        winddirection: 284,
        is_day: 0,
        weathercode: 1,
        time: "2025-08-20T14:00",
      };
    it("天気が表示される",()=>{
        render(<WeatherDisplay weather={weatherMock} error={null}/>);
        expect(screen.getByText(/26.9/)).toBeInTheDocument();
        expect(screen.getByText(/1.5/)).toBeInTheDocument();
        expect(screen.getByText(/284/)).toBeInTheDocument();
        expect(screen.getByText(/昼/)).toBeInTheDocument();
    })
    it("エラーしたらエラーと表示",()=>{
        render(<WeatherDisplay weather={weatherMock} error={new Error("sample")}/>);
        expect(screen.getByText(/Error!/)).toBeInTheDocument();
    })
    it("天気情報がない場合は天気がないと表示",()=>{
        render(<WeatherDisplay weather={null} error={null}/>);
        expect(screen.getByText(/NoWeatherInfo/)).toBeInTheDocument();
    })
})

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WeatherContainer } from "./WeatherContainer";
import { useWeather } from "../hooks/useWeatherHook";

// useWeatherフックをモック化
// このモックにより、API呼び出しのような実際のロジックをテストから切り離せる
vi.mock("../hooks/useWeatherHook", () => ({
  useWeather: vi.fn(),
}));

describe("WeatherContainer", () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("コンポーネントが正しくレンダリングされること", () => {
    // モックの戻り値を定義
    const mockUseWeather = vi.fn().mockReturnValue({
      weather: null,
      fetchWeather: vi.fn(),
      loading: false,
      error: null,
    });
    // useWeatherのモック実装を適用
    vi.mocked(useWeather).mockImplementation(mockUseWeather);

    render(<WeatherContainer />);

    // ヘッダーがレンダリングされていることを確認
    expect(screen.getByRole("heading", { name: /天気検索/i })).toBeInTheDocument();

    // 子コンポーネントの要素（InputとButton）がレンダリングされていることを確認
    // このテストでは、子コンポーネントの内部実装をテストするのではなく、
    // それらが存在することを確認する
    expect(screen.getByPlaceholderText(/例: 35.0/)).toBeInTheDocument();
    expect(screen.getByText("天気を取得")).toBeInTheDocument();
  });

  it("WeatherPlaceInputに正しいpropsが渡されること", async () => {
    // fetchWeather関数をモック
    const mockFetchWeather = vi.fn();
    const mockUseWeather = vi.fn().mockReturnValue({
      weather: null,
      fetchWeather: mockFetchWeather,
      loading: false,
      error: null,
    });
    vi.mocked(useWeather).mockImplementation(mockUseWeather);

    render(<WeatherContainer />);

    // 緯度・経度を入力
    const latInput = screen.getByPlaceholderText(/例: 35.0/);
    const lonInput = screen.getByPlaceholderText(/例: 135.0/);
    fireEvent.change(latInput, { target: { value: "35.0" } });
    fireEvent.change(lonInput, { target: { value: "135.0" } });

    // ボタンをクリックしてフォームを送信
    const button = screen.getByRole("button", { name: /天気を取得/ });
    fireEvent.click(button);

    // fetchWeatherが正しい引数で呼ばれたことを確認
    expect(mockFetchWeather).toHaveBeenCalledWith(35.0, 135.0);
  });

  it("loadingステートがWeatherPlaceInputに正しく伝わること", () => {
    const mockUseWeather = vi.fn().mockReturnValue({
      weather: null,
      fetchWeather: vi.fn(),
      loading: true, // loadingをtrueに設定
      error: null,
    });
    vi.mocked(useWeather).mockImplementation(mockUseWeather);

    render(<WeatherContainer />);

    // loadingがtrueなので、ボタンがdisabledになっていることを確認
    const button = screen.getByRole("button", { name: /天気を取得/ });
    expect(button).toBeDisabled();
  });

  it("天気データが利用可能なときにWeatherDisplayが正しくレンダリングされること", () => {
    // 天気データを含むモックを設定
    const mockWeatherData = {
      temperature: 25.5,
      windspeed: 10,
      winddirection: 180,
    };
    const mockUseWeather = vi.fn().mockReturnValue({
      weather: mockWeatherData,
      fetchWeather: vi.fn(),
      loading: false,
      error: null,
    });
    vi.mocked(useWeather).mockImplementation(mockUseWeather);

    render(<WeatherContainer />);

    // weather propが渡されているか、WeatherDisplayのテキストで確認
    expect(screen.getByText(/25.5/)).toBeInTheDocument();
  });

  it("エラーが発生したときにWeatherDisplayが正しくエラーを表示すること", () => {
    // エラーを含むモックを設定
    const mockError = "天気情報を取得できませんでした";
    const mockUseWeather = vi.fn().mockReturnValue({
      weather: null,
      fetchWeather: vi.fn(),
      loading: false,
      error: mockError,
    });
    vi.mocked(useWeather).mockImplementation(mockUseWeather);

    render(<WeatherContainer />);

    // error propが渡されているか、WeatherDisplayのテキストで確認
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });
});

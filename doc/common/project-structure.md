# プロジェクト構成

このドキュメントでは、プロジェクトの構成について説明します。

## ~/.env

環境変数などはここに置くようにします

## docs

このディレクトリには、コーディング規則、コンポーネントの説明、その他の役立つ情報など、プロジェクトのドキュメントが含まれています。

このディレクトリのファイル：

- docs/coding-rules.md
- docs/components.md
- docs/counter.md
- docs/mp3-downloader.md
- docs/project-structure.md
- docs/README.md
- docs/secret.md
- docs/store.md
- docs/test-template.md
- docs/weather.md

## src/main.tsx

## App.tsx

Container への Link を置いていく

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";
import { CounterContainer } from "@/features/counter/components/CounterContainer";
import { TodoContainer } from "@/features/todo/components/TodoContainer";
import { EchoContainer } from "@/features/echo/components/EchoContainer";
import { CoffeeContainer } from "@/features/coffee/components/CoffeeContainer";
import { Mp3Container } from "@/features/mp3-downloader/components/mp3-container";
import { WeatherContainer } from "./features/weather/components/WeatherContainer";

export const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className={styles.container}>
        <nav>
          <ul>
            <li>
              <Link to="/">HomePage</Link>
            </li>
            <li>
              <Link to="/todo">Todo</Link>
            </li>
            <li>
              <Link to="/counter">Counter</Link>
            </li>
            <li>
              <Link to="/echo">Echo</Link>
            </li>
            <li>
              <Link to="/coffee">Coffee</Link>
            </li>
            <li>
              <Link to="/mp3download">Mp3Download</Link>
            </li>
            <li>
              <Link to="/weather">Weather</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} /> {/* これを追加 */}
          <Route path="/todo" element={<TodoContainer />} />
          <Route path="/counter" element={<CounterContainer />} />
          <Route path="/echo" element={<EchoContainer />} />
          <Route path="/coffee" element={<CoffeeContainer />} />
          <Route path="/mp3download" element={<Mp3Container />} />
          <Route path="/weather" element={<WeatherContainer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
```

## src/main.tsx

このプロジェクトでは、`src/main.tsx`がエントリポイントとして使用されます。

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "@/App";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

## features

このディレクトリには、コーヒー、カウンター、エコー、mp3-downloader、todo、天気など、アプリケーションのさまざまな機能が含まれています。各機能には、コンポーネント、フック、API 定義を含む独自のディレクトリがあります。

### src/features/coffee

- apis/: このディレクトリには、コーヒー機能の API 定義が含まれています。
- components/: このディレクトリには、コーヒー機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、コーヒー機能のカスタムフックが含まれています。
- type/: このディレクトリには、コーヒー機能の型定義が含まれています。

### src/features/counter

- components/: このディレクトリには、カウンター機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、カウンター機能のカスタムフックが含まれています。

### src/features/echo

- apis/: このディレクトリには、エコー機能の API 定義が含まれています。
- components/: このディレクトリには、エコー機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、エコー機能のカスタムフックが含まれています。

### src/features/mp3-downloader

- apis/: このディレクトリには、mp3-downloader 機能の API 定義が含まれています。
- components/: このディレクトリには、mp3-downloader 機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、mp3-downloader 機能のカスタムフックが含まれています。
- type/: このディレクトリには、mp3-downloader 機能の型定義が含まれています。

### src/features/todo

- index.tsx: これは、todo 機能のメインエントリポイントです。
- components/: このディレクトリには、todo 機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、todo 機能のカスタムフックが含まれています。
- types/: このディレクトリには、todo 機能の型定義が含まれています。

### src/features/weather

- components/: このディレクトリには、天気機能の React コンポーネントが含まれています。
- hooks/: このディレクトリには、天気機能のカスタムフックが含まれています。
- types/: このディレクトリには、天気機能の型定義が含まれています。

## src/server/index.ts

このファイルには、API エンドポイントが記述されています。API を作成するための一連の操作については、[creating-apis.md](creating-apis.md)を参照してください。

```typescript
// src/server/index.ts
import express from "express";
import bodyParser from "body-parser";
import { echoHandler } from "../features/echo/apis/echo";
import { mp3Handler } from "../features/mp3-downloader/apis/mp3";

const app = express();
app.use(bodyParser.json());

app.all("/api/echo", echoHandler);
app.all("/api/mp3", mp3Handler);

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

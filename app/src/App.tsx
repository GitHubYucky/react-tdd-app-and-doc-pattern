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
            <li><Link to="/">HomePage</Link></li>
            <li><Link to="/todo">Todo</Link></li>
            <li><Link to="/counter">Counter</Link></li>
            <li><Link to="/echo">Echo</Link></li>
            <li><Link to="/coffee">Coffee</Link></li>
            <li><Link to="/mp3download">Mp3Download</Link></li>
            <li><Link to="/weather">Weather</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />

          <Route path="/todo" element={<TodoContainer />} />
          <Route path="/counter" element={<CounterContainer />} />
          <Route path="/echo" element={<EchoContainer />} />
          <Route path="/coffee" element={<CoffeeContainer />} />

          <Route
            path="/mp3download"
            element={
                <Mp3Container />
            }
          />
          <Route
            path="/weather"
            element={
                <WeatherContainer />
            }
          />

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

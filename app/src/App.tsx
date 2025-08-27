// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";
import { CounterContainer } from "@/features/counter/components/CounterContainer";
import { TodoContainer } from "@/features/todo/components/TodoContainer";
import { EchoContainer } from "@/features/echo/components/EchoContainer";
import { CoffeeContainer } from "@/features/coffee/components/CoffeeContainer";
import { Mp3Container } from "@/features/mp3-downloader/components/mp3-container";
import { WeatherContainer } from "./features/weather/components/WeatherContainer";

import { LoginContainer, ProtectedRoute, useAuth,UserBadge } from "@/features/login";

const HeaderAuthArea = () => {
  const { user, logout } = useAuth();
  if (!user) return <Link to="/login">Login</Link>;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <UserBadge user={user} />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

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
          <HeaderAuthArea />
        </nav>

        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<LoginContainer redirectTo="/" />} />

          <Route path="/todo" element={<TodoContainer />} />
          <Route path="/counter" element={<CounterContainer />} />
          <Route path="/echo" element={<EchoContainer />} />
          <Route path="/coffee" element={<CoffeeContainer />} />

          <Route
            path="/mp3download"
            element={
              <ProtectedRoute>
                <Mp3Container />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <WeatherContainer />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

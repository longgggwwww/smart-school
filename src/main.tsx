import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { LoginPage, DashboardPage, ForgotPasswordPage } from "./pages";
import "./i18n";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </HashRouter>
    </HeroUIProvider>
  </React.StrictMode>
);

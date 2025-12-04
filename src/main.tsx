import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AnimatedRoutes } from "./components";
import "./i18n";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <HashRouter>
        <div className="relative w-full h-screen overflow-hidden">
          <AnimatedRoutes />
        </div>
      </HashRouter>
    </HeroUIProvider>
  </React.StrictMode>
);

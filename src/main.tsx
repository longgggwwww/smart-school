import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { router } from "./app/router";
import "./i18n";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <div className="relative w-full h-screen overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </HeroUIProvider>
  </React.StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "@/app/App.tsx";

import { ErrorBoundary, StoreProvider, ThemeProvider } from "./app/providers";

import "@/shared/config/i18n/i18n";
import "@/app/styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>
);

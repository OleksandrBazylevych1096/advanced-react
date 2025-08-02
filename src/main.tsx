import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "@/app/styles/index.scss";
import App from "@/app/App.tsx";

import { ErrorBoundary, ThemeProvider } from "./app/providers";

import "@/shared/config/i18n/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

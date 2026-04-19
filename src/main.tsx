import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router";

import App from "@/app/App.tsx";
import {ErrorBoundary} from "@/app/providers/ErrorBounary/ErrorBoundary.tsx";
import {StoreProvider} from "@/app/providers/StoreProvider/StoreProvider.tsx";
import {ThemeProvider} from "@/app/providers/theme/ThemeProvider.tsx";
import {ToastProvider} from "@/app/providers/toast/ToastProvider.tsx";

import {i18n} from "@/shared/config";
import "@/app/styles/index.scss";

void i18n;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <StoreProvider>
            <BrowserRouter>
                <ThemeProvider>
                    <ErrorBoundary>
                        <ToastProvider />
                        <App />
                    </ErrorBoundary>
                </ThemeProvider>
            </BrowserRouter>
        </StoreProvider>
    </StrictMode>,
);

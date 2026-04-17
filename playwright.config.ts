import {defineConfig, devices} from "@playwright/test";

const PORT = 4173;

export default defineConfig({
    testDir: "./e2e/specs",
    fullyParallel: false,
    reporter: [["list"], ["html", {open: "never"}]],
    timeout: 30_000,
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
    ],
    webServer: {
        command: `npm run dev -- --host 127.0.0.1 --port ${PORT}`,
        url: `http://127.0.0.1:${PORT}/en`,
        reuseExistingServer: true,
        env: {
            VITE_API_URL: "http://localhost:3000",
            VITE_PROJECT_ENV: "client",
        },
    },
});

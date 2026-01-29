/// <reference types="vitest/config" />

import path from "path";

import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import svgr from "vite-plugin-svgr";


export default defineConfig({
    plugins: [react(), svgr()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/shared/config/test/setupTests.ts"],
        env: {
            VITE_API_URL: 'http://localhost:3000'
        }
    },
});

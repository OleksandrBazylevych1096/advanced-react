import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, test, vi} from "vitest";

import {clearUserSession} from "@/entities/user";

import {baseAPI} from "@/shared/api";

import {logoutApi} from "./logoutApi";

vi.mock("@/entities/user", () => ({
    clearUserSession: vi.fn(),
}));

const createApiStore = () =>
    configureStore({
        reducer: {
            [baseAPI.reducerPath]: baseAPI.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseAPI.middleware),
    });

describe("logoutApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("clears user session immediately when logout starts", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({ok: true}), {
                status: 200,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        await store.dispatch(logoutApi.endpoints.logout.initiate());

        expect(clearUserSession).toHaveBeenCalledTimes(1);
    });

    test("still clears user session even when logout request fails", async () => {
        vi.spyOn(global, "fetch").mockImplementation(async () => {
            return new Response(JSON.stringify({message: "error"}), {
                status: 500,
                headers: {"Content-Type": "application/json"},
            });
        });

        const store = createApiStore();
        await store.dispatch(logoutApi.endpoints.logout.initiate());

        expect(clearUserSession).toHaveBeenCalledTimes(1);
    });
});


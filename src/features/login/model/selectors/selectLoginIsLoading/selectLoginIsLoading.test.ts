import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

import { selectLoginIsLoading } from "./selectLoginIsLoading";

describe("selectLoginIsLoading", () => {
  test("should return the isLoading from state", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        isLoading: true,
      },
    };

    const result = selectLoginIsLoading(state as StateSchema);
    expect(result).toBe(true);
  });
  test("should return false if isLoading is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        isLoading: undefined,
      },
    };

    const result = selectLoginIsLoading(state as StateSchema);
    expect(result).toBe(false);
  });
});

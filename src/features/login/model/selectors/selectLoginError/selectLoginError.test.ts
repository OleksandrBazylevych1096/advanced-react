import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

import { selectLoginError } from "./selectLoginError";

describe("selectLoginError", () => {
  test("should return the error from state", () => {
    const testError = "error message";
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        error: testError,
      },
    };

    const result = selectLoginError(state as StateSchema);
    expect(result).toBe(testError);
  });
  test("should return undefined if error is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        error: undefined,
      },
    };

    const result = selectLoginError(state as StateSchema);
    expect(result).toBe(undefined);
  });
});

import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

import { selectLoginPassword } from "./selectLoginPassword";

describe("selectLoginPassword", () => {
  test("should return the password from state", () => {
    const testPassword = "123456";
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        password: testPassword,
      },
    };

    const result = selectLoginPassword(state as StateSchema);
    expect(result).toBe(testPassword);
  });
  test("should return empty if password is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        password: undefined,
      },
    };

    const result = selectLoginPassword(state as StateSchema);
    expect(result).toBe("");
  });
});

import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import { AuthMethod } from "@/shared/config";
import type { DeepPartial } from "@/shared/lib";

import { selectLoginMethod } from "./selectLoginMethod";

describe("selectLoginMethod", () => {
  test("should return the method from state", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        method: AuthMethod.PHONE,
      },
    };

    const result = selectLoginMethod(state as StateSchema);
    expect(result).toBe(AuthMethod.PHONE);
  });
  test("should return email method if method is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        method: undefined,
      },
    };

    const result = selectLoginMethod(state as StateSchema);
    expect(result).toBe(AuthMethod.EMAIL);
  });
});

import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

import { selectLoginPhone } from "./selectLoginPhone";

describe("selectLoginPhone", () => {
  test("should return the phone from state", () => {
    const testPhone = "12345639943";
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        phone: testPhone,
      },
    };

    const result = selectLoginPhone(state as StateSchema);
    expect(result).toBe(testPhone);
  });
  test("should return empty if phone is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        phone: undefined,
      },
    };

    const result = selectLoginPhone(state as StateSchema);
    expect(result).toBe("");
  });
});

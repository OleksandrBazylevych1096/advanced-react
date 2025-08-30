import { describe, expect, test } from "vitest";

import type { StateSchema } from "@/app/store";

import type { DeepPartial } from "@/shared/lib";

import { selectLoginEmail } from "./selectLoginEmail";

describe("selectLoginEmail", () => {
  test("should return the email from state", () => {
    const testEmail = "test@test.com";
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        email: testEmail,
      },
    };

    const result = selectLoginEmail(state as StateSchema);
    expect(result).toBe(testEmail);
  });
  test("should return empty string if email is undefined", () => {
    const state: DeepPartial<StateSchema> = {
      loginForm: {
        email: undefined,
      },
    };

    const result = selectLoginEmail(state as StateSchema);
    expect(result).toBe("");
  });
});

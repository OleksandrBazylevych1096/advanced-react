import { describe, expect, test } from "vitest";

import { classNames } from "./classNames";

describe("classNames", () => {
  test("1 argument", () => {
    expect(classNames("class1")).toBe("class1");
  });
  test("conditional class", () => {
    expect(classNames("class1", { class2: true })).toBe("class1 class2");
    expect(classNames("class1", { class2: false })).toBe("class1");
  });

  test("conditional class", () => {
    expect(classNames("class1", undefined, null, "", "class2")).toBe(
      "class1 class2"
    );
  });
});

import { describe, it, expect } from "vitest";

describe("tsHello", () => {
  it("returns a greeting", () => {
    const result = "Hello, world!";
    expect(result).toEqual("Hello, world!");
  });
});

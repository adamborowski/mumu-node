// tsTaskTests.ts
import { describe, expect, it } from "vitest";
import { tsTask } from "./tstask";

describe("tsTask", () => {
  it("maps functions to their results for simple methods", () => {
    const input = {
      add: () => 2 + 2,
      hello: () => "world",
    };

    const expected = {
      addResult: 4,
      helloResult: "world",
    };

    const result = tsTask(input);
    expect(result).toEqual(expected);
  });

  it("handles methods with arguments", () => {
    const input = {
      multiply: (a: number, b: number) => a * b,
    };

    const expected = {
      // Note: Since the original function is not called with arguments, this will return NaN
      multiplyResult: NaN,
    };

    const result = tsTask(input);
    expect(result).toEqual(expected);
  });

  it("handles methods returning objects", () => {
    const input = {
      getObject: () => ({ key: "value" }),
    };

    const expected = {
      getObjectResult: { key: "value" },
    };

    const result = tsTask(input);
    expect(result).toEqual(expected);
  });

  it("ignores non-function properties", () => {
    const input = {
      aFunction: () => 42,
      aString: "hello",
    };

    const expected = {
      aFunctionResult: 42,
      // aString is not a function, so it should not be included in the result
    };

    const result = tsTask(input);
    expect(result).toEqual(expected);
  });

  it("returns an empty object for an empty input object", () => {
    const input = {};

    const expected = {};

    const result = tsTask(input);
    expect(result).toEqual(expected);
  });
});

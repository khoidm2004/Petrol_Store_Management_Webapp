import { describe, test, expect } from "@jest/globals";
import { timeConverter } from "../../src/utils/timeConverter";

describe("utils/timeConverter", () => {
  test("1.should return correct date and time", () => {
    const input = 1627845593000;
    const result = timeConverter(input);
    expect(result).toEqual({ date: "8/2/2021", time: "2:19:53 AM" });
  });

  test("2.should return message when inserting invalid input length", () => {
    const input = 6782;
    const result = timeConverter(input);
    expect(result).toEqual({
      Title: "Error",
      Message: "Invalid timestamp",
      Status: "error",
    });
  });

  test("3.should return message when inserting invalid input type", () => {
    const input = "Invalid";
    const result = timeConverter(input);
    expect(result).toEqual({
      Title: "Error",
      Message: "Invalid timestamp",
      Status: "error",
    });
  });
});

import { describe, test, expect } from "@jest/globals";
import { timeAgo } from "../../src/utils/timeAgo";

describe("utils/timeAgo", () => {
  test("1.should return minutes if time is less than a hour", () => {
    const timestamp = Date.now() - 300000; // 5m
    const result = timeAgo(timestamp);
    expect(result).toBe("5m");
  });

  test("2.should return hours if time is more than a hour", () => {
    const hour = 1000 * 60 * 60 * 2; //2h
    const timestamp = Date.now() - hour;
    const result = timeAgo(timestamp);
    expect(result).toBe("2h");
  });

  test("3.should return it as string", () => {
    const hour = 1000 * 60 * 60 * 7;
    const timestamp = timeAgo(hour);
    expect(typeof timestamp).toBe("string");
  });

  test("4.should return a string which starts with a number and ends with h or m", () => {
    const now = Date.now();

    //Test for minutes
    const fiveMinAgo = now - 300000; // 5m
    const resultMin = timeAgo(fiveMinAgo);
    expect(resultMin).toMatch(/^\d+m$/);

    //Test for hours
    const twoHourAgo = now - 7200000; // 2h
    const resultHour = timeAgo(twoHourAgo);
    expect(resultHour).toMatch(/^\d+h$/);
  });
});

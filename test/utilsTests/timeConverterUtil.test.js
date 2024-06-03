import { expect } from "chai";
import { timeConverter } from "../../src/utils/timeConverter.js";

describe("utils/timeConverter", () => {
  it("1.should return minutes if time is less than a hour", () => {
    const timestamp = Date.now() - 300000; // 5m
    const result = timeConverter(timestamp);
    expect(result).to.equal("5m");
  });

  it("2.should return hours if time is more than a hour", () => {
    const hour = 1000 * 60 * 60 * 2; //2h
    const timestamp = Date.now() - hour;
    const result = timeConverter(timestamp);
    expect(result).to.equal("2h");
  });

  it("3.should return it as string", () => {
    const hour = 1000 * 60 * 60 * 7;
    const timestamp = timeConverter(hour);
    expect(typeof timestamp).to.equal("string");
  });

  it("4.should return a string which starts with a number and ends with h or m", () => {
    const now = Date.now();

    //Test for minutes
    const fiveMinAgo = now - 300000; // 5m
    const resultMin = timeConverter(fiveMinAgo);
    expect(resultMin).to.match(
      /^\d+m$/,
      'The result for minutes should match the pattern of number followed by "m"'
    );

    //Test for hours
    const twoHourAgo = now - 7200000; // 2h
    const resultHour = timeConverter(twoHourAgo);
    expect(resultHour).to.match(
      /^\d+h$/,
      'The result for minutes should match the pattern of number followed by "h"'
    );
  });
});

/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import useFetchLog from "../../src/hooks/FetchHooks/useFetchLog";
import { firestore } from "../../src/firebase/firebase";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  query: jest.fn(),
}));

describe("hooks/useFetchLog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("1.should fetch log data and return log list", async () => {
    const logCollection = "mockCollection";
    const qLog = "mockQuery";
    const mockOrderBy = "mockOrderBy";
    const mockLimit = "mockLimit";
    const logSnapshot = {
      docs: [
        {
          id: "logId1",
          data: () => ({ startTime: 1718698784201 }),
        },
        {
          id: "logId2",
          data: () => ({ startTime: 1718698784862 }),
        },
      ],
    };

    collection.mockReturnValueOnce(logCollection);
    orderBy.mockReturnValueOnce(mockOrderBy);
    limit.mockReturnValueOnce(mockLimit);
    query.mockReturnValueOnce(qLog);
    getDocs.mockResolvedValueOnce(logSnapshot);

    const result = await useFetchLog(2);

    expect(collection).toHaveBeenCalledWith(firestore, "log");
    expect(orderBy).toHaveBeenCalledWith("startTime", "desc");
    expect(limit).toHaveBeenCalledWith(2);
    expect(query).toHaveBeenCalledWith(logCollection, mockOrderBy, mockLimit);
    expect(getDocs).toHaveBeenCalledWith(qLog);
    expect(result).toEqual([
      {
        logId: "logId1",
        startTime: 1718698784201,
      },
      {
        logId: "logId2",
        startTime: 1718698784862,
      },
    ]);
  });

  it("2.should return error message if fetching log data fails", async () => {
    const errorMessage = "Failed to fetch log data";
    getDocs.mockRejectedValueOnce(new Error(errorMessage));

    const result = await useFetchLog(2);

    expect(collection).toHaveBeenCalledWith(firestore, "log");
    expect(orderBy).toHaveBeenCalledWith("startTime", "desc");
    expect(limit).toHaveBeenCalledWith(2);
    expect(query).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(getDocs).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      Title: "Error",
      Message: errorMessage,
      Status: "error",
    });
  });
});

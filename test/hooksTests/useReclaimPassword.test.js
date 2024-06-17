/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect, afterEach } from "@jest/globals";
import { sendPasswordResetEmail } from "firebase/auth";
import useReclaimPassword from "../../src/hooks/useReclaimPassword";
import { auth } from "../../src/firebase/firebase";

jest.mock("firebase/auth", () => ({
  sendPasswordResetEmail: jest.fn(),
  getAuth: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe("useReclaimPassword hook", () => {
  it("1.should send password reset email and return success message", async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();

    const result = await useReclaimPassword("test@example.com");

    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      auth,
      "test@example.com"
    );
    expect(result).toEqual({
      Title: "Success",
      Message: "Password reset email sent",
      Status: "success",
    });
  });

  it("2.should return error message if password reset email fails", async () => {
    const errorCode = "undefined";
    const errorMessage = "Email not found";
    sendPasswordResetEmail.mockRejectedValueOnce(new Error(errorMessage));

    const result = await useReclaimPassword("test@example.com");

    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      auth,
      "test@example.com"
    );
    expect(result).toEqual({
      Title: "Error",
      Message: `Error Code:${errorCode} (${errorMessage})`,
      Status: "error",
    });
  });
});

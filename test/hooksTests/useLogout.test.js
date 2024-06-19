/**
 * @jest-environment jsdom
 */

import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { renderHook, act } from "@testing-library/react-hooks";
import useLogout from "../../src/hooks/useLogout";
import useAuthStore from "../../src/store/authStore";
import { useSignOut } from "react-firebase-hooks/auth";

jest.mock("../../src/store/authStore.js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("react-firebase-hooks/auth", () => ({
  useSignOut: jest.fn(),
}));

jest.mock("../../src/firebase/firebase.js", () => ({
  auth: jest.fn(),
}));

describe("hooks/useLogout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorage = {
      removeItem: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("1.should successfully logout user", async () => {
    const signOutMock = jest.fn().mockResolvedValue();
    const logoutUserMock = jest.fn();

    useSignOut.mockReturnValue([signOutMock, false, null]);

    Object.defineProperty(global, "localStorage", {
      value: {
        removeItem: jest.fn(),
      },
      writable: true,
    });

    useAuthStore.mockImplementation((selector) =>
      selector({ logout: logoutUserMock })
    );

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.handleLogout();
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(global.localStorage.removeItem).toHaveBeenCalledWith("user-info");
    expect(logoutUserMock).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoggingOut).toBe(false);
  });

  it("2.should handle error during logout", async () => {
    const errorMessage = "Error";
    const signOutMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    const logoutUserMock = jest.fn();

    useSignOut.mockReturnValue([signOutMock, false, null]);

    useAuthStore.mockImplementation((selector) =>
      selector({ logout: logoutUserMock })
    );

    const { result } = renderHook(() => useLogout());

    let response;
    await act(async () => {
      response = await result.current.handleLogout();
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(global.localStorage.removeItem).not.toHaveBeenCalled();
    expect(logoutUserMock).not.toHaveBeenCalled();
    expect(response).toEqual({
      Title: "Error",
      Message: expect.anything(),
      Status: "error",
    });
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoggingOut).toBe(false);
  });
});

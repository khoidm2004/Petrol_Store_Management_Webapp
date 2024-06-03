import { describe, jest, test, expect } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { useToast } from "@chakra-ui/react";
import useShowToast from "../../src/hooks/useShowToast";

jest.mock("@chakra-ui/react", () => ({
  useToast: jest.fn(),
}));

describe("hooks/useShowToast", () => {
  test("1.should call showToast with correct arguments", () => {
    const toastMock = jest.fn();
    useToast.mockImplementation(() => toastMock);

    const { result } = renderHook(() => useShowToast());
    const showToast = result.current;
    showToast("Success", "Testing", "success");

    expect(toastMock).toBeCalledTimes(1);
    expect(toastMock).toBeCalledWith({
      title: "Success",
      description: "Testing",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  });

  test("2.should return multiple times", () => {
    const toastMock = jest.fn();
    useToast.mockImplementation(() => toastMock);

    const { result } = renderHook(() => useShowToast());
    const showToast = result.current;
    showToast("Error", "Testing", "error");
    showToast("Success", "Testing1", "success");
    showToast("Info", "Testing2", "info");
    showToast("Warning", "Testing3", "warning");

    expect(toastMock).toBeCalledTimes(4);
  });
});

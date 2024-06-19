/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect } from "@jest/globals";
import { renderHook } from "@testing-library/react-hooks";
import { act } from "react";
import usePreviewImage from "../../src/hooks/usePreviewImage";

describe("hooks/usePreviewImage", () => {
  it("1.should initialize with no selected file", () => {
    const { result } = renderHook(() => usePreviewImage());

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("2.should handle valid image file change", async () => {
    const { result } = renderHook(() => usePreviewImage());

    const mockFile = new File(["test content"], "Test.png", {
      type: "image/png",
    });

    const event = {
      target: {
        files: [mockFile],
      },
    };

    const fileReaderSpy = jest
      .spyOn(global, "FileReader")
      .mockImplementation(() => ({
        readAsDataURL: jest.fn(function () {
          this.onloadend();
        }),
        result: "data/image/png;base64,testcontent",
        onloadend: jest.fn(),
      }));

    await act(async () => {
      result.current.handleImageChange(event);
    });

    expect(result.current.selectedFile).toBe(
      "data/image/png;base64,testcontent"
    );
    expect(result.current.error).toBeNull();
    fileReaderSpy.mockRestore();
  });

  it("3.should handle file size validation", () => {
    const { result } = renderHook(() => usePreviewImage());

    const largeFile = new File(["large content"], "large.png", {
      type: "image/png",
    });

    Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1014 });

    const event = {
      target: {
        files: [largeFile],
      },
    };

    act(() => {
      result.current.handleImageChange(event);
    });

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.error).toEqual({
      Title: "Error",
      Message: "File size must be less than 2MB",
      Status: "error",
    });
  });

  it("4.should handle non-image file", () => {
    const { result } = renderHook(() => usePreviewImage());

    const textFile = new File(["text content"], "Test.txt", {
      type: "text/plain",
    });

    const event = {
      target: {
        files: [textFile],
      },
    };

    act(() => {
      result.current.handleImageChange(event);
    });

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

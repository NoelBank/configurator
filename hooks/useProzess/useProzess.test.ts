/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import useProzess from "./useProzess";

xdescribe("useProzess", () => {
  test("should increment counter", () => {
    const { result } = renderHook(() =>
      useProzess({ config: "Config", initialState: 0, name: "test" })
    );

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
  });
});

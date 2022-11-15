/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import useProzess from "./useProzess";
import { describe, expect, test } from "@jest/globals";
import { useAtom } from "jotai";
import { atomWithReducer } from "jotai/utils";

const reducer = (state: number, action?: "INCREASE" | "DECREASE") => {
  switch (action) {
    case "INCREASE":
      return state + 1;
    case "DECREASE":
      return state - 1;
    case undefined:
      return state;
  }
};
export const countAtom = atomWithReducer(0, reducer);

describe("useProzess", () => {
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

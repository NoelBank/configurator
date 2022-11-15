/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import POWER_GAS_CONFIG from "../../configs/PowerGas.prozess";
import useProzess from "./useProzess";

describe("useProzess", () => {
  test("should create a prozess", () => {
    const { result } = renderHook(() =>
      useProzess({
        config: POWER_GAS_CONFIG,
        initialState: {},
        name: "power-gas-configurator",
      })
    );

    expect(result.current).toBeDefined();
  });
});

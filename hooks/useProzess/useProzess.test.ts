/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import POWER_GAS_CONFIG from "../../configs/PowerGas.prozess";
import useProzess from "./useProzess";

describe("prozess", () => {
  describe("when created", () => {
    it("should throw error if no prozess is started", () => {
      const { result } = renderHook(() =>
        useProzess({
          config: POWER_GAS_CONFIG,
          initialState: {},
          name: "power-gas-configurator",
        })
      );

      expect(result.current.currentStep).toBeUndefined();
    });

    it("should start the prozess", () => {
      const { result } = renderHook(() =>
        useProzess({
          config: POWER_GAS_CONFIG,
          initialState: {},
          name: "power-gas-configurator",
        })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.currentStep).toBeDefined();
    });
  });
});

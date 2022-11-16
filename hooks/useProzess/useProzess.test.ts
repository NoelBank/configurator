/** @jest-environment jsdom */
import { renderHook, act } from "@testing-library/react";
import POWER_GAS_CONFIG, {
  PowerGasContext,
} from "../../configs/PowerGas.prozess";
import useProzess from "./useProzess";

describe("prozess", () => {
  describe("when created", () => {
    it("should throw error if no prozess is started", () => {
      const { result } = renderHook(() =>
        useProzess({
          configuration: POWER_GAS_CONFIG,
          name: "power-gas-configurator",
        })
      );

      expect(result.current.currentStep).toBeUndefined();
    });

    it("should start the prozess", () => {
      const { result } = renderHook(() =>
        useProzess({
          configuration: POWER_GAS_CONFIG,
          name: "power-gas-configurator",
        })
      );

      act(() => {
        result.current.start();
      });
      expect(result.current.currentStep).toBeDefined();
    });

    it("should start the prozess with initial context", () => {
      const { result } = renderHook(() =>
        useProzess({
          configuration: POWER_GAS_CONFIG,
          name: "power-gas-configurator",
        })
      );

      act(() => {
        result.current.start();
      });

      act(() => {
        result.current.submitStep("address", {
          city: "Berlin",
          number: "1",
          street: "Teststreet",
          zipCode: "12345",
        });

        result.current.submitStep("gasConsumption", 1000);

        result.current.submitStep("powerConsumption", null);

        result.current.goToNextStep();
      });

      expect(result.current.currentStep).toEqual("gas-tariff");
    });
  });
});

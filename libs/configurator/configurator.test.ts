import { describe, expect, test } from "@jest/globals";
import configuration from "../../configs/power-gas";
import Configurator from "./configurator";

const configuratorOptions = {
  initialState: {
    address: undefined,
    gasConsumption: undefined,
    powerConsumption: undefined,
  },
};

describe("Power-Gas Configurator", () => {
  test("start configurator", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    expect(configurator.currentStep?.id).toBe("gatekeeper");
  });

  test("fill gatekeeper and go to power step", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");
  });

  test("fill gatekeeper and go to gas step", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 0);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("gas");
  });

  test("fill gas and open crossssssselling to get back to power", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 0);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("gas");

    configurator.submitQuestion("gasTariff", "basic");

    configurator.submitQuestion("powerConsumption", 1000);

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.submitQuestion("powerTariff", "basic");
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("result");
  });

  test("get back to gatekeeper", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 0);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.previousStep();

    expect(configurator.currentStep?.id).toBe("gatekeeper");
  });

  test("finish after final step", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 0);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.submitQuestion("powerTariff", "basic");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("result");
  });

  test("finish configurator but with twist", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.submitQuestion("powerTariff", "basic");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("gas");

    configurator.submitQuestion("gasTariff", "basic");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("result");

    configurator.previousStep();
    expect(configurator.currentStep?.id).toBe("gas");

    configurator.nextStep();
    expect(configurator.currentStep?.id).toBe("result");
  });

  test("get configurator data", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.submitQuestion("powerTariff", "basic");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("gas");

    configurator.submitQuestion("gasTariff", "basic");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("result");

    expect(configurator.context.state).toEqual({
      address: {
        city: "Teststadt",
        number: "1",
        street: "Teststraße",
        zip: "12345",
      },
      gasConsumption: 1000,
      gasTariff: "basic",
      powerConsumption: 1000,
      powerTariff: "basic",
    });
  });

  test("dont go in next step if data is missing", () => {
    const configurator = new Configurator(
      "power-gas",
      configuration,
      configuratorOptions
    );

    configurator.start();

    configurator.submitQuestion("address", {
      street: "Teststraße",
      number: "1",
      zip: "12345",
      city: "Teststadt",
    });
    configurator.submitQuestion("powerConsumption", 1000);
    configurator.submitQuestion("gasConsumption", 1000);
    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");

    configurator.nextStep();

    expect(configurator.currentStep?.id).toBe("power");
  });
});

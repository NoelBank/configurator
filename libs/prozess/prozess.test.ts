import { describe, expect, it } from "@jest/globals";
import POWER_GAS_CONFIG from "../../configs/PowerGas.prozess";
import { Prozess } from "./prozess";

export default {};

describe("prozess", () => {
  describe("when created", () => {
    it("shouldn't have a step when created", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);

      expect(configurator.currentStep).toBeUndefined();
    });
  });

  describe("when uninitialized", () => {
    it("shouldn't have data", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      expect(configurator.data).toBeDefined();
      expect(configurator.data).toEqual({});
    });
  });

  describe("when started", () => {
    it("should be in the first step", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      expect(configurator.currentStep).toBeDefined();
      expect(configurator.currentStep).toEqual(POWER_GAS_CONFIG[0].id);
    });

    it("should throw when going back", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      expect(configurator.previous).toThrow();
    });
  });

  describe("when submitting data", () => {
    it("should set the data", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      configurator.submit("address", {
        city: "Hannover",
        number: "4",
        street: "Hanomaghof",
        zipCode: "30449",
      });

      expect(configurator.data.address).toBeDefined();
      expect(configurator.data.address).toEqual({
        city: "Hannover",
        number: "4",
        street: "Hanomaghof",
        zipCode: "30449",
      });
    });

    it("shouldn't set any other data", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      configurator.submit("address", {
        city: "Hannover",
        number: "4",
        street: "Hanomaghof",
        zipCode: "30449",
      });

      expect(configurator.data.gasConsumption).toBeUndefined();
      expect(configurator.data.powerConsumption).toBeUndefined();
    });

    it("shouldn't change the step", () => {
      const configurator = new Prozess(POWER_GAS_CONFIG);
      configurator.start();

      expect(configurator.currentStep).toEqual(POWER_GAS_CONFIG[0].id);

      configurator.submit("address", {
        city: "Hannover",
        number: "4",
        street: "Hanomaghof",
        zipCode: "30449",
      });

      expect(configurator.currentStep).toEqual(POWER_GAS_CONFIG[0].id);
    });
  });

  // test("fill gatekeeper and go to power step", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");
  // });

  // test("fill gatekeeper and go to gas step", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 0);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("gas");
  // });

  // test("fill gas and open crossssssselling to get back to power", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 0);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("gas");

  //   configurator.submitQuestion("gasTariff", "basic");

  //   configurator.submitQuestion("powerConsumption", 1000);

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.submitQuestion("powerTariff", "basic");
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("result");
  // });

  // test("get back to gatekeeper", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 0);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.previousStep();

  //   expect(configurator.currentStep?.id).toBe("gatekeeper");
  // });

  // test("finish after final step", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 0);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.submitQuestion("powerTariff", "basic");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("result");
  // });

  // test("finish configurator but with twist", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.submitQuestion("powerTariff", "basic");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("gas");

  //   configurator.submitQuestion("gasTariff", "basic");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("result");

  //   configurator.previousStep();
  //   expect(configurator.currentStep?.id).toBe("gas");

  //   configurator.nextStep();
  //   expect(configurator.currentStep?.id).toBe("result");
  // });

  // test("get configurator data", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.submitQuestion("powerTariff", "basic");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("gas");

  //   configurator.submitQuestion("gasTariff", "basic");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("result");

  //   expect(configurator.context.state).toEqual({
  //     address: {
  //       city: "Teststadt",
  //       number: "1",
  //       street: "Teststraße",
  //       zip: "12345",
  //     },
  //     gasConsumption: 1000,
  //     gasTariff: "basic",
  //     powerConsumption: 1000,
  //     powerTariff: "basic",
  //   });
  // });

  // test("dont go in next step if data is missing", () => {
  //   const configurator = new Configurator(
  //     "power-gas",
  //     configuration,
  //     configuratorOptions
  //   );

  //   configurator.start();

  //   configurator.submitQuestion("address", {
  //     street: "Teststraße",
  //     number: "1",
  //     zip: "12345",
  //     city: "Teststadt",
  //   });
  //   configurator.submitQuestion("powerConsumption", 1000);
  //   configurator.submitQuestion("gasConsumption", 1000);
  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");

  //   configurator.nextStep();

  //   expect(configurator.currentStep?.id).toBe("power");
  // });
});

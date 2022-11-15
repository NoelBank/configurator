import { Configuration } from "../libs/prozess/types";

type Address = {
  street: string;
  number: string;
  zipCode: string;
  city: string;
};

type PowerGasContext = {
  address?: Address;
  gasConsumption?: number | null;
  gasTariff?: string;
  powerConsumption?: number | null;
  powerTariff?: string;
};

const POWER_GAS_CONFIG: Configuration<PowerGasContext> = [
  {
    id: "gatekeeper",
    path: "/ihre-angaben",
    fields: [
      {
        id: "address",
      },
      {
        id: "powerConsumption",
      },
      {
        id: "gasConsumption",
      },
    ],
    isValid: (context, markAsInvalid) => {
      const isValid =
        context.powerConsumption !== null || context.gasConsumption !== null;

      !isValid && markAsInvalid("gasConsumption", "powerConsumption");
      return isValid;
    },
  },
  {
    id: "power-tariff",
    path: "/power-tariff",
    fields: [
      {
        id: "powerTariff",
        isAvailable: (context) => (context.powerConsumption ?? 0) > 0,
      },
    ],
  },
  {
    id: "gas-tariff",
    path: "/gas-tariff",
    fields: [
      {
        id: "gasTariff",
        isAvailable: (context) => (context.gasConsumption ?? 0) > 0,
      },
    ],
  },
  {
    id: "result",
    path: "/abschluss",
  },
];

export default POWER_GAS_CONFIG;

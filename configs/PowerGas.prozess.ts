import { Configuration } from "../libs/prozess/types";

type Address = {
  street: string;
  number: string;
  zipCode: string;
  city: string;
};

type PowerGasContext = {
  address?: Address;
  gasConsumption?: number;
  powerConsumption?: number;
  powerTariff?: string;
  gasTariff?: string;
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
  },
  {
    id: "power",
    path: "/strom",
    fields: [
      {
        id: "powerTariff",
        isAvailable: (context) => context.powerConsumption !== 0,
      },
    ],
  },
  {
    id: "gas",
    path: "/gas",
    fields: [
      {
        id: "gasTariff",
        isAvailable: (context) => context.gasConsumption !== 0,
      },
    ],
  },
  {
    id: "result",
    path: "/abschluss",
  },
];

export default POWER_GAS_CONFIG;

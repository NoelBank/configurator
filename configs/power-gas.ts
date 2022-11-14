import { Step } from "../libs/configurator/types";

type Address = {
  street: string;
  number: string;
  zip: string;
  city: string;
};

type PowerGasState = {
  address?: Address;
  gasConsumption?: number;
  powerConsumption?: number;
  powerTariff?: string;
  gasTariff?: string;
};

// add injection to the configuration
// add emob question ...

const configuration: Step<PowerGasState>[] = [
  {
    id: "gatekeeper",
    path: "/ihre-angaben",
    questions: [
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
    questions: [
      {
        id: "powerTariff",
        isRequired: (state) => state.powerConsumption !== 0,
      },
    ],
  },
  {
    id: "gas",
    path: "/gas",
    questions: [
      {
        id: "gasTariff",
        isRequired: (state) => state.gasConsumption !== 0,
      },
    ],
  },
  {
    id: "result",
    path: "/abschluss",
  },
];

export default configuration;

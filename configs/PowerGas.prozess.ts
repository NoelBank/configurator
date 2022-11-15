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
};

const POWER_GAS_CONFIG: Configuration<PowerGasContext> = [
  {
    id: "gatekeeper",
    path: "/gatekeeper",
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
];

export default POWER_GAS_CONFIG;

import { Configuration } from "../../libs/prozess/types";

export type UseProzessOptions<State> = {
  /**
   * The name of the prozess. This is used to identify the prozess in the
   * logs and the Store.
   */
  name: string;

  /**
   * Define Steps with Fields and their constraints.
   */
  config: Configuration<State>;

  /**
   * The initial state of the prozess. This is used to reset the prozess.
   */
  initialState: State;
};

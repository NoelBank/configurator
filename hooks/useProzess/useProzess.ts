import { UseProzessOptions } from "./types";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Prozess } from "../../libs/prozess/prozess";

const useProzess = <State>({
  config,
  initialState,
  name,
}: UseProzessOptions<State>) => {
  const prozessAtom = atomWithStorage(name, initialState);

  // const [data, setData] = useAtom(prozessAtom);

  const prozess = new Prozess(config, initialState);

  const startProzess = () => {
    prozess.start();
  };

  startProzess();

  return {};
};

export default useProzess;

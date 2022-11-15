import { UseProzessOptions } from "./types";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const useProzess = <State>({
  config,
  initialState,
  name,
}: UseProzessOptions<State>) => {
  const prozessAtom = atomWithStorage<State>(name, initialState);

  const [state, setState] = useAtom(prozessAtom);
};

export default useProzess;

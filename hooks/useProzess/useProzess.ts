import { UseProzessOptions } from "./types";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const useProzess = <State>({
  config,
  initialState,
  name,
}: UseProzessOptions<State>) => {
  const prozessAtom = atomWithStorage<State>(name, initialState);
  const [state, setState] = useAtom(prozessAtom);

  return [state, setState] as const;
};

export default useProzess;

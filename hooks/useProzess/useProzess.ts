import { UseProzessOptions } from "./types";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Prozess } from "../../libs/prozess/prozess";
import React from "react";

const useProzess = <State>({
  config,
  initialState,
  name,
}: UseProzessOptions<State>) => {
  const prozess = new Prozess(config, initialState);

  return prozess;
};

export default useProzess;

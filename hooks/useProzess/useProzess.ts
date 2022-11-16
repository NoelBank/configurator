import { UseProzessOptions } from "./types";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Prozess } from "../../libs/prozess/prozess";
import React from "react";

const currentStepAtom = atomWithStorage<string | undefined>(
  "currentStep",
  undefined
);

const useProzess = <State>({
  initialContext,
  configuration,
  name,
}: UseProzessOptions<State>) => {
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);

  const prozess = React.useMemo(
    () => new Prozess<State>(configuration, initialContext),
    [configuration, initialContext]
  );

  const goToStep = React.useCallback(
    (step: string) => {
      setCurrentStep(step);
    },
    [setCurrentStep]
  );

  const goToNextStep = React.useCallback(() => {
    const nextStep = prozess.next();

    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  }, [prozess, setCurrentStep]);

  const goToPreviousStep = React.useCallback(() => {
    const previousStep = prozess.previous();

    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  }, [prozess, setCurrentStep]);

  const start = React.useCallback(() => {
    prozess.start();

    setCurrentStep(prozess.currentStep);
  }, [prozess]);

  const submitStep = React.useCallback(
    (field: keyof State, data: State[keyof State]) => {
      prozess.submit(field, data);
    },
    [prozess]
  );

  return {
    currentStep,
    start,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    submitStep,
  };
};

export default useProzess;

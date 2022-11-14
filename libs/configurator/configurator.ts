import { Context, Step, Question } from "./types";

class Configurator<TContext extends Context> {
  private history: string[] = [];
  private state: TContext;
  private questions: { [key: string]: Question<TContext> } = {};

  constructor(
    public id: string,
    private steps: Step<TContext>[],
    private options: {
      initialState: TContext;
    }
  ) {
    this.state = options.initialState;

    for (const step of steps) {
      for (const question of step.questions || []) {
        this.questions[question.id] = question;
      }
    }
  }

  public get currentStep() {
    return this.steps.find(
      (step) => step.id === this.history[this.history.length - 1]
    );
  }

  public submitQuestion(questionId: string, data: any) {
    const question = this.questions[questionId];

    if (!question) {
      return;
    }

    if (question.onSubmit !== undefined) {
      this.state = question.onSubmit(this.state, data);
    } else {
      this.state = {
        ...this.state,
        [questionId]: data,
      };
    }
  }

  public nextStep() {
    for (const step of this.steps) {
      for (const question of step.questions || []) {
        if (
          (question.isRequired ? question.isRequired(this.state) : true) &&
          this.state[question.id] === undefined
        ) {
          this.goToStep(step.id);
          return;
        }
      }

      if (!step.questions?.length) {
        !this.history.includes(step.id) && this.goToStep(step.id);
        return;
      }
    }
  }

  public previousStep() {
    const previousStepId = this.history[this.history.length - 2];

    if (!this.currentStep?.questions?.length) {
      this.history.pop();
    }

    this.goToStep(previousStepId);
  }

  public goToStep(absoluteStepId: string) {
    this.history.push(absoluteStepId);
  }

  public reset() {
    this.state = this.options.initialState;
    this.history = [];
    this.start();
  }

  public start() {
    this.nextStep();
  }

  public get context() {
    return {
      state: this.state,
      history: this.history,
    };
  }

  public recover(state: TContext, history: string[]) {
    this.state = state;
    this.history = history;
  }

  private cleanup() {
    throw new Error("Not implemented");
  }
}

export default Configurator;

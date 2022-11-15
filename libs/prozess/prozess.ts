import { Configuration } from "./types";

type Field<TContext, TField extends keyof TContext = keyof TContext> = {
  id: TField;
  isAvailable?: (context: TContext) => boolean;
  onSubmit?: (context: TContext, data: TContext[TField]) => TContext;
  optional?: boolean;
};

const DEFAULT_SUBMITTER =
  <TContext, TField extends keyof TContext = keyof TContext>(field: TField) =>
  (context: TContext, data: TContext[TField]) => ({
    ...context,
    [field]: data,
  });

export class Prozess<TContext> {
  private fields: {
    [F in keyof TContext]?: Field<TContext>;
  };
  private context: TContext;
  private history: string[] = [];

  constructor(
    private configuration: Configuration<TContext>,
    initialContext: TContext = {} as TContext
  ) {
    this.context = initialContext;
    this.fields = Object.fromEntries(
      configuration.flatMap(
        (step) =>
          step.fields?.map((field) => [field.id, field as Field<TContext>]) ??
          []
      )
    ) as Partial<Record<keyof TContext, Field<TContext>>>;
  }

  private get currentStatus() {
    if (!this.currentStep) {
      return undefined;
    }

    const fieldsInStep =
      (this.configuration.find((step) => step.id === this.currentStep)
        ?.fields as Field<TContext>[]) ?? [];

    return fieldsInStep.map((field) => [
      field.id,
      field.optional || this.isSet(field.id),
    ]) as [keyof TContext, boolean][];
  }

  public get currentStep() {
    return !this.history.length
      ? undefined
      : this.history[this.history.length - 1];
  }

  public get data() {
    const fieldsToInclude = (
      Object.entries(this.fields) as [keyof TContext, Field<TContext>][]
    )
      .filter(([_id, field]) =>
        field.isAvailable ? field.isAvailable(this.context) : true
      )
      .map(([id]) => id);

    return fieldsToInclude.reduce<Partial<TContext>>(
      (data, fieldId) => ({
        ...data,
        [fieldId]: this.context[fieldId],
      }),
      {}
    );
  }

  private isSet(field: keyof TContext) {
    return field in this.context && this.context[field] !== undefined;
  }

  public navigateTo(step: string) {
    this.history.push(step);
  }

  public next() {
    const invalidFields =
      this.currentStatus?.filter(([_field, isValid]) => !isValid) ?? [];

    if (invalidFields.length) {
      throw invalidFields;
    }

    for (const step of this.configuration) {
      if (!step.fields?.length && !this.history.includes(step.id)) {
        this.navigateTo(step.id);
        return step;
      }

      for (const field of step.fields! as Field<TContext>[]) {
        if (
          field.isAvailable
            ? field.isAvailable(this.context)
            : true && !this.isSet(field.id)
        ) {
          this.navigateTo(step.id);
          return step;
        }
      }
    }
  }

  public previous() {
    if (this.history.length < 2) {
      throw Error("There is no step to go back to.");
    }

    const step = this.configuration.find(
      (step) => step.id === this.history.at(-2)!
    )!;
    !!step.fields?.length && this.history.pop();

    this.navigateTo(step.id);
    return step;
  }

  public start() {
    this.next();
  }

  public submit<TField extends keyof TContext>(
    field: TField,
    data: TContext[TField]
  ) {
    const f = this.fields[field];

    if (!f) {
      return;
    }

    this.context = (f.onSubmit ?? DEFAULT_SUBMITTER(field))(this.context, data);
  }
}

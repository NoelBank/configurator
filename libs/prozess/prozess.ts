import { BaseField, Configuration } from "./types";

const DEFAULT_SUBMITTER =
  <TContext, TField extends keyof TContext = keyof TContext>(field: TField) =>
  (context: TContext, data: TContext[TField]) => ({
    ...context,
    [field]: data,
  });

export class Prozess<TContext> {
  private fields: {
    [F in keyof TContext]?: BaseField<TContext>;
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
          step.fields?.map((field) => [
            field.id,
            field as unknown as BaseField<TContext>,
          ]) ?? []
      )
    ) as Partial<Record<keyof TContext, BaseField<TContext>>>;
  }

  private get currentStatus() {
    if (!this.currentStep) {
      return undefined;
    }

    const fieldsInStep =
      (this.getStep(this.currentStep)!.fields as BaseField<TContext>[]) ?? [];

    return fieldsInStep.map((field) => [field.id, this.isFieldSet(field)]) as [
      keyof TContext,
      boolean
    ][];
  }

  public get currentStep() {
    return !this.history.length
      ? undefined
      : this.history[this.history.length - 1];
  }

  public get data() {
    const fieldsToInclude = (
      Object.entries(this.fields) as [keyof TContext, BaseField<TContext>][]
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

  private getStep(id: string | undefined) {
    return this.configuration.find((step) => step.id === id);
  }

  private isFieldSet(field: BaseField<TContext>) {
    return field.id in this.context && this.context[field.id] !== undefined;
  }

  public navigateTo(step: string) {
    this.history.push(step);
  }

  public next() {
    const nativeInvalidFields =
      this.currentStatus
        ?.filter(([_field, isValid]) => !isValid)
        ?.map(([field]) => field) ?? [];

    const customValidator = this.getStep(this.currentStep)?.isValid;

    if (customValidator) {
      let invalidFields = [...nativeInvalidFields];
      const markAsInvalid = (...fields: (keyof TContext)[]) =>
        invalidFields.push(...fields);
      const isValid = customValidator(this.context, markAsInvalid);

      if (!isValid) {
        throw Array.from(new Set(invalidFields));
      }
    }

    if (nativeInvalidFields.length) {
      throw nativeInvalidFields;
    }

    for (const step of this.configuration) {
      if (!step.fields?.length && !this.history.includes(step.id)) {
        this.navigateTo(step.id);
        return step;
      }

      for (const field of step.fields! as BaseField<TContext>[]) {
        if (
          field.isAvailable
            ? field.isAvailable(this.context)
            : true && !this.isFieldSet(field)
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

    const step = this.getStep(this.history.at(-2)!)!;
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

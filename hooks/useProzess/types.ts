export type Configuration<TContext> = Step<TContext>[];

export type BaseField<
  TContext,
  TField extends keyof TContext = keyof TContext
> = {
  id: TField;
  isAvailable?: (context: TContext) => boolean;
  onSubmit?: (context: TContext, data: TContext[TField]) => TContext;
};

export type Field<
  TContext,
  TField extends keyof TContext = keyof TContext
> = TField extends any ? BaseField<TContext, TField> : never;

export type MarkAsInvalidFn<TContext> = (...fields: (keyof TContext)[]) => void;

export type Step<TContext> = {
  id: string;
  isValid?: (
    context: TContext,
    markAsInvalid: MarkAsInvalidFn<TContext>
  ) => boolean;
  fields?: Field<TContext>[];
  path: string;
};

export type UseProzessOptions<TContext> = {
  /**
   * The name of the prozess. This is used to identify the prozess in the
   * logs and the Store.
   */
  name: string;

  configuration: Configuration<TContext>;

  initialContext?: TContext;
};

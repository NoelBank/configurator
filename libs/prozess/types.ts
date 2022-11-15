export type Configuration<TContext> = Step<TContext>[];

export type Field<
  TContext,
  TField extends keyof TContext = keyof TContext
> = TField extends any
  ? {
      id: TField;
      isAvailable?: (context: TContext) => boolean;
      onSubmit?: (context: TContext, data: TContext[TField]) => TContext;
      optional?: boolean;
    }
  : never;

export type Step<TContext> = {
  id: string;
  path: string;
  fields?: Field<TContext>[];
};

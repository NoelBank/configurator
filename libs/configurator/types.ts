export type Context = { [key: string]: any };

export type Question<
  TContext extends Context,
  TField extends keyof TContext = string
> = {
  id: TField;
  isRequired?: (context: TContext) => boolean;
  onSubmit?: (context: TContext, data: TContext[TField]) => TContext;
};

export type Step<TContext extends Context> = {
  id: string;
  path: string;
  questions?: Question<TContext>[];
};

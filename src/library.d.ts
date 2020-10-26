export function readConfig<
  Config extends Record<string, any>,
  Props extends keyof Config | 'loc' | 'name'
>(
  config: Config,
  properties: Props[],
): Pick<Config & { name: string; loc: Record<string, unknown> }, Props>;

export function throwError(message: string): never;
export function throwTypeError(message: string): never;

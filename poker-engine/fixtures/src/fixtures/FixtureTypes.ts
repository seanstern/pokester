export type Fixture<T> = {
  readonly description: string;
  readonly create: () => T;
};

export type FixtureModule<
  T,
  K extends string | number | symbol = string
> = Record<K, Fixture<T>>;

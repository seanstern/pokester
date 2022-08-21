export type Fixture<T> = {
  readonly description: string;
  readonly create: () => T;
};

export type FixtureModule<T> = {
  [name: string]: Fixture<T>;
};

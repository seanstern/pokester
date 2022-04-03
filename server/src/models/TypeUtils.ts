export type WithkReadonlyProps<T, RO extends keyof T> = Readonly<Pick<T, RO>> &
  Omit<T, RO>;

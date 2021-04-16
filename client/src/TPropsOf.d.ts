import { FC } from 'react';

type TPropsOf<T> = T extends FC<infer R> ? R : never;

export default TPropsOf;

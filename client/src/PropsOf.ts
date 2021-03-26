import { FC } from 'react';

type PropsOf<T> = T extends FC<infer R> ? R : never;

export default PropsOf;

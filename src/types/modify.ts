/**
 * Override some properties of a type.
 * @template T The type to modify.
 * @template R The type to override with.
 * @returns The modified type.
 * @example
 * type A = { a: string; b: number };
 * type B = { a: number };
 * type C = Modify<A, B>; // { a: number; b: number }
 */
export type Modify<T, R> = Omit<T, keyof R> & R;

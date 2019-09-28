import { tuple } from "./tuple";

type F<A, B> = (a: A) => B;

export const arrayMap = <A, B>(f: F<A, B>) => (as: A[]) => as.map(a => f(a));

/**
 * arrayBimap :: (a -> t) -> (a -> u) -> [a] -> [(u, t)]
 * @param f
 */
export const arrayBimap = <A, T>(f: F<A, T>) => <U>(g: F<A, U>) => (as: A[]) =>
  as.map(a => tuple(f(a), g(a)));

/**
 * Value alias used to better clearly indicate when
 * passing `true` to `transactionalStateOf`'s third `isTuple` parameter.
 */
export const IS_TUPLE = true;

/**
 * isArray :: boolean -> t | [t] -> boolean
 *
 * Wrapper around Array.isArray when working with tuple like data structures.
 *
 * @param dataIsTuple - Whether to conside tuple like data or not.
 */
export const isArray = (dataIsTuple: boolean) => <A>(
  data: A | A[]
): data is A[] =>
  Array.isArray(data)
    ? // Continue if data is an array
      dataIsTuple && data.length > 0
      ? // TRUE if we're checking for tuples, data has 1 or more elements, and the first element is also an array
        // FALSE if we're checking for tuples, data has 1 or more elements, and the first element is **NOT** an array (aka data is a tuple)
        Array.isArray(data[0])
      : // TRUE if data has more than zero elements
        true
    : // FALSE if data is not an array to begin with
      false;

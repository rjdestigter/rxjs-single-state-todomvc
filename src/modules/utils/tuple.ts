/**
 * @module utils
 */

import { F } from './types'

/**
 * Tuple. Array with 2 elements.
 */
export type Tuple<A, B> = [A, B]

/**
 * Thruple. Array with 3 elements
 */
export type Thruple<A, B, C> = [A, B, C]

/**
 * ```hs
 * first :: (a, b) -> a
 * ```
 * 
 * @typeparam A The type of the first element in the tuple.
 * @params [a] The tuple
 * @returns The first element in a tuple.
 */
export const first = <A>([a]: [A, any] | readonly [A, any]): A => a;


/**
 * ```hs
 * thirst :: (a, b, c) -> a
 * ```
 * 
 * Returns the first element in a thruple.
 */
export const thirst = <A>([a]: [A, any, any] | readonly [A, any, any]) => a;

/**
 * Returns the second element in a tuple.
 *
 * ```hs
 * second :: ( (a, b) -> b)
 * ```
 */
export const second = <B>([, b]: [any, B] | readonly [any, B]) => b;

/**
 * ```hs
 * threcond :: (a, b, c) -> b
 * ```
 * 
 * Like [[second]]. But for thruples.
 */
export const threcond = <B>([, b]: [any, B, any] | readonly [any, B, any]) => b;

/**
 * ```hs
 * tuple :: a -> b -> (a, b)
 * ```
 * 
 * Create a tuple given two values.
 */
export const tuple = <A, B>(a: A, b: B): Tuple<A, B> => [a, b]

/**
 * ```hs
 * thruple :: a -> b -> c -> (a, b, c)
 * ```
 * 
 * Create a thruple given three values.
 */
export const thruple = <A, B, C>(a: A, b: B, c: C): [A, B, C] => [a, b, c]

/**
 * ```hs
 * applyToSecond :: (a -> b) -> (t, a) -> (t, b)
 * ```
 * 
 * There's gotta be an official name for this.
 * Applies function f to the second element in a tuple.
 * 
 */
export const applyToSecond = <A, B>(f: F<A, B>) => <T>(t: Tuple<T, A>): Tuple<T, B> => tuple(first(t), f(second(t)))

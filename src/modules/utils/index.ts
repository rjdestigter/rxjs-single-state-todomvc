/**
 * @module utils
 */
/**
 * Don't ask. I was experimenting with point-free. Basically:
 * - We get (a, b)
 * - Then apply f((a, b)) wich gives use (a -> c)
 * - and so we apply a to that to return c
 *
 *  fromAandBToC :: ( (a, b) -> a -> c) -> (a, b) -> c
 */
import { first } from './tuple'

export const fromAandBToC = <A, B, C>(f: (ab: [A, B]) => (a: A) => C) => (
  ab: [A, B]
) => f(ab)(first(ab));



export * from './array'
export * from './observable'
export * from './tuple'
export * from './getset'
export * from './assert'
export * from './function'
export * from './types'
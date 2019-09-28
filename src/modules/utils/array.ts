import { tuple } from "."

type F<A, B> = (a: A) => B

export const arrayMap = <A, B>(f: F<A,B>) => (as: A[]) => as.map(a => f(a))

export const arrayBimap = <A, T>(f: F<A, T>) => <U>(g: F<A, U>) => (as: A[]) => as.map(a => tuple(f(a), g(a)))


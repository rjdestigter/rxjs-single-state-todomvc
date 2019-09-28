import { Subject, Observable, merge, of } from "rxjs";
import { startWith, tap, withLatestFrom, map, delay, publish } from "rxjs/operators";
import { FilterType } from "../../apps/todo/types";
import { Todo, TodoOperation } from "../todo/types";
import * as React from "react";

// Types
type F<A, B> = (a: A) => B

type Tuple<A, B> = [A, B]

// Array functions
export const take = (amount: number) => <T>(xs: T[]) => {
  const txs: T[] = [];
  const len = xs.length;

  for (let i = 0; i < len && i < amount; i += 1) {
    txs.push(xs[i]);
  }

  return txs;
};

// Tuple functions

/**
 * Returns the first element in a tuple.
 *
 * first :: ( (a, b) -> a)
 */
export const first = <A>([a]: [A, any] | readonly [A, any]) => a;

export const thirst = <A>([a]: [A, any, any] | readonly [A, any, any]) => a;
/**
 * Returns the second element in a tuple.
 *
 * second :: ( (a, b) -> b)
 */
export const second = <B>([, b]: [any, B] | readonly [any, B]) => b;

export const threcond = <B>([, b]: [any, B, any] | readonly [any, B, any]) => b;

/**
 * 
 * @param a 
 * @param b 
 */
export const tuple = <A, B>(a: A, b: B): Tuple<A, B> => [a, b]

export const thruple = <A, B, C>(a: A, b: B, c: C): [A, B, C] => [a, b, c]

/**
 * 
 * @param f 
 */
export const applyToSecond = <A, B>(f: F<A, B>) => <T>(t: Tuple<T, A>): Tuple<T, B> => tuple(first(t), f(second(t)))

// Compositors for observables
export const mapToAfterMs = <B>(to: B, ms: number = 1000) => <A>(from: A) =>
  merge(of(from), of(to).pipe(delay(ms)));

export const toNullAfterMs = (ms = 1000) => mapToAfterMs(null, ms);



// Assertion functions
export const isNotNull = <T>(value: T | null): value is T => value != null;

export const makeIsFilterType = <T extends FilterType>(of: T) => (
  filterType: FilterType
): filterType is T => filterType === of;

export const isFilterTypeAll = makeIsFilterType(FilterType.All);
export const isFilterTypeCompleted = makeIsFilterType(FilterType.Completed);
export const isFilterTypeActive = makeIsFilterType(FilterType.Active);

// Filter functions
export const makeFilterTodosByFilterType = <T extends FilterType>(
  filterType: FilterType
) => (todos: [Todo, TodoOperation][]) =>
  filterType === FilterType.All
    ? todos
    : todos.filter(
        ([todo]) =>
          (isFilterTypeCompleted(filterType) && todo.completed) ||
          (isFilterTypeActive(filterType) && !todo.completed)
      );

export const filterCompletedTodos = makeFilterTodosByFilterType(
  FilterType.Completed
);
export const filterActiveTodos = makeFilterTodosByFilterType(
  FilterType.Active
);

// Function functions

export const once = <A, B>(f: (a: A) => B) => {
  let output: B | undefined;

  return (a: A) => {
    if (!output) {
      output = f(a);
    }

    return output;
  };
};
/**
 * Identify function
 *
 * identity :: a -> a
 */
export const identity = <T>(value: T) => {
  return value;
};

/**
 * Function composition. f after g. g andThen f
 *
 * compose :: (b -> c) -> (a -> b) -> c
 */
export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) =>
  f(g(a));

/**
 * 
 * @param f 
 */
export const flip = <A, B, C>(f: (a: A, b: B) => C) => (b: B, a: A) => f(a, b)


/**
 * 
 * @param f 
 */
export const curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => f(a, b)

/**
 * Don't ask. I was experimenting with point-free. Basically:
 * - We get (a, b)
 * - Then apply f((a, b)) wich gives use (a -> c)
 * - and so we apply a to that to return c
 *
 *  fromAandBToC :: ( (a, b) -> a -> c) -> (a, b) -> c
 */
export const fromAandBToC = <A, B, C>(f: (ab: [A, B]) => (a: A) => C) => (
  ab: [A, B]
) => f(ab)(first(ab));

// Selectors
export const selectTodoFilter = (filterType: FilterType) =>
  isFilterTypeActive(filterType)
    ? filterActiveTodos
    : isFilterTypeCompleted(filterType)
    ? filterCompletedTodos
    : identity;

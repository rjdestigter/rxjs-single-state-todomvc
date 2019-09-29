import { Observable, BehaviorSubject } from "rxjs";

/**
 * Similar to the what React's `useState` hook returns but for observables.
 * It's a thruple containing:
 *  - 0: A stateful observable  (see RxJS' `BehaviourSubject`)
 *  - 1: A function to update/set the state (`$.next(..)`)
 *  - 2. A get state function. (`$.getValue()`)
 */
export type StateObservable<T, U = T> = readonly [
  Observable<U>,
  (next: T) => void,
  () => T
];

/**
 * Either [[StateObservable]] or [[Observable]]
 */
export type ObservableLike<T> = StateObservable<T> | Observable<T>;

/**
 * ```hs
 * isStateObservable :: ObservableLike a -> boolean
 * ```
 * Determines if the given observable like value is a [[StateObservable]]
 */
export const isStateObservable = <T>(
  observable$: ObservableLike<T>
): observable$ is StateObservable<T> => Array.isArray(observable$);

/**
 * ```hs
 * stateOf :: a -> StateObservable a
 * ```
 * Create a stateful observable. Uses RxJS' `BehaviourSubject` under the hood.
 * 
 * @typeparam T Type describing the type of the data stored.
 * @param initialState Initial state of the observable (see [[BehaviourSubject]])
 */
export const stateOf = <T>(
  initialState: T,
): StateObservable<T> => {
  // Create a new subject that will stream the state
  const subject = new BehaviorSubject<T>(initialState);

  // subject.subscribe(console.error)
  const setState = (state: T) => {
    subject.next(state);
  };

  const getCurrentState = () => subject.getValue();

  return [
    subject.asObservable(),
    setState,
    getCurrentState
  ] as const;
};

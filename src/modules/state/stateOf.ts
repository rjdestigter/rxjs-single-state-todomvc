import { Observable, concat, BehaviorSubject } from "rxjs";
import { identity } from "../utils";

/**
 * Similar to the what React's `useState` hook returns but for observables.
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
 * Determines if the given observable like value is a [[StateObservable]]
 */
export const isStateObservable = <T>(
  observable$: ObservableLike<T>
): observable$ is StateObservable<T> => Array.isArray(observable$);

/**
 * Create a stateful observable
 * 
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

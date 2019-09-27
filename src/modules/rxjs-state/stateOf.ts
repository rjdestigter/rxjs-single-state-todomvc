import { Observable, concat, BehaviorSubject } from "rxjs";
import { identity } from "../utils";

/**
 * Similar to the what React's `useState` hook returns but for observables.
 */
export type StateObservable<T> = readonly [
  Observable<T>,
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
 *
 * @param initialState Initial state of the [[Subject]]
 * @param piper Callback for adding "pipes" aka operators to the subject's output.
 */
export const stateOf = <T>(
  initialState: T,
  piper: (o$: Observable<T>) => Observable<T> = identity
): StateObservable<T> => {
  // Create a new subject that will stream the state
  const subject = new BehaviorSubject<T>(initialState);
  // subject.subscribe(console.error)
  const setState = (state: T) => {
    console.info(`Updating state for ${JSON.stringify(initialState)}`)
    // debugger
    // nextState = state
    subject.next(state);
  };

  const getCurrentState = () => subject.getValue();

  // const nextState$ = of(void 0).pipe(
  //   map(() => nextState)
  // )

  const piped$ = concat(piper(subject.asObservable()));

  // const initialState$ = piped$

  return [
    piped$, // concat(nextState$, piped$),
    setState,
    getCurrentState
  ] as const;
};

Object.assign(window, { stateOf });

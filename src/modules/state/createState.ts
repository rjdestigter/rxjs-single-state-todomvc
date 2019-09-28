import { Observable, combineLatest } from "rxjs";
import { isStateObservable, ObservableLike } from "./stateOf";
import { map, tap, share } from "rxjs/operators";

/**
 * Returns a type describing all keys of object T
 * that are of type V
 */
type KeyOfType<T, V> = {
  [P in keyof T]: T[P] extends V ? P : never;
}[keyof T];

/**
 * Returns a type that makes all values of object T readonly
 * if they belong to keys in type K
 */
type ReadonlyByKey<T extends {}, K extends keyof T> = Readonly<Pick<T, K>> &
  Omit<T, K>;

/**
 * Returns a type that makes all values of object T readonly
 * if they are of type V
 */
type ReadonlyByType<T, V> = ReadonlyByKey<T, KeyOfType<T, V>>;

/**
 * An object representing a map of [[Observable]] or [[StateObserveable]]
 */
type MapOfObservables = {
  [prop: string]: ObservableLike<any>;
};

/**
 * A type representing a map of values based on a map of
 * [[Observable]] or [[StateObservable]] and the values those
 * observable stream.
 *
 * For example
 *
 * ```ts
 * type Foo = MapOfStateFromMapOfObservables<{ bar: Observable<number>>, zax: StateObservable<string> }
 *
 * // equates to
 *
 * type Foo = { readonly bar: number, zax: string }
 * ```
 *
 */
type MapOfStateFromMapOfObservables<T> = {
  [P in keyof T]: T[P] extends ObservableLike<infer B> ? B : never;
};

/**
 * State$ describes an [[Observable]] that emits a state object where
 * key/value pairs created by a sub [[Observable]] are immutable and
 * key/values streamed by a [[StateObservable]] are semi-mutuable in
 * the sense that you can change their value in an mutauble style as
 * a _setter_ has been defined for that key/value pair that will send
 * the assigned value to the StateObservable's [[Subject]]
 *
 */
export type State$<T extends MapOfObservables> = Observable<
  MapOfStateFromMapOfObservables<ReadonlyByType<T, Observable<any>>>
>;

/**
 * Creates a single state observable from a map of [[ObservableLike]]
 */
export const createState = <T extends MapOfObservables>(
  mapOfObservables: T
): State$<T> => {
  // Compile a list of keys that are part of the state object.
  const keys = Object.keys(mapOfObservables);

  // Reduce the list of keys to a list of observables where each observable
  // is a thruple of the key, getter, and setter.
  const observables$: Observable<
    [string, () => any, () => void]
  >[] = keys.reduce(
    (acc, key) => {
      const observable$ = mapOfObservables[key];

      // If the observable is our custom StateObservable
      if (isStateObservable(observable$)) {
        // Destructure the StateObservable into it's actual observabble and dispatcher
        const [state$, setState] = observable$;

        // Map the state$ observable to a thruple of
        // its key, getter, and setter
        const nextState$ = state$.pipe(
          map(state => {
            return [
              // key
              key,
              // getter
              () => state,
              // setter
              (nextState: any) => {
                setState(nextState);
              }
            ];
          })
        );

        // Add the composed state observable to the accumulator.
        acc.push(nextState$);
      }

      // If the observable was just a regular observable
      else {
        const nextState$ = observable$.pipe(
          map(state => {
            // Map the state$ observable to a thruple of
            // its key, getter, and setter
            return [
              // key
              key,
              // getter
              () => state,
              // setter that will log an error message in dev mode
              (value: any) => {
                if (process.env.NODE_ENV === "development") {
                  console.error(
                    `Attempting to mutate state "${key}" with value "${value}" of state with properties ${keys.join(
                      ", "
                    )}`
                  );
                }
              }
            ];
          }),
          tap(_ => console.warn(`Streaming [${key}]`)),

        );

        acc.push(nextState$);
      }
      return acc;
    },
    [] as any[]
  );

  // Combine the list of observables of [key, getter, setter]
  // into a single state observable

  type Key = string;
  type Getter = () => any;
  type Setter = () => void;

  const state$ = combineLatest(...observables$).pipe(
    map((states: [Key, Getter, Setter][]) =>
      states.reduce(
        (acc, [k, g, s]) => {
          // Using Object.defineProperty to preserve the merging
          // of getters and setters
          Object.defineProperty(acc, k, {
            get: g,
            set: s
          });

          return acc;
        },
        {} as any
      )
    ),
    tap(state => console.log('State, state', state)),
    share()
  );

  return state$;
};

import { Observable, combineLatest } from "rxjs";
import { isStateObservable, ObservableLike } from "./stateOf";
import { map, tap, share } from "rxjs/operators";

/**
 * Returns a type describing all keys of object T
 * that are of type V
 * 
 * For example:
 * ```ts
 * type User = { id: number, name: string, age: number }
 * type NumericUserProperties = KeyOfType<User, number> // 'id' | 'age'
 * ```
 */
type KeyOfType<T, V> = {
  [P in keyof T]: T[P] extends V ? P : never;
}[keyof T];

/**
 * Returns a type that makes all values of object T readonly
 * if they belong to keys in type K
 * 
 * For example:
 * ```ts
 * type User = { id: number, name: string, age: number }
 * type UserWithProtectedId = Readonly<User, 'id'>
 * 
 * const user: Readonly<User, 'id'> = { id: 24, name: 'Bob', age: 54 }
 * user.age = 55 // no problem here
 * user.id = 77 // should not compile
 * ```
 */
type ReadonlyByKey<T extends {}, K extends keyof T> = Readonly<Pick<T, K>> &
  Omit<T, K>;

/**
 * Returns a type that makes all values of object T readonly
 * if they are of type V
 * 
 * For example:
 * ```ts
 * type User = { id: number, name: string, age: number }
 * 
 * const user: Readonly<User, number> = { id: 24, name: 'Bob', age: 54 }
 * user.age = 55 // should not compile
 * user.id = 77 // should not compile
 * user.name = "Alice" // no problem here
 * ```
 */
type ReadonlyByType<T, V> = ReadonlyByKey<T, KeyOfType<T, V>>;

/**
 * An object representing a map of [[Observable]] or [[StateObserveable]]
 */
type MapOfObservables = {
  [prop: string]: ObservableLike<any>;
};

/**
 * A type representing an objectc, a map of values, based on a map of
 * [[Observable]] or [[StateObservable]] and the values those
 * observable stream.
 *
 * For example
 *
 * ```ts
 * type State = MapOfStateFromMapOfObservables<{
 *  users: Observable<User[]>>,
 *  active: StateObservable<boolean>
 * }
 *
 * // equates to
 *
 * type State = { readonly users: number, active: boolean }
 * ```
 * 
 * In this example you are building a state object where
 * `state.users` is immutauble and not controlled by the application
 * while `state.active` is a [[StateObservable]] to which you can
 * not only subscribe to get the "next" value of `.active` but also
 * emit to, aka set it's state
 * ```
 *
 */
type MapOfStateFromMapOfObservables<T> = {
  [P in keyof T]: T[P] extends ObservableLike<infer B> ? B : never;
};

/**
 * [[State$]] describes an `Observable` that is the composition of
 * of a map of observables.
 * 
 * See [[MapOfStateFromMapOfObservables]] for more information on
 * the data streamed by this observable.
 *
 */
export type State$<T extends MapOfObservables> = Observable<
  MapOfStateFromMapOfObservables<ReadonlyByType<T, Observable<any>>>
>;

/**
 * ```hs
 * createState :: MapOfObservables t => MapOfObservables t -> State$ t
 * ```
 * 
 * Creates a single state observable from a map of [[ObservableLike]]
 * 
 * The keys of `mapOfObservables` are reduced into an array of thruples
 * where each thruple contains:
 * 0 - The key / property being iterated
 * 1 - A _getter_ function for that property
 * 2 _ A _setter_ function for that property
 * 
 * Since values on the `mapOfObservables` object are either `Obervable` or
 * [[StateObservable]], the thruple created for both differs slightly in
 * that the _setter_ function for `Observables` logs a warning to the
 * console in development mode since data/state for `Obserable`s is considered
 * immutable.
 * 
 * Finally the list of (key, getter, setter) data is reduced into a single object.
 * `Object.defineProperty` is used to decalre `get` and `set` on the accumulated
 * object.
 * 
 * See [[MapOfStateFromMapOfObservables]] for more information on
 * the data streamed by this observable.
 * 
 * TODO I think this can be simplified with less iterations
 * 
 * @param mapOfObservables Map (object) of observables.
 * @returns An observable whos data stream matches the shape of `mapOfObservables`
 * 
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

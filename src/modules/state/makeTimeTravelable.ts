import {
  Observable,
  Subject,
  combineLatest,
  BehaviorSubject,
  of,
  interval,
  EMPTY,
  merge,
  concat
} from "rxjs";
import {
  debounceTime,
  scan,
  startWith,
  map,
  withLatestFrom,
  mergeAll,
  tap,
  delay,
  mergeMap,
  repeat,
  switchMap,
  filter,
  share
} from "rxjs/operators";
import { first, second, tuple } from "../utils";

/**
 * Turns an observable into a time travelable
 * version of itself.
 *
 * It does this by creating a Subject to sink/stream the selected
 * historic index.
 *
 * Then it it creates `stateWithHistory$` which is just using
 * the `scan` operator to keep track of all emitted values.
 *
 * A final `index$` observable is created that only emits
 * index values that are within the bounds of the history
 * array's length.
 *
 * A final `state$` observable is created by combining
 * `index$` and `stateWithHistory$` to either select state
 * from the history array or return the active, current state
 * if the index is `-1`
 *
 * The return value of this function is a thruple of:
 * 0: The final `state$` observable
 * 1: A dispatch function for setting the selected index
 * 2: The `index$` observable emitting both the index and the maximum
 */
export const makeTimeTravelable = <T>(observable$: Observable<T>) => {
  const indexSubject = new BehaviorSubject(-1);
  const startDate = Date.now();

  const stateWithHistory$ = combineLatest(indexSubject, observable$).pipe(
    scan(
      ([state, index, history], [nextIndex, nextState]) => {
        return state !== nextState
          ? ([
              nextState,
              index >= 0 && index + 1 < history.length ? index + 1 : -1,
              state ? [...history, [state, Date.now()]] : []
            ] as [T, number, [T, number][]])
          : ([nextState, nextIndex, history] as [T, number, [T, number][]]);
      },
      [undefined, -1, []] as [T | undefined, number, [T, number][]]
    ),
    map(([state, index, history]) => {
      if (index < 0 || index >= history.length) {
        return [state, history, history.length, history.length] as const;
      }

      return [history[index][0], history, index, history.length] as const;
    }),
    share()
  );

  const playSubject = new Subject<"PLAY" | "PAUSE">();

  const replay$ = playSubject.pipe(
    withLatestFrom(stateWithHistory$),
    switchMap(([mode, s]) => {
      if (mode === "PLAY") {
        return concat(of(s), stateWithHistory$).pipe(
          switchMap(([state, history, index]) => {
            const timeline = state ? [...history, tuple(state, history[history.length - 1][1] + 250)] : history
            const ms = index > 0 && timeline[index + 1]
              ? timeline[index + 1][1] - timeline[index][1]
              : 0;

            return of(void 0).pipe(
              delay(ms > 2500 ? 250 : ms),
              tap(() => setIndex(timeline[index + 1] ? index + 1 : 0))
            );
          })
        );
      }

      return EMPTY;
    })
  );

  const setIndex = (index: number) => {
    console.log(index);
    indexSubject.next(index);
  };

  return [
    merge(replay$, stateWithHistory$).pipe(
      filter(result => !!result)
    ) as typeof stateWithHistory$,
    setIndex,
    indexSubject.asObservable(),
    () => playSubject.next('PLAY'),
    () => playSubject.next('PAUSE')
  ] as const;
};

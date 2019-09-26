import { Observable, Subject, combineLatest } from "rxjs";
import { debounceTime, scan, startWith, map } from "rxjs/operators";

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
  const indexSubject = new Subject<number>();

  const stateWithHistory$ = observable$.pipe(
    // debounceTime(500),
    scan(
      ([state, history], next): readonly [T, T[]] =>
        [next, state ? [...history, state] : []] as const,
      [undefined, []] as readonly [T | undefined, T[]]
    )
  );

  const index$ = combineLatest(
    indexSubject.asObservable().pipe(startWith(-1)),
    stateWithHistory$
  ).pipe(
    map(([index, [, history]]) => {
      if (index < 0) {
        return [-1, history.length] as const;
      } else if (index > history.length - 1) {
        return [history.length - 1, history.length] as const;
      }

      return [index, history.length] as const;
    })
  );

  const state$ = combineLatest(index$, stateWithHistory$).pipe(
    map(([[index, max], [state, history]]) =>
      index > -1 && history[max - index - 1] != null ? history[max - index - 1] : state
    )
  );

  const setIndex = (index: number) => indexSubject.next(index);

  return [state$, setIndex, index$] as const;
};

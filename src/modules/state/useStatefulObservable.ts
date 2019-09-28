import * as React from 'react'

import { StateObservable } from "./stateOf";
import { withLatestFrom, tap, map } from 'rxjs/operators';
import { once, compose, first, second } from '../utils';

export const useStatefulObservable = <T>([
  state$,
  next,
  getState
]: StateObservable<T>) => {
  const [state, setState] = React.useState<T>();

  React.useEffect(() => {
    const final$ = state$.pipe(
      withLatestFrom(state$),
      tap(
        once(
          compose(
            setState,
            second
          )
        )
      ),
      map(first),
      tap(setState)
    );

    const subscription = final$.subscribe();

    return () => subscription.unsubscribe();
  });

  return [state || getState(), (nextState: T) => next(nextState)] as const;
};
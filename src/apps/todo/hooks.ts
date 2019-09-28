import * as React from "react";
import { tap } from "rxjs/operators";

import { dispatchFetch, handleEvents$ } from "../../modules/todo";

import { timeTravelableState$, Observed } from "./state";
import { props$ } from "./select";

export const useTodoProps = () => {
  const [state, setState] = React.useState<{ index: number; max: number }>({
    index: -1,
    max: 0
  });

  const [props, setProps] = React.useState<
    Observed<typeof props$> | undefined
  >();

  React.useEffect(() => {
    const propsSubscription = props$.pipe(tap(setProps)).subscribe();

    const handleEventsSubscription = handleEvents$.subscribe();

    const stateSubscription = timeTravelableState$
      .pipe(
        tap(([, , index, max]) => setState({ index, max })),
      )
      .subscribe();

    dispatchFetch()

    return () => {
      handleEventsSubscription.unsubscribe();
      stateSubscription.unsubscribe();
      propsSubscription.unsubscribe();
    };
  }, []);
  debugger
  return [props, state, setState] as const
};

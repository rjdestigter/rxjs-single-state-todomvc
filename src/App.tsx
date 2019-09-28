import React from "react";
import { noop } from "rxjs";
import { tap } from "rxjs/operators";
import { Slider, IconButton } from "rmwc";

import TodoApp from "./apps/todo/Todo";

// Todo
import {
  dispatch,
  eventsHandler$,
  makeFetchEvent,
} from "./modules/todo";

// Apps
import {
  State,
  timeTravelableState$,
  setIndex,
  _,
  play,
  pause,
  Observed
} from "./apps/todo/state";

import { props$ } from "./apps/todo/select";

const App = () => {
  const [state, setState] = React.useState<{index: number, max: number}>({
    index: -1,
    max: 0
  });

  const [props, setProps] = React.useState<
    Observed<typeof props$> | undefined
  >();

  React.useEffect(() => {
    // const todosSubscription = todosByFilterType$.pipe(tap(setTodos)).subscribe()

    const propsSubscription = props$.pipe(tap(setProps)).subscribe();

    const eventsHandlerSubscription = eventsHandler$.subscribe();

    const stateSubscription = timeTravelableState$
      .pipe(
        tap(([, , index, max]) => setState({ index, max }))
      )
      .subscribe();

    dispatch(makeFetchEvent());

    return () => {
      eventsHandlerSubscription.unsubscribe();
      stateSubscription.unsubscribe();
      propsSubscription.unsubscribe();
    };
  }, []);

  if (props != null) {
    return (
      <>
        <div>
          <div className="todomvc">
            <TodoApp
              todos={props.todos}
              new={props.new}
              onChangeFilterType={
                state.index !== state.max ? noop : props.onChangeFilterType
              }
              onChangeNew={state.index !== state.max ? noop : props.onChangeNew}
              onSubmitNew={state.index !== state.max ? noop : props.onSubmitNew}
              filterType={props.filterType}
              onEdit={state.index !== state.max ? () => noop : props.onEdit}
              onSave={state.index !== state.max ? () => noop : props.onSave}
              onCompleteAll={
                state.index !== state.max ? noop : props.onCompleteAll
              }
              onClearComplete={
                state.index !== state.max ? noop : props.onClearComplete
              }
            />
          </div>
        </div>
        <div>
          <div style={{ padding: 15 }}>
            <Slider
              value={state.index}
              // onChange={evt => setIndex(evt.detail.value)}
              onInput={evt => {
                setIndex(evt.detail.value);
              }}
              discrete
              start={0}
              max={state.max}
              step={1}
            />
            <div className="controls">
              <IconButton
                theme={state.index === 0 ? undefined : "secondary"}
                icon="fast_rewind"
                onClick={() => setIndex(0)}
                disabled={state.index === 0}
              />
              <IconButton
                theme={state.index === 0 ? undefined : "secondary"}
                icon="skip_previous"
                onClick={() => setIndex(state.index - 1)}
                disabled={state.index === 0}
              />
              <IconButton theme="secondary" icon="stop" onClick={pause} />
              <IconButton
                theme="secondary"
                icon="play_circle_filled"
                onClick={play}
              />
              <IconButton
                theme={state.index === state.max ? undefined : "secondary"}
                icon="skip_next"
                onClick={() => setIndex(state.index + 1)}
                disabled={state.index === state.max}
              />
              <IconButton
                theme={state.index === state.max ? undefined : "secondary"}
                icon="fast_forward"
                onClick={() => setIndex(state.max)}
                disabled={state.index === state.max}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return <div>Loading..</div>;
};

export default App;

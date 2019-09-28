import React from "react";

import TodoApp from "./apps/todo/Todo";
import { Slider, IconButton } from "rmwc";

import {
  dispatch,
  newTodoOperation$,
  eventsHandler$
} from "./modules/todo/observables";

import { tap } from "rxjs/operators";

import { todosByFilterType$ } from "./apps/todo/observables";
import { createState, makeTimeTravelable } from "./modules/state";

import { Observable, noop } from "rxjs";
import {
  makeFetchEvent,
  makeSaveEvent,
  makeEditEvent,
  makeDeleteEvent
} from "./modules/todo/events";
import {
  makeNoop,
  toPending,
  isPending,
  isBad,
  isNoop,
  Noop
} from "./modules/operations";
import { TodoOperation, Todo, MutableTodo } from "./modules/todo/types";
import { FilterType, filterTypeState$ } from "./modules/filter-todo";
import { compose, first, second, tuple } from "./modules/utils";

const state$ = createState({
  todos: todosByFilterType$,
  filterType: filterTypeState$,
  new: newTodoOperation$
});

const [timeTravelableState$, setIndex, _, play, pause] = makeTimeTravelable(
  state$
);

type Observed<T> = T extends Observable<infer S> ? S : never;

type State = {
  data: Observed<typeof state$> | undefined;
  index: number;
  max: number;
};

const App = () => {
  console.log("Render App");
  const [state, setState] = React.useState<State>({
    data: undefined,
    index: -1,
    max: 0
  });

  React.useEffect(() => {
    // const todosSubscription = todosByFilterType$.pipe(tap(setTodos)).subscribe()

    const eventsHandlerSubscription = eventsHandler$.subscribe();

    const stateSubscription = timeTravelableState$
      .pipe(
        tap(([state, _, index, max]) => setState({ data: state, index, max })),
        tap(state => Object.assign(window, { state }))
      )
      .subscribe();

    dispatch(makeFetchEvent());

    return () => {
      eventsHandlerSubscription.unsubscribe();
      stateSubscription.unsubscribe();
    };
  }, []);

  const data = state.data;
  if (data != null) {
    const onChangeFilterType = (filterType: FilterType) => {
      data.filterType = filterType;
    };

    const onChangeNew = (title: string) => {
      data.new = makeNoop(title);
    };

    const onSubmitNew = () => {
      if (!isPending(data.new)) data.new = toPending(data.new);
    };

    const onEdit = (todo: Todo, operation: TodoOperation) => (
      state: Partial<Pick<Todo, "completed" | "title">>
    ) => {
      if (isNoop(operation) || isBad(operation)) {
        dispatch(
          makeEditEvent(todo, {
            ...operation,
            state: {
              ...operation.state,
              ...state
            }
          })
        );
      }
    };

    const onSave = (todo: Todo, operation: TodoOperation) => (
      state: Partial<Pick<Todo, "completed" | "title">> = {}
    ) => {
      if (isNoop(operation) || isBad(operation)) {
        dispatch(
          makeSaveEvent(todo, {
            ...operation,
            state: {
              ...operation.state,
              ...state
            }
          })
        );
      }
    };

    const isComplete = (todo: Todo) => todo.completed === true;

    const onCompleteAll = () =>
      data.todos
        .filter(
          compose(
            a => !a,
            compose(
              isComplete,
              first
            )
          )
        )
        .filter(
          (todo): todo is [Todo, Noop<MutableTodo>] =>
            isNoop(second(todo)) || isBad(second(todo))
        )
        .map(todo =>
          tuple(first(todo), {
            ...second(todo),
            state: { ...second(todo).state, completed: true }
          })
        )
        .forEach(todo => dispatch(makeSaveEvent(...todo)));

    const onClearComplete = () => {
      data.todos
        .filter(
          compose(
            isComplete,
            first
          )
        )
        .filter(
          (todo): todo is [Todo, Noop<MutableTodo>] =>
            isNoop(second(todo)) || isBad(second(todo))
        )
        .forEach(([todo]) => dispatch(makeDeleteEvent(todo)));
    };

    return (
      <>
        <div>
          <div className="todomvc">
            <TodoApp
              todos={data.todos}
              new={data.new}
              onChangeFilterType={
                state.index !== state.max ? noop : onChangeFilterType
              }
              onChangeNew={state.index !== state.max ? noop : onChangeNew}
              onSubmitNew={state.index !== state.max ? noop : onSubmitNew}
              filterType={data.filterType}
              onEdit={state.index !== state.max ? () => noop : onEdit}
              onSave={state.index !== state.max ? () => noop : onSave}
              onCompleteAll={state.index !== state.max ? noop : onCompleteAll}
              onClearComplete={
                state.index !== state.max ? noop : onClearComplete
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

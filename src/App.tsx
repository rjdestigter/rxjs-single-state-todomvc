import React from "react";

import TodoApp from "./apps/todo/Todo";
import { Slider } from "rmwc";

import {
  dispatch,
  newTodoOperation$,
  eventsHandler$
} from "./modules/todo/observables";

import { tap, filter } from "rxjs/operators";

import { filterTypeState$, todosByFilterType$ } from "./apps/todo/observables";
import { createState, makeTimeTravelable } from "./modules/rxjs-state";

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
  isOk,
  isBad,
  isNoop
} from "./modules/todo/utils";
import { TodoOperation, Todo, Mutable, Noop } from "./modules/todo/types";
import { FilterType } from "./apps/todo/types";
import { compose, first, second, tuple } from "./modules/utils";

const state$ = createState({
  todos: todosByFilterType$,
  filterType: filterTypeState$,
  new: newTodoOperation$
});

const [timeTravelableState$, setIndex, index$] = makeTimeTravelable(state$);

type Observed<T> = T extends Observable<infer S> ? S : never;

type State = Observed<typeof state$>;

const App = () => {
  console.log("Render App");
  const [state, setState] = React.useState<State>();

  const [[index, max], setIndexState] = React.useState([
    -1 as number,
    0 as number
  ] as const);

  React.useEffect(() => {
    // const todosSubscription = todosByFilterType$.pipe(tap(setTodos)).subscribe()

    const eventsHandlerSubscription = eventsHandler$.subscribe();

    const indexSubscription = index$
      .pipe(tap(next => setIndexState(next)))
      .subscribe();

    const stateSubscription = timeTravelableState$
      .pipe(
        tap(setState),
        tap(state => Object.assign(window, { state }))
      )
      .subscribe();

    dispatch(makeFetchEvent());

    return () => {
      eventsHandlerSubscription.unsubscribe();
      indexSubscription.unsubscribe();
      indexSubscription.unsubscribe();
    };
  }, []);

  if (state) {
    const onChangeFilterType = (filterType: FilterType) => {
      state.filterType = filterType;
    };

    const onChangeNew = (title: string) => {
      state.new = makeNoop(title);
    };

    const onSubmitNew = () => {
      if (!isPending(state.new)) state.new = toPending(state.new);
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
      state.todos
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
          (todo): todo is [Todo, Noop<Mutable>] =>
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
      state.todos
        .filter(
          compose(
            isComplete,
            first
          )
        )
        .filter(
          (todo): todo is [Todo, Noop<Mutable>] =>
            isNoop(second(todo)) || isBad(second(todo))
        )
        .forEach(([todo]) => dispatch(makeDeleteEvent(todo.id)));
    };

    return (
      <>
        <div>
          <div className="todomvc">
            <TodoApp
              todos={state.todos}
              new={state.new}
              onChangeFilterType={index >= 0 ? noop : onChangeFilterType}
              onChangeNew={index >= 0 ? noop : onChangeNew}
              onSubmitNew={index >= 0 ? noop : onSubmitNew}
              filterType={state.filterType}
              onEdit={index >= 0 ? () => noop : onEdit}
              onSave={index >= 0 ? () => noop : onSave}
              onCompleteAll={index >= 0 ? noop : onCompleteAll}
              onClearComplete={index >= 0 ? noop : onClearComplete}
            />
          </div>
        </div>
        <div>
          <div style={{ padding: 15 }}>
            <Slider
              value={index < 0 ? max : max - index - 1}
              // onChange={evt => setIndex(evt.detail.value)}
              onInput={evt => setIndex(max - evt.detail.value - 1)}
              discrete
              start={0}
              max={max}
              step={1}
            />
          </div>
        </div>
      </>
    );
  }

  return <div>Loading..</div>;
};

export default App;

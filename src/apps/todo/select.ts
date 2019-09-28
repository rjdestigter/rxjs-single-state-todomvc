import { timeTravelableState$, State } from "./state";
import { map, filter } from "rxjs/operators";

import {
  makeNoop,
  toPending,
  isPending,
  isNoop,
  isBad,
  Noop
} from "../../modules/operations";
import { FilterType } from "../../modules/filter-todo";
import {
  dispatch,
  makeEditEvent,
  TodoOperation,
  Todo,
  makeSaveEvent,
  MutableTodo,
  makeDeleteEvent,
  isComplete
} from "../../modules/todo";
import { compose, second, tuple, first, isNotNull } from "../../modules/utils";
import { Observable } from "rxjs";

const makeOnChangeFilterType = (state: State) => (filterType: FilterType) => {
  state.filterType = filterType;
};

const makeOnChangeNew = (state: State) => (title: string) => {
  state.new = makeNoop(title);
};

const makeOnSubmitNew = (state: State) => () => {
  if (!isPending(state.new)) state.new = toPending(state.new);
};

const makeOnEdit = (state: State) => (todo: Todo, operation: TodoOperation) => (
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

const makeOnSave = (todo: Todo, operation: TodoOperation) => (
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

const makeOnCompleteAll = (state: State) => () =>
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

const makeOnClearComplete = (state: State) => () => {
  state.todos
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

const state$ = timeTravelableState$.pipe(map(([a]) => a));

/**
 * Observable returning props
 */
export const props$ = state$.pipe(
  filter(<T>(stream: T | undefined): stream is T => !!stream),
  map((state) => {
    const onChangeFilterType = makeOnChangeFilterType(state);
    const onChangeNew = makeOnChangeNew(state);
    const onSubmitNew = makeOnSubmitNew(state);
    const onEdit = makeOnEdit(state);
    const onSave = makeOnSave;
    const onCompleteAll = makeOnCompleteAll(state);
    const onClearComplete = makeOnClearComplete(state);

    return {
      todos: state.todos,
      new: state.new,
      filterType: state.filterType,
      onChangeFilterType,
      onChangeNew,
      onSubmitNew,
      onEdit,
      onSave,
      onCompleteAll,
      onClearComplete
    }
  })
);

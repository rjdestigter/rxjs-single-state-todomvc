import { Observable } from "rxjs";

import { newTodoOperation$ } from "../../modules/todo/observables";
import { createState, makeTimeTravelable } from "../../modules/state";
import { filterTypeState$ } from "../../modules/filter-todo";

import { todosByFilterType$ } from "./observables";

export const state$ = createState({
  todos: todosByFilterType$,
  filterType: filterTypeState$,
  new: newTodoOperation$
});

export const [timeTravelableState$, setIndex, _, play, pause] = makeTimeTravelable(
  state$
);

type Observed<T> = T extends Observable<infer S> ? S : never;

export type State = {
  data: Observed<typeof state$> | undefined;
  index: number;
  max: number;
};

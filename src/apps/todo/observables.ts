import { selectTodoFilter } from "../../modules/utils";

import { stateOf } from "../../modules/state";

import { todos$ } from "../../modules/todo/observables";

import { FilterType } from "./types";
import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";

export const filterTypeState$ = stateOf(FilterType.All);

export const todosByFilterType$ = combineLatest(
  todos$,
  filterTypeState$[0]
).pipe(
  map(
    ([todos, filterType]) => selectTodoFilter(filterType)(todos)
    // What I want is point-free but TypeScript can't handle me.
    // fromAandBToC(
    //   compose(
    //     selectTodoFilter,
    //     second
    //   )
  )
);

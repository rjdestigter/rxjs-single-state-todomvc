import {
  second,
  selectTodoFilter,
  compose,
  fromAandBToC
} from "../../modules/utils";

import { stateOf } from "../../modules/rxjs-state";

import { todos$ } from "../../modules/todo/observables";

import { FilterType } from "./types";
import { map, filter } from "rxjs/operators";
import { combineLatest } from "rxjs";

export const filterTypeState$ = stateOf(FilterType.All);

export const todosByFilterType$ = combineLatest(
  todos$,
  filterTypeState$[0]
).pipe(
  map(
    ([todos, filterType]) => selectTodoFilter(filterType)(todos)
    // fromAandBToC(
    //   compose(
    //     selectTodoFilter,
    //     second
    //   )
    )
);

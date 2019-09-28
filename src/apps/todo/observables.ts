import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { todos$ } from "../../modules/todo/observables";
import { selectTodoFilter, filterTypeState$ } from "../../modules/filter-todo";

/**
 * Observable returning todos filtered by selected filter type.
 */
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

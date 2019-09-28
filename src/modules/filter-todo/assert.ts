
import { FilterType } from './types'

import { Todo, TodoOperation } from '../todo'

export const makeIsFilterType = <T extends FilterType>(of: T) => (
  filterType: FilterType
): filterType is T => filterType === of;


/**
 * TODO
 */
export const isFilterTypeAll = makeIsFilterType(FilterType.All);


/**
 * TODO
 */
export const isFilterTypeCompleted = makeIsFilterType(FilterType.Completed);


/**
 * TODO
 */
export const isFilterTypeActive = makeIsFilterType(FilterType.Active);

/**
 * TODO
 */
export const makeFilterTodosByFilterType = <T extends FilterType>(
  filterType: T
) => (todos: [Todo, TodoOperation][]) =>
  filterType === FilterType.All
    ? todos
    : todos.filter(
        ([todo]) =>
          (isFilterTypeCompleted(filterType) && todo.completed) ||
          (isFilterTypeActive(filterType) && !todo.completed)
      );


/**
 * TODO
 */
      export const filterCompletedTodos = makeFilterTodosByFilterType(
  FilterType.Completed
);

/**
 * TODO
 */
export const filterActiveTodos = makeFilterTodosByFilterType(
  FilterType.Active
);
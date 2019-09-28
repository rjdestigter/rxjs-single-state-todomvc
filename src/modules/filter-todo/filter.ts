import { Todo, TodoOperation } from "../todo";
import { FilterType } from "./types";
import { isFilterTypeCompleted, isFilterTypeActive } from "./assert";

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
export const filterActiveTodos = makeFilterTodosByFilterType(FilterType.Active);

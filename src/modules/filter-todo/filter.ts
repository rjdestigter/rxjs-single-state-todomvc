import { Todo, TodoOperation, TodoWithOperation } from "../todo";
import { FilterType } from "./types";
import { isFilterTypeCompleted, isFilterTypeActive } from "./assert";

/**
 * ```hs
 * makeFilterTodosByFilterType :: (FilterType a) => [Todo] -> [Todo]
 * ```
 * @param filterType Type of filter to create a filter function for.
 * @returns A function that filters given [[Todo]]s by the provided type.
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
 * ```hs
 * filterCompletedTodos :: [TodoWithOperation] -> [TodoWithOperation]
 * ```
 * @param todos List of [[Todo]]s to be filtered
 * @returns List of todos that are all complete.
 */
export const filterCompletedTodos = makeFilterTodosByFilterType(
  FilterType.Completed
);

/**
 * ```hs
 * filterActiveTodos :: [TodoWithOperation] -> [TodoWithOperation]
 * ```
 * @param todos List of [[Todo]]s to be filtered
 * @returns List of todos that are all active.
 */
export const filterActiveTodos: (
  todos: TodoWithOperation[]
) => TodoWithOperation[] = makeFilterTodosByFilterType(FilterType.Active);

import { identity } from '../utils'

import { FilterType } from './types'
import { filterActiveTodos, filterCompletedTodos  } from './filter'
import { isFilterTypeActive, isFilterTypeCompleted } from './assert'

/**
 * selectTodoFilter :: FilterType -> [TodoWithOperation] -> [TodoWithOperation]
 * 
 * Given a type of filter returns a function that filters a list of tuples of (Todo, TodoOperation)
 * 
 */
export const selectTodoFilter = (filterType: FilterType) =>
  isFilterTypeActive(filterType)
    ? filterActiveTodos
    : isFilterTypeCompleted(filterType)
    ? filterCompletedTodos
    : identity;
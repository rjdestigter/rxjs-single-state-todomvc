
import { FilterType } from './types'

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


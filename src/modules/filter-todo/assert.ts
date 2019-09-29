/**
 * Helper functions to assert [[FilterType]]s
 */

import { FilterType } from "./types";

/**
 * ```hs
 * makeIsFilterType :: (FilterType a) => a -> FilterType -> boolean
 * ```
 * Creates a function that compares filter types and asserts they are
 * of the same type.
 *
 * @typeparam T An instance of [[FilterType]]
 * @param of [[FilterType]] to compare against
 * @returns A function that will compare filter types.
 */
export const makeIsFilterType: <T extends FilterType>(
  of: T
) => (filterType: FilterType) => filterType is T = <T extends FilterType>(
  of: T
) => (filterType: FilterType): filterType is T => filterType === of;

/**
 * ```hs
 * isFilterTypeAll :: FilterType -> boolean
 * ```
 * Asserts that a given filter type equals [[FilterType.All]]
 *
 * @param filterType [[FilterType]] to compare.
 * @returns `filterType is FilterType.ALL`, `true`
 * if the given filter type equals [[FilterType.All]]
 */
export const isFilterTypeAll: (
  filterType: FilterType
) => filterType is FilterType.All = makeIsFilterType(FilterType.All);

/**
 * ```hs
 * isFilterTypeCompleted :: FilterType -> boolean
 * ```
 * Asserts that a given filter type equals [[FilterType.Completed]]
 *
 * @param filterType [[FilterType]] to compare.
 * @returns `filterType is FilterType.ALL`, `true`
 * if the given filter type equals [[FilterType.Completed]]
 */
export const isFilterTypeCompleted: (
  filterType: FilterType
) => filterType is FilterType.Completed = makeIsFilterType(
  FilterType.Completed
);

/** 
 * ```hs
 * isFilterTypeActive :: FilterType -> boolean
 * ```
 * Asserts that a given filter type equals [[FilterType.Active]]
 *
 * @param filterType [[FilterType]] to compare.
 * @returns `filterType is FilterType.ALL`, `true` if
 * the given filter type equals [[FilterType.Active]]
 */
export const isFilterTypeActive: (
  filterType: FilterType
) => filterType is FilterType.Active = makeIsFilterType(FilterType.Active);

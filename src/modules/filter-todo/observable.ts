import { stateOf } from "../../modules/state";

import { FilterType } from "./types";

/**
 * ```hs
 * filterTypeState :: StateObservable FilterType
 * ```
 * Stateful observable for storing and emiting
 * the user's selected filter type by which
 * listed [[Todo]]s in the UI are filtered.
 */
export const filterTypeState$ = stateOf(FilterType.All);


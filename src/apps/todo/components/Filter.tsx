import * as React from "react";

import { Chip, ChipSet } from "@rmwc/chip";

import {
  FilterType,
  isFilterTypeAll,
  isFilterTypeActive,
  isFilterTypeCompleted
} from "../../../modules/filter-todo";

export interface PropsFilter {
  filterType: FilterType;
  onChangeFilterType: (filterType: FilterType) => void;
}

// Exports
export default (props: PropsFilter) => (
  <ChipSet choice style={{ justifyContent: "center" }}>
    <Chip
      label="All"
      theme={isFilterTypeAll(props.filterType) ? "secondaryBg" : undefined}
      onClick={() => props.onChangeFilterType(FilterType.All)}
    />
    <Chip
      label="Active"
      icon="radio_button_unchecked"
      theme={isFilterTypeActive(props.filterType) ? "secondaryBg" : undefined}
      onClick={() => props.onChangeFilterType(FilterType.Active)}
    />
    <Chip
      label="Completed"
      icon="check_circle_outline"
      theme={
        isFilterTypeCompleted(props.filterType) ? "secondaryBg" : undefined
      }
      onClick={() => props.onChangeFilterType(FilterType.Completed)}
    />
  </ChipSet>
);

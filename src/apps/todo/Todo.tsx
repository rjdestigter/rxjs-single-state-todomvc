import * as React from "react";
import {
  Todo,
  TodoOperation,
  NewTodoOperation,
  MutableTodo
} from "../../modules/todo/types";
import { List } from "./components/List";
import {
  FilterType,
  isFilterTypeAll,
  isFilterTypeActive,
  isFilterTypeCompleted
} from "../../modules/filter-todo";

import * as R from "rmwc";

export interface PropsTodo {
  todos: [Todo, TodoOperation][];
  filterType: FilterType;
  new: NewTodoOperation;
  onChangeFilterType: (filterType: FilterType) => void;
  onEdit: (
    todo: Todo,
    operation: TodoOperation
  ) => (state: Partial<MutableTodo>) => void;
  onSave: (
    todo: Todo,
    operation: TodoOperation
  ) => (state?: Partial<MutableTodo>) => void;
  onChangeNew: (title: string) => void;
  onSubmitNew: () => void;
  onCompleteAll: () => void;
  onClearComplete: () => void;
}

export default (props: PropsTodo) => {
  // console.log(JSON.stringify(props, null, 2))
  const list = (
    <List
      todos={props.todos}
      onEdit={props.onEdit}
      onSave={props.onSave}
      onChangeNew={props.onChangeNew}
      new={props.new}
      onSubmitNew={props.onSubmitNew}
      onCompleteAll={props.onCompleteAll}
    />
  );

  return (
    <>
      <div style={{ textAlign: "center", marginTop: 15 }}>
        <R.Typography use="headline1" theme="secondary">
          todos
        </R.Typography>
      </div>
      <section className="todoapp">
        <section className="main">{list}</section>
        <footer className="footer" style={{ textAlign: "center" }}>
          <R.ChipSet choice style={{ justifyContent: "center" }}>
            <R.Chip
              label="All"
              theme={
                isFilterTypeAll(props.filterType) ? "secondaryBg" : undefined
              }
              onClick={() => props.onChangeFilterType(FilterType.All)}
            />
            <R.Chip
              label="Active"
              icon="radio_button_unchecked"
              theme={
                isFilterTypeActive(props.filterType) ? "secondaryBg" : undefined
              }
              onClick={() => props.onChangeFilterType(FilterType.Active)}
            />
            <R.Chip
              label="Completed"
              icon="check_circle_outline"
              theme={
                isFilterTypeCompleted(props.filterType)
                  ? "secondaryBg"
                  : undefined
              }
              onClick={() => props.onChangeFilterType(FilterType.Completed)}
            />
          </R.ChipSet>

          <div>
            <R.Button onClick={props.onClearComplete}>Clear completed</R.Button>
          </div>
          <R.Typography use="caption" style={{ color: "#999  " }}>
            <strong>
              {props.todos.filter(([todo]) => !todo.completed).length}
            </strong>{" "}
            item left
          </R.Typography>
        </footer>
      </section>
    </>
  );
};

import * as React from "react";
import { Typography } from "@rmwc/typography";
import { Button } from "@rmwc/button";

import {
  Todo,
  TodoOperation,
  NewTodoOperation,
  MutableTodo
} from "../../modules/todo/types";

import { FilterType } from "../../modules/filter-todo";

import List from "./components/List";
import Title from "./components/Title";
import Filter from "./components/Filter";

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

  const clearBtn = (
    <div>
      <Button onClick={props.onClearComplete}>Clear completed</Button>
    </div>
  );

  const filterChips = (
    <Filter
      filterType={props.filterType}
      onChangeFilterType={props.onChangeFilterType}
    />
  );

  const footer = (
    <Typography use="caption" style={{ color: "#999  " }}>
      <strong>{props.todos.filter(([todo]) => !todo.completed).length}</strong>{" "}
      item left
    </Typography>
  );

  return (
    <>
      <Title />
      <section className="todoapp">
        <section className="main">{list}</section>
        <footer className="footer" style={{ textAlign: "center" }}>
          {filterChips}
          {clearBtn}
          {footer}
        </footer>
      </section>
    </>
  );
};

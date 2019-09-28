import * as React from "react";
import {
  Todo,
  TodoOperation,
  NewTodoOperation,
  MutableTodo,
  EventType
} from "../../../modules/todo/types";
import * as R from "rmwc";

import { Item } from "./Item";
import { isOk, isPending, isBad, Status } from "../../../modules/operations";
import { noop } from "rxjs";

export const renderList = (props: PropsList) =>
  props.todos.map(([todo, operation]) => {
    return (
      <Item
        key={todo.id}
        todo={todo}
        onEdit={props.onEdit(todo, operation)}
        onSave={props.onSave(todo, operation)}
        status={operation && operation.status}
        isDeleting={
          isPending(operation) && operation.action === EventType.Delete
        }
        error={(operation && isBad(operation) && operation.error) || undefined}
      />
    );
  });

export type PropsList = {
  todos: [Todo, TodoOperation][];
  onEdit: (
    todo: Todo,
    operation: TodoOperation
  ) => (state: Partial<MutableTodo>) => void;
  onSave: (
    todo: Todo,
    operation: TodoOperation
  ) => (state?: Partial<MutableTodo>) => void;
  new: NewTodoOperation;
  onChangeNew: (title: string) => void;
  onSubmitNew: () => void;
  onCompleteAll: () => void;
};

export const List = (props: PropsList) => {
  const newTodo = props.new;

  const onChangeNew = isOk(newTodo)
    ? noop
    : (evt: React.FormEvent<HTMLInputElement>) => {
        props.onChangeNew(evt.currentTarget.value);
      };

  return (
    <R.List className="todo-list" twoLine>
      <R.ListItem>
        <R.ListItemGraphic
          title={"Mark all as complete."}
          icon={{ icon: "keyboard_arrow_down", onClick: props.onCompleteAll }}
          theme="secondary"
        />
        {isPending(props.new) ? (
          <>
            <R.ListItemText>
              <R.ListItemPrimaryText theme="secondary">
                {props.new.state}
              </R.ListItemPrimaryText>
              <R.ListItemSecondaryText style={{ fontStyle: "italic " }}>
                ...busy
              </R.ListItemSecondaryText>
            </R.ListItemText>
            <R.ListItemMeta
              icon={
                props.new.status == null ? (
                  ""
                ) : isPending(props.new) ? (
                  <R.CircularProgress theme="secondary" />
                ) : isBad(props.new) ? (
                  { icon: "error", theme: "error" }
                ) : isOk(props.new) ? (
                  { icon: "check", theme: "primary" }
                ) : (
                  ""
                )
              }
            />
          </>
        ) : (
          <R.TextField
            fullwidth
            theme="textPrimaryOnDark"
            placeholder="Where do you want to go today?"
            style={{ height: "100%" }}
            onChange={onChangeNew}
            value={props.new.state || ""}
            onKeyUp={evt => evt.keyCode === 13 && props.onSubmitNew()}
            autoFocus
            trailingIcon={
              isBad(props.new) ? { icon: "error", theme: "error" } : undefined
            }
          />
        )}
      </R.ListItem>
      <R.ListDivider />
      {renderList(props)}
    </R.List>
  );
};

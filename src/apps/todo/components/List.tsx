import * as React from "react";

import {
  List,
  ListItem,
  ListItemGraphic,
  ListItemPrimaryText,
  ListItemSecondaryText,
  ListItemMeta,
  ListDivider,
  ListItemText
} from '@rmwc/list'

import { Snackbar, SnackbarAction } from '@rmwc/snackbar'

import {CircularProgress} from '@rmwc/circular-progress'
import {TextField} from '@rmwc/textfield'

import {
  Todo,
  TodoOperation,
  NewTodoOperation,
  MutableTodo,
  EventType
} from "../../../modules/todo/types";

import { Item } from "./Item";
import { isOk, isPending, isBad } from "../../../modules/operations";
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

export default (props: PropsList) => {
  const newTodo = props.new;

  const onChangeNew = isOk(newTodo)
    ? noop
    : (evt: React.FormEvent<HTMLInputElement>) => {
        props.onChangeNew(evt.currentTarget.value);
      };

  const snack = isBad(props.new) ? (
    <Snackbar
        icon={{icon: 'error', theme: 'secondary'}}
        open
        theme='primaryBg'
        style={{background: 'var(--mdc-theme-primary)'}}
        message={props.new.error}
      />
  ) : null

  return (
    <List className="todo-list" twoLine>
      <ListItem>
        <ListItemGraphic
          title={"Mark all as complete."}
          icon={{ icon: "keyboard_arrow_down", onClick: props.onCompleteAll }}
          theme="secondary"
        />
        {isPending(props.new) ? (
          <>
            <ListItemText>
              <ListItemPrimaryText theme="secondary">
                {props.new.state}
              </ListItemPrimaryText>
              <ListItemSecondaryText style={{ fontStyle: "italic " }}>
                ...busy
              </ListItemSecondaryText>
            </ListItemText>
            <ListItemMeta
              icon={
                props.new.status == null ? (
                  ""
                ) : isPending(props.new) ? (
                  <CircularProgress theme="secondary" />
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
          <TextField
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
      </ListItem>
      <ListDivider />
      {renderList(props)}
      {snack}
    </List>
  );
};

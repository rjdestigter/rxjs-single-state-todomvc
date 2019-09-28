import * as React from "react";
import { Todo, MutableTodo } from "../../../modules/todo/types";
import * as R from "rmwc";
import {
  Status,
  statusTypeIsPending,
  statusTypeIsBad,
  statusTypeIsOk
} from "../../../modules/operations";
import { Typography } from "rmwc";

export type PropsItem = {
  todo: Todo;
  status: Status;
  error?: string;
  onEdit: (state: Partial<MutableTodo>) => void;
  onSave: (state?: Partial<MutableTodo>) => void;
  isDeleting: boolean;
};

export const Item = (props: PropsItem) => (
  <>
    <R.ListItem
      title={props.todo.title}
      style={{
        opacity: props.isDeleting ? 0.5 : 1,
        transition: "opacity 0.2s ease-in-out"
      }}
    >
      <R.ListItemGraphic
        icon={{
          icon: props.todo.completed
            ? "check_circle_outline"
            : "radio_button_unchecked",
          theme: props.todo.completed ? "primary" : undefined,
          onClick: () => props.onSave({ completed: !props.todo.completed })
        }}
      />
      <R.ListItemText>
        <R.ListItemPrimaryText theme="secondary">
          {props.todo.title}
        </R.ListItemPrimaryText>
        <R.ListItemSecondaryText
          theme={props.error ? "error" : undefined}
          style={{ fontStyle: "italic " }}
        >
          {props.error ? (
            props.error
          ) : props.status && statusTypeIsPending(props.status) ? (
            props.isDeleting ? (
              "...deleting"
            ) : (
              "...saving"
            )
          ) : props.todo.completed ? (
            <Typography theme="primary" use="caption">
              You're a go-getter!
            </Typography>
          ) : (
            <Typography use="caption">Start working on it!</Typography>
          )}
        </R.ListItemSecondaryText>
      </R.ListItemText>
      <R.ListItemMeta
        icon={
          props.status == null ? (
            ""
          ) : statusTypeIsPending(props.status) ? (
            <R.CircularProgress theme="secondary" />
          ) : statusTypeIsBad(props.status) ? (
            { icon: "error", theme: "error" }
          ) : statusTypeIsOk(props.status) ? (
            { icon: "check", theme: "primary" }
          ) : (
            ""
          )
        }
      />
    </R.ListItem>
    <R.ListDivider />
  </>
);

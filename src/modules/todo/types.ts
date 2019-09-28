import { Operation, Noop, Bad } from "../operations";

/**
 * Todo model
 */
export type Todo = {
  readonly id: number;
  readonly title: string;
  // userId: number;
  readonly completed: boolean;
};

/**
 * Type describing operational state for a new todo.
 */
export type NewTodoOperation = Operation<string, void>;

/**
 * Type alias describing those parts of a todo that are user editable.
 */
export type MutableTodo = Pick<Todo, "completed" | "title">;

/**
 * Union type of event types that are in use for operational state.
 */
export type OperationalEventTypes = EventType.Save | EventType.Delete;

/**
 * Type describing operational data in relation to editing, saving, and or removing todos.
 */
export type TodoOperation = Operation<MutableTodo, Todo, OperationalEventTypes>;

/**
 * Event types that are dispatched to thee events$ sink.
 */
export enum EventType {
  Fetch = "Fetch",
  Edit = "Edit",
  Save = "Save",
  Delete = "Delete"
}

/**
 * Event describing todo's should be requested from the server.
 */
export type FetchEvent = {
  type: EventType.Fetch;
};

/**
 * Event indicating a change to a todo in state should be recorded.
 */
export type EditEvent = {
  type: EventType.Edit;
  operation: Noop<MutableTodo> | Bad<MutableTodo, OperationalEventTypes>;
  todo: Todo;
};

/**
 * Event meant to trigger an API call for saving an event using the API
 */
export type SaveEvent = {
  type: EventType.Save;
  operation: Noop<MutableTodo> | Bad<MutableTodo, OperationalEventTypes>;
  todo: Todo;
};

/**
 * Event indicating the user wants to delete an event from state and the database.
 */
export type DeleteEvent = {
  type: EventType.Delete;
  todo: Todo;
};

/**
 * Union type of all event tyeps.
 */
export type TodoEvent = FetchEvent | EditEvent | SaveEvent | DeleteEvent;

/**
 * A tuple:
 * 1. [[Todo]]
 * 2. [[TodoOperation]]
 */
export type TodoWithOperation = [Todo, TodoOperation];

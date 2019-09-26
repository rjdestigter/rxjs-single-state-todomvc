export type Todo = {
  readonly id: number;
  readonly title: string;
  // userId: number;
  readonly completed: boolean;
};

export enum Status {
  Noop = "Noop",
  Pending = "Pending",
  Ok = "Ok",
  Bad = "Bad"
}

export type Noop<T> = {
  status: Status.Noop;
  state: T;
};

export type Pending<T, A = void> = {
  status: Status.Pending;
  state: T;
} & (A extends void ? {} : { action: A });

export type Bad<T, A = void> = {
  status: Status.Bad;
  state: T;
  error: string;
} & (A extends void ? {} : { action: A });

export type Ok<T, A = void> = {
  status: Status.Ok;
  state: T;
} & (A extends void ? {} : { action: A });

export type Operation<T, U = T, A = void> =
  | Noop<T>
  | Pending<T, A>
  | Bad<T, A>
  | (U extends void ? Noop<T> : Ok<U, A>);



export type NewTodoOperation = Operation<string, void>;

// type Foo = Operation<string, boolean>

export type Mutable = Pick<Todo, "completed" | "title">;

export type OperationalEventTypes = EventType.Save | EventType.Delete;

export type TodoOperation = Operation<Mutable, Todo, OperationalEventTypes>;

// Events

export enum EventType {
  Fetch = "Fetch",
  Edit = "Edit",
  Save = "Save",
  Delete = "Delete"
}

export type FetchEvent = {
  type: EventType.Fetch;
};

export type EditEvent = {
  type: EventType.Edit;
  operation: Noop<Mutable> | Bad<Mutable, OperationalEventTypes>;
  todo: Todo;
};

export type SaveEvent = {
  type: EventType.Save;
  operation: Noop<Mutable> | Bad<Mutable, OperationalEventTypes>;
  todo: Todo;
};

export type DeleteEvent = {
  type: EventType.Delete;
  id: number;
};

export type TodoEvent = FetchEvent | EditEvent | SaveEvent | DeleteEvent;

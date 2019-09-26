import { URL } from "./constants";

import {
  Ok,
  Bad,
  Status,
  Pending,
  Todo,
  Noop,
  Mutable,
  TodoOperation,
  EventType
} from "./types";

import { take } from "../utils";

/**
 * Mock database
 */
let todos: Todo[] = [];

const failPattern = [true, false, false, true, true, false, true]
let failIndex = 0

const getNextFailFlag = () => {
  failIndex += 1

  if (failIndex > failPattern.length - 1) {
    failIndex = 0
  }

  return failPattern[failIndex]
}

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * 
 */
export const read = async () => {
  const doFail = getNextFailFlag()

  if (todos.length <= 0) {
    const response = await fetch(URL);
    const json: Todo[] = await response.json();
    await delay(1500);
    todos = take(25)(json).map(todo => ({...todo, completed: false}));
  } else {
    await delay(1000);
  }
  return todos
};

/**
 * 
 * @param operation 
 */
export const create = async (
  operation: Pending<string>
): Promise<Ok<Todo> | Bad<string>> => {
  const doFail = getNextFailFlag()

  await delay(1500);

  if (doFail) {
    return {
      status: Status.Bad,
      error: "Something went terribly wrong!",
      state: operation.state
    };
  }

  if (!operation.state) {
    return {
      status: Status.Bad,
      error: "A title is required!",
      state: operation.state
    };
  }

  const todo = {
    id: Math.floor(Math.random() * 10000),
    userId: Math.floor(Math.random() * 10000),
    title: operation.state,
    completed: false
  };

  todos = [...todos, todo];

  return {
    status: Status.Ok,
    state: todo
  };
};

export const update = async (
  todo: Todo,
  operation: Exclude<TodoOperation, { status: Status.Ok | Status.Pending }>
): Promise<Ok<Todo, EventType.Save> | Bad<Mutable, EventType.Save>> => {
  await delay(1500);
  const doFail = getNextFailFlag()
  
  if (doFail) {
    return {
      status: Status.Bad,
      error: "Something went terribly wrong!",
      state: operation.state,
      action: EventType.Save
    };
  }

  const title = operation.state.title.trim();

  if (!title) {
    return {
      status: Status.Bad,
      action: EventType.Save,
      error: "A title is required!",
      state: {
        ...operation.state,
        title
      }
    };
  }

  const nextTodo = {
    ...todo,
    ...operation.state,
    title
  };

  todos = todos.map(current => {
    if (current.id === nextTodo.id) {
      return nextTodo;
    }

    return todo;
  });

  return {
    status: Status.Ok,
    state: { ...todo, ...operation.state, title },
    action: EventType.Save
  };
};

export const deleet = async (
  todo: Todo,
  operation: Pending<Mutable, EventType.Delete>, //Exclude<TodoOperation, { status: Status.Ok | Status.Pending }>
): Promise<Ok<Todo, EventType.Delete> | Bad<Mutable, EventType.Delete>> => {
  await delay(1500);
  const doFail = getNextFailFlag()
  
  if (doFail) {
    return {
      status: Status.Bad,
      error: "Unable to delete!",
      state: operation.state,
      action: EventType.Delete
    };
  }

  todos = todos.filter(current => current.id !== todo.id)

  return {
    status: Status.Ok,
    state: todo,
    action: EventType.Delete
  };
};

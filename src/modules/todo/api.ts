import { URL } from "./constants";

// Todo
import { Todo, MutableTodo, TodoOperation, EventType } from "./types";

// Operations
import { Ok, Bad, Status, Pending, Noop } from "../operations";

// Utilities
import { take } from "../utils";

/**
 * Mock database of Toods
 */
let todos: Todo[] = [];

/**
 * Pattern of booleans used to to randomly fail API calls.
 */
const failPattern = [true, false, false, true, true, false, true];

/**
 * Mutuable pointer referencing a boolean in [[failPattern]]
 */
let failIndex = 0;

/**
 * Returns the next "doFail" flag and moves the failIndex
 * pointer to the next boolean in [[failPattern]]
 */
const getNextFailFlag = () => {
  failIndex += 1;

  if (failIndex > failPattern.length - 1) {
    failIndex = 0;
  }

  return failPattern[failIndex];
};

/**
 * delay
 * Helper function for creating promise that resolves after `ms` milliseconds.
 *
 * @param ms Number of milliseconds to delay resolving the promise.
 */
const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const randomDelay = () => delay(Math.ceil(Math.random() * 2500))

/** 
 * API for loading the list of Todos in the database.
 */
export const read = async () => {
  getNextFailFlag();

  // Only make the network call once since we are mocking things here.
  if (todos.length <= 0) {
    const response = await fetch(URL);
    const json: Todo[] = await response.json();
    await delay(1500);

    // Replace the database
    todos = take(6)(json); //.map(todo => ({...todo, completed: false}));
  }
  // Return data from our mocked database [[todos]] after 1 second
  else {
    await delay(1000);
  }
  return todos;
};

/**
 * API for creating new Todos and storing them in the database.
 * @param operation
 */
export const create = async (
  operation: Pending<string>
): Promise<Ok<Todo> | Bad<string>> => {
  const doFail = getNextFailFlag();

  const title = operation.state.trim()
  
  if (!title) {
    return {
      status: Status.Bad,
      error: "A title is required!",
      state: operation.state
    };
  }
  
  await randomDelay();

  if (doFail) {
    return {
      status: Status.Bad,
      error: "Something went terribly wrong!",
      state: operation.state
    };
  }

  const exists = todos.find(todo => todo.title === title)

  if (exists) {
    return {
      status: Status.Bad,
      error: "A task with this title alreay exists!",
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

/**
 * API for updating Todos in the database
 *
 * @param todo
 * @param operation
 */
export const update = async (
  todo: Todo,
  operation: Exclude<TodoOperation, { status: Status.Ok | Status.Pending }>
): Promise<Ok<Todo, EventType.Save> | Bad<MutableTodo, EventType.Save>> => {
  await randomDelay();
  const doFail = getNextFailFlag();

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

/**
 * API for deleting Todo's from the database
 *
 * @param todo
 * @param operation
 */
export const deleet = async (
  todo: Todo,
  operation: Pending<MutableTodo, EventType.Delete> //Exclude<TodoOperation, { status: Status.Ok | Status.Pending }>
): Promise<Ok<Todo, EventType.Delete> | Bad<MutableTodo, EventType.Delete>> => {
  await randomDelay();
  const doFail = getNextFailFlag();

  if (doFail) {
    return {
      status: Status.Bad,
      error: "Unable to delete!",
      state: operation.state,
      action: EventType.Delete
    };
  }

  todos = todos.filter(current => current.id !== todo.id);

  return {
    status: Status.Ok,
    state: todo,
    action: EventType.Delete
  };
};

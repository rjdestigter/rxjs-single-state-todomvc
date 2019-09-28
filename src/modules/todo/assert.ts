import { Todo } from "./types";

/**
 * isComplete :: Todo -> boolean
 */
export const isComplete = (todo: Todo) => todo.completed === true;

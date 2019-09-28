import { Todo, MutableTodo } from "./types";
import { get, set } from "../utils/getset";

/**
 * @private
 * 
 * Constant used for creating empty, new [[Todo]]s
 */
const mutuableTodo: MutableTodo = { completed: false, title: "" };

/**
 * toMutable :: [[Todo]] -> [[MutableTodo]]
 * 
 * Helper function for extracting `completed` and `title` from todos.
 * This is mostly used to create data for operations.
 * 
 * @param todo - The todo object to convert.
 */
export const toMutable = (todo: Todo): MutableTodo =>
  setTitle(setCompleted(mutuableTodo)(getCompleted(todo)))(getTitle(todo));

// Experimental code
export const getId = get("id");
export const getTitle = get("title");
export const getCompleted = get("completed");

export const setId = set("id");
export const setTitle = set("title");
export const setCompleted = set("completed");



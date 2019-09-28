import {
  EventType,
  FetchEvent,
  TodoEvent,
  SaveEvent,
  DeleteEvent,
  TodoOperation,
  EditEvent,
  Todo,
  OperationalEventTypes
} from "./types";

import { Noop, Bad } from '../operations'

/**
 * makeFetchEvent
 */
export const makeFetchEvent = (): FetchEvent => {
  return { type: EventType.Fetch };
};

/**
 * makeEditEvent
 */

export const makeEditEvent = (
  todo: Todo,
  operation:
    | Noop<Pick<Todo, "completed" | "title">>
    | Bad<Pick<Todo, "completed" | "title">, OperationalEventTypes>
): EditEvent => {
  return { type: EventType.Edit, todo, operation };
};

/**
 * makeSaveEvent
 */
export const makeSaveEvent = (
  todo: Todo,
  operation:
    | Noop<Pick<Todo, "completed" | "title">>
    | Bad<Pick<Todo, "completed" | "title">, OperationalEventTypes>
): SaveEvent => {
  return { type: EventType.Save, todo, operation };
};

/**
 * makeDeleteEvent
 */
export const makeDeleteEvent = (todo: Todo): DeleteEvent => {
  return { type: EventType.Delete, todo };
};

/**
 * makeIsEventType
 */
export const makeIsEventType = <T extends EventType>(of: T) => (
  eventType: EventType
): eventType is T => eventType === of;

/**
 * isFetchEventType
 */
export const isFetchEventType = makeIsEventType(EventType.Fetch);

/**
 * isEditEventType
 */
export const isEditEventType = makeIsEventType(EventType.Edit);

/**
 * isSaveEventType
 */
export const isSaveEventType = makeIsEventType(EventType.Save);

/**
 * isDeleteEventType
 */
export const isDeleteEventType = makeIsEventType(EventType.Delete);

/**
 * makeIsEventOfType
 */
export const makeIsEventOfType = <A extends EventType>(
  f: (eventType: EventType) => eventType is A
) => (event: TodoEvent): event is Extract<TodoEvent, { type: A }> =>
  f(event.type);

/**
 * isFetchEvent
 */
export const isFetchEvent = makeIsEventOfType(isFetchEventType);

/**
 * isEditEvent
 */
export const isEditEvent = makeIsEventOfType(isEditEventType);

/**
 * isSaveEvent
 */
export const isSaveEvent = makeIsEventOfType(isSaveEventType);

/**
 * isDeleteEvent
 */
export const isDeleteEvent = makeIsEventOfType(isDeleteEventType);

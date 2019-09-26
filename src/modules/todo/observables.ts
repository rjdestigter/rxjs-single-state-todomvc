import { Subject, from, of, EMPTY, concat } from "rxjs";

import {
  tap,
  map,
  mergeMap,
  share,
  withLatestFrom,
  mapTo,
  switchMap,
  groupBy,
  timeoutWith,
  ignoreElements,
  startWith,
  delay,
  filter
} from "rxjs/operators";

import { get, set } from "../utils/getset";

import { stateOf } from "../rxjs-state";
import { read, create, update, deleet } from "./api";
import {
  TodoEvent,
  Todo,
  NewTodoOperation,
  Status,
  TodoOperation,
  EventType,
  SaveEvent,
  EditEvent,
  Operation,
  Noop,
  OperationalEventTypes,
  Bad,
  Mutable,
  Pending
} from "./types";
import {
  isFetchEvent,
  isEditEvent,
  isSaveEvent,
  isDeleteEvent
} from "./events";

import {
  tuple,
  first,
  second,
  compose,
  curry,
  thruple,
  threcond,
  thirst
} from "../utils";
import { makeNoop, isPending, isBad, isOk, toPending, isNoop } from "./utils";

/**
 * Event stream
 */
export const events$ = new Subject<TodoEvent>();

/**
 * Helper function for dispatching to the event stream.
 */
export const dispatch = (event: TodoEvent) => {
  events$.next(event);
};

type TodoWithOperation = [Todo, TodoOperation];
/**
 * Fetches and streams ToDos
 */
export const [todos$, storeTodos] = stateOf<TodoWithOperation[]>([]);

/**
 *
 */
const readTodos$ = () =>
  from(read()).pipe(
    withLatestFrom(todos$),
    map(([next, current]) => {
      // TODO Filter out incoming todos that have matching ids with todos in state
      const additional: TodoWithOperation[] = [
        ...current,
        ...next.map(todo => {
          const noopOperation = makeNoop({
            title: todo.title,
            completed: todo.completed
          });

          return tuple(todo, noopOperation);
        })
      ];

      return additional;
    }),
    tap(storeTodos)
  );

/**
 *
 * @param event
 */
const makeEditEvent$ = (event: EditEvent) =>
  of(void 0).pipe(
    withLatestFrom(todos$),
    map(second),
    map(todos => {
      const index = todos.findIndex(([todo]) => todo.id === event.todo.id);
      const nextTodos = [...todos];
      nextTodos.splice(index, 1, [event.todo, event.operation]);
      return nextTodos;
    }),
    tap(storeTodos),
    map(nextTodos => tuple(event, nextTodos))
  );

type TodoId = number;

/**
 * Operator compositor for dispatching a single updated todo to state
 * @param get - Callback function that given stream S returns a tuple of a [[Todo]] or [[TodoId]] and [[TodoOperation]]
 */
const storeTodo = <S, O extends TodoOperation, T extends TodoId | Todo>(
  get: (stream: S) => [Todo | TodoId, O]
) =>
  mergeMap((stream: S) =>
    of(stream).pipe(
      // Combine the stream with the most recent state of the list of todos
      withLatestFrom(todos$),
      map(([stream, todos]) => {
        const [todoOrId, todoOperation] = get(stream);

        // Find the index of the operated todo in state
        const index = todos.findIndex(
          ([current]) =>
            current.id ===
            (typeof todoOrId === "number" ? todoOrId : todoOrId.id)
        );

        if (index >= 0) {
          // Update state with data from the operated todo
          const nextTodos = [...todos];
          nextTodos.splice(index, 1, [
            typeof todoOrId === "number" ? todos[index][0] : todoOrId,
            todoOperation
          ]);

          return thruple(todoOperation, nextTodos, todoOrId);
        }

        return thruple(todoOperation, todos, todoOrId);
      }),
      tap(
        compose(
          storeTodos,
          threcond
        )
      )
    )
  );

/**
 *
 * @param event
 */
const makeSaveEvent$ = (event: SaveEvent) =>
  concat(
    // Update state for this todo to status "Pending"
    of(toPending(event.operation, EventType.Save)).pipe(
      storeTodo(stream => tuple(event.todo, stream)),
      map(data => threcond(data)),
      map(data => curry(tuple)(event)(data))
    ),
    // Continue with updating the the todo on the server
    from(update(event.todo, event.operation)).pipe(
      storeTodo(stream => {
        // const foo = isOk(stream)
        //   ? tuple(stream.state, stream)
        //   : tuple(event.todo, stream);
        return tuple(isOk(stream) ? stream.state : event.todo, stream);
        // return [event.todo, stream];
      }),
      map(thirst),
      // or 5000 if the operation was Bad
      // Delay the stream by 750ms if the operation was Ok
      mergeMap(stream => of(stream).pipe(delay(isOk(stream) ? 750 : 5000))),

      // Reset the todo in state to status "Noop"
      storeTodo(stream => tuple(event.todo.id, makeNoop(stream.state))),
      map(nextTodos => tuple(event, nextTodos))
    )
  );

/**
 *
 */
export const handleEvents$ = events$.pipe(
  groupBy(
    event => {
      if (isFetchEvent(event)) {
        return EventType.Fetch;
      } else if (isEditEvent(event) || isSaveEvent(event)) {
        return event.todo.id;
      } else if (isDeleteEvent(event)) {
        return event.id;
      }
    },
    event => event,
    actionsByGroup$ =>
      actionsByGroup$.pipe(
        timeoutWith(15000, EMPTY),
        ignoreElements()
      )
  ),
  mergeMap(groupedEvent$ =>
    groupedEvent$.pipe(
      switchMap(event => {
        if (isFetchEvent(event)) {
          return readTodos$().pipe(map(todos => tuple(event, todos)));
        } else if (isEditEvent(event)) {
          return makeEditEvent$(event);
        } else if (isSaveEvent(event)) {
          return makeSaveEvent$(event);
        }

        const getId = get("id");

        return of(void 0).pipe(
          withLatestFrom(todos$),
          map(second),
          map(todos => todos.find(item => getId(first(item)) === getId(event))),
          mergeMap(maybeTodo =>
            maybeTodo
              ? of(maybeTodo).pipe(
                  filter(
                    (
                      data
                    ): data is [
                      Todo,
                      Extract<
                        TodoOperation,
                        { status: Status.Noop | Status.Bad }
                      >
                    ] => isNoop(second(data)) || isBad(second(data))
                  ),
                  // I wish TypeScript had better type inference
                  // storeTodo(applyToSecond(curry(flip(toPendingWithAction))(EventType.Delete))),
                  storeTodo(([todo, operation]) =>
                    tuple(todo, toPending(operation, EventType.Delete))
                  ),
                  mergeMap(([pendingOperation, _, todo]) =>
                    from(
                      deleet(
                        todo as Todo,
                        pendingOperation as Pending<Mutable, EventType.Delete>
                      )
                    ).pipe(
                      mergeMap(
                        stream => {
                          if (isOk((stream))) {
                            return of(void 0).pipe(
                              withLatestFrom(todos$),
                              map(second),
                              tap(todos => storeTodos(todos.filter(([todo]) => todo.id !== stream.state.id)))
                            )
                          }

                          return of(void 0).pipe(
                            storeTodo(
                              () => [first(maybeTodo), stream] 
                            )
                          )
                        }
                      )
                    )
                  )
                )
              : of(tuple(event, undefined))
          )
        );
      })
    )
  )
);

/**
 * Event stream filtered by type FETCH
 */
export const eventsHandler$ = handleEvents$;

/**
 *
 */
export const newTodoOperation$ = stateOf<NewTodoOperation>(
  {
    status: Status.Noop,
    state: ""
  },
  state$ =>
    state$.pipe(
      switchMap(state =>
        isPending(state)
          ? from(create(state)).pipe(
              withLatestFrom(todos$),
              tap(([nextState, todos]) => {
                if (isOk(nextState))
                  storeTodos([
                    ...todos,
                    tuple(nextState.state, makeNoop(nextState.state))
                  ]);
              }),
              map(first),
              map(nextState => (isBad(nextState) ? nextState : makeNoop(""))),
              startWith(state)
            )
          : of(state)
      ),
      share()
    )
);

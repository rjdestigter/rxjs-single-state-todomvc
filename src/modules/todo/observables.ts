// RxJS
import { Subject, from, of, EMPTY, concat, Observable } from "rxjs";
import {
  tap,
  map,
  mergeMap,
  switchMap,
  groupBy,
  timeoutWith,
  ignoreElements,
  startWith,
  delay,
  filter
} from "rxjs/operators";

// Utilities
import {
  tuple,
  compose,
  thruple,
  identity,
  IS_TUPLE,
  arrayBimap
} from "../utils";

// State
import { stateOf, StateObservable, transactionalStateOf } from "../state";

// API
import { read, create, update, deleet } from "./api";

// Todo
import {
  TodoEvent,
  Todo,
  NewTodoOperation,
  EventType,
  SaveEvent,
  EditEvent,
  DeleteEvent,
  FetchEvent,
  TodoWithOperation
} from "./types";

import { isFetchEvent, isEditEvent, isSaveEvent, makeFetchEvent } from "./events";

import { toMutable } from "./utils";

// Operational
import { makeNoop, isPending, isBad, toPending, isNoop } from "../operations";

// Transaction
import { TransactionType } from "../transactions";

// Effects
import {
  resetOkAndBadTodosEffect,
  RedoableEvent,
  ResetableOperation,
  addEffect,
  updateEffect,
  runDeleteOutcomeEffect,
  runSaveOutcomeEffect,
  runCreateOutcomeEffect
} from "./effects";

/**
 * @private
 *
 * [[Subject]] for dispatching and streaming events.
 */
const events$ = new Subject<TodoEvent>();

/**
 * dispatch :: TodoEvent -> ()
 *
 * Function for dispatching to the [[events$]] [[Subject]]
 *
 * @param event An [[EditEvent]], [[SaveEent]], or [[DeleteEvent]].
 */
export const dispatch = (event: TodoEvent) => {
  console.warn(`Dispatching ${event.type}`);
  events$.next(event);
};

/**
 * dispatchFetch :: () -> void
 */
export const dispatchFetch = () => dispatch(makeFetchEvent());

/**
 * Create a transactional [[StateObservable]] allowing us to use the
 * setState function (in this case named writeTodos) to either accept an
 * array of TodoWithOperation or just a single element.
 */
export const [todos$, writeTodos] = transactionalStateOf(
  [] as TodoWithOperation[],
  ([todo1], [todo2]) => todo1.id === todo2.id,
  IS_TUPLE
);

/**
 * Operator for resetting a todo's operation to Noop
 * after it was set to Bad or Ok
 *
 * @param updateOrDeleteEventAndOperation$
 */
const resetOkAndBadTodos = (
  updateOrDeleteEventAndOperation$: Observable<
    [RedoableEvent, ResetableOperation]
  >
) =>
  updateOrDeleteEventAndOperation$.pipe(
    delay(1000),
    tap(resetOkAndBadTodosEffect(writeTodos))
  );

/**
 * Main function for handling incoming events
 * Kind of like a reducer in Redux.
 *
 * It groups the events by type Fetch or the id of the todo.
 * and uses switchMap for each group.
 */
export const handleEvents$ = events$.pipe(
  groupBy(
    event => {
      if (isFetchEvent(event)) {
        return EventType.Fetch;
      } else {
        return event.todo.id;
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
          return handleReadEvent(event);
        } else if (isEditEvent(event)) {
          return handleEditEvent(event);
        } else if (isSaveEvent(event)) {
          return handleSaveEvent(event);
        }

        return handleDeleteEvent(event);
      })
    )
  )
);

// Because TypeScript is unable to infer this bois abstractions.
type Id<T> = (id: T) => T;

/**
 * Handles incoming [[FetchEvent]] events that have been
 * dispatched to the [[events$]] [[Subject]]
 *
 * It immediately calls the API for requesting Todos from
 * the server and updates state with the received todos
 * by running the addEffect
 *
 * @param event The [[FetchEvent]] event
 */
export const handleReadEvent = (event: FetchEvent) =>
  from(read()).pipe(
    // map(arrayMap(curry(tuple))),
    map(
      arrayBimap(identity as Id<Todo>)(
        // f after g
        compose(
          makeNoop, // f
          toMutable // g
        )
      )
    ),
    tap(addEffect(writeTodos))
  );

/**
 * Handle incoming events requesting [[Todo]](s) be deleted
 * from the database.
 *
 * State is updating first to indicate "in progress". Then the
 * API for deleting Todos is called. Once the call resolves
 * state is updated to indicate failure or success. After a second
 * state is updated once again to reset the operation so that the
 * UI removes the indicators of failure or success.
 *
 * @param event - The delete event [[DeleteEvent]]
 */
const handleDeleteEvent = (event: DeleteEvent) => {
  const operation = toPending(
    makeNoop(toMutable(event.todo)),
    EventType.Delete as const
  );

  const promise = deleet(event.todo, operation);

  return concat(
    of(tuple(event.todo, operation)).pipe(tap(updateEffect(writeTodos))),
    from(promise).pipe(
      tap(runDeleteOutcomeEffect(writeTodos)(event.todo)),
      filter(isBad),
      map(outcome => tuple(event, outcome)),
      resetOkAndBadTodos
    )
  );
};

/**
 * Responsds to the [[EditEvent]] dispatched on the [[events$]]
 * [[Subject]] after the user types to change the title of
 * a [[Todo]]
 *
 * The only effect here is updating state. No API calls
 *
 * @param event [[EditEvent]]
 */
const handleEditEvent = (event: EditEvent) => {
  // Reset the Todo's operational status if the user
  // started editing after a success or failure operation
  const operation = isNoop(event.operation)
    ? event.operation
    : makeNoop(event.operation.state);

  return of(tuple(event.todo, operation)).pipe(tap(updateEffect(writeTodos)));
};

/**
 * Handles incoming [[SaveEvent]] events that are dispatched to [[event$]]
 *
 * - It first updates state to indicate the Todo is currently being saved.
 * - Then calls the API for updating existing todos in the database.
 * - Passes the results to runSaveOutcomeEffect to update state accordingly
 * - And resets after a delay using [[resetOkAndBadTodos]]
 *
 * @param event
 */
const handleSaveEvent = (event: SaveEvent) => {
  const operation = toPending(event.operation, EventType.Save as const);

  const updateTransaction = {
    type: TransactionType.Update as const,
    payload: tuple(event.todo, operation)
  };

  const promise = update(event.todo, event.operation);

  return concat(
    of(void 0).pipe(tap(() => writeTodos(updateTransaction))),
    from(promise).pipe(
      tap(runSaveOutcomeEffect(writeTodos)(event.todo)),
      map(outcome => tuple(event, outcome)),
      resetOkAndBadTodos
    )
  );
};

/**
 * Event stream filtered by type FETCH
 */
export const eventsHandler$ = handleEvents$;

/**
 * I'm destructuring the result of `stateOf` so that I can re-export
 * a piped version of `_newTodoOperation`
 */
const [_newTodoOperation$, setNewTodoOperation, getNewTodoOperation] = stateOf(
  makeNoop("") as NewTodoOperation
);

/**
 * [[StateObservable]] that handles new todos the user wants to create.
 * It starts with an empty "Noop" operation of a string (title)
 * and any time `setNewTodoOperation` is called the stream checks if the status
 * has changed to "pending" and if so will start calling the API
 * for storing the new todo in the datatabase.
 *
 * Using [[thruple]] to re-export everything as a [[StateObservable]]
 *
 *
 */
export const newTodoOperation$ = thruple(
  _newTodoOperation$.pipe(
    switchMap(state =>
      isPending(state)
        ? from(create(state)).pipe(
            tap(runCreateOutcomeEffect(writeTodos)),
            map(nextState => (isBad(nextState) ? nextState : makeNoop(""))),
            startWith(state)
          )
        : of(state)
    )
  ),
  setNewTodoOperation,
  getNewTodoOperation
) as StateObservable<NewTodoOperation>;

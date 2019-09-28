/**
 * @module todo
 */

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

import {
  isFetchEvent,
  isEditEvent,
  isSaveEvent,
  makeFetchEvent
} from "./events";

import { toMutable } from "./utils";

// Operational
import { makeNoop, isPending, isBad, toPending, isNoop } from "../operations";

// Transaction
import { TransactionType, Transactional } from "../transactions";

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
 * `Subject` for dispatching and streaming events.
 */
const events$ = new Subject<TodoEvent>();

/**
 * ```hs
 * dispatch :: TodoEvent -> ()
 * ```
 *
 * Function for dispatching to the [[events$]] `Subject`
 *
 * @param event An [[EditEvent]], [[SaveEvent]], or [[DeleteEvent]].
 */
export const dispatch = (event: TodoEvent) => {
  console.warn(`Dispatching ${event.type}`);
  events$.next(event);
};

/**
 * ```hs
 * dispatchFetch :: () -> void
 * ```
 *
 * Dispatches the [[FetchEvent]] to the [[events$]] `Subject`.
 */
export const dispatchFetch = () => dispatch(makeFetchEvent());

/**
 * ```hs
 * [todos$, writeTodos] :: (Observable [[TodoWithOperation[]]], TodoWithOperation -> void)
 * ```
 * 
 * Create a transactional [[StateObservable]] allowing us to use the
 * setState function _(in this case named writeTodos)_ to either accept
 * state transactions who's payload is an array of [[TodoWithOperation]]
 * or just a single element.
 */
export const [todos$, writeTodos] = transactionalStateOf(
  [] as TodoWithOperation[],
  ([todo1], [todo2]) => todo1.id === todo2.id,
  IS_TUPLE
);

/**
 * ```hs
 * resetOkAndBadTodos :: Observable (RedoableEvent, ResetableOperation) -> Observable (RedoableEvent, ResetableOperation)
 * ```
 * Operator for resetting a [[Todo]]'s [[TodoOperation]] to [[Noop]]
 * after it was set to [[Bad]] or [[Ok]]
 *
 * @param updateOrDeleteEventAndOperation$
 */
const resetOkAndBadTodos = (
  updateOrDeleteEventAndOperation$: Observable<
    [RedoableEvent, ResetableOperation]
  >
): Observable<[RedoableEvent, ResetableOperation]> =>
  updateOrDeleteEventAndOperation$.pipe(
    delay(1000),
    tap(resetOkAndBadTodosEffect(writeTodos))
  );

/**
 * ```hs
 * handleEvents$ :: Observable ()
 * ```
 *
 * Main observable for handling incoming events that have been dispatched
 * to the [[events$]] `Subject`. Kind of like a reducer in redux.
 *
 * It groups the events by type [[EventType.Fetch]] or the `id` of the [[Todo]].
 * and uses `switchMap` for each group.
 */
export const handleEvents$: Observable<never> = events$.pipe(
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
  ),
  ignoreElements()
);

// Because TypeScript is unable to infer this bois abstractions.
type Id<T> = (id: T) => T;

/**
 * ```hs
 * handleReadEvent :: FetchEvent -> Observable (Transactional TodoWithOperation)
 * ```
 *
 * Handles incoming [[FetchEvent]] events that have been
 * dispatched to the [[events$]] `Subject`
 *
 * It immediately calls the API for requesting [[Todo]]s from
 * the server and updates state with the received todos
 * by running the [[addEffect]]
 *
 * @param event The [[FetchEvent]] event
 */
export const handleReadEvent = (
  event: FetchEvent
): Observable<Transactional<TodoWithOperation>> =>
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
 * API for deleting Todos is called. Once the call re solves
 * state is updated to indicate failure or success. After a second
 * state is updated once again to reset the operation so that the
 * UI removes the indicators of failure or success.
 *
 * @param event - The delete event [[DeleteEvent]]
 */
const handleDeleteEvent = (
  event: DeleteEvent
): Observable<
  Transactional<TodoWithOperation | [RedoableEvent, ResetableOperation]>
> => {
  const operation = toPending(
    makeNoop(toMutable(event.todo)),
    // @ts-ignore
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
 * ```hs
 * handleEditEvent :: EditEvent -> Observable
 * ```
 * 
 * Responsds to the [[EditEvent]] dispatched on the [[events$]]
 * `Subject` after the user types to change the title of
 * a [[Todo]]
 *
 * The only effect here is updating state. No API calls
 *
 * @param event [[EditEvent]]
 */
const handleEditEvent = (event: EditEvent): Observable<unknown> => {
  // Reset the Todo's operational status if the user
  // started editing after a success or failure operation
  const operation = isNoop(event.operation)
    ? event.operation
    : makeNoop(event.operation.state);

  return of(tuple(event.todo, operation)).pipe(tap(updateEffect(writeTodos)));
};

/**
 * ```hs
 * handleSaveEvent :: SaveEvent -> Observable ?
 * ```
 * 
 * Handles incoming [[SaveEvent]] events that have been dispatched to [[event$]]
 *
 * - It first updates state to indicate the [[Todo]] is currently being saved.
 * - Then calls the [[update]] API for mutating existing todos in the database.
 * - Passes the results to [[runSaveOutcomeEffect]] to update state with the updated [[Todo]] and [[TodoOperation]]
 * - The todo's operation is resets after a delay using the [[resetOkAndBadTodos]] operator
 *
 * @param event
 */
const handleSaveEvent = (event: SaveEvent): Observable<unknown> => {
  // @ts-ignore (mitigates a typedoc issue)
  const operation = toPending(event.operation, EventType.Save as const);

  const updateTransaction = {
    // @ts-ignore (mitigates a typedoc issue)
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
 * ```hs
 * (_newTodoOperation$, setNewTodoOperation, getNewTodoOperation) :: StateObservable (Operation string void void)
 * -- aka
 * (_newTodoOperation$, setNewTodoOperation, getNewTodoOperation) :: (Observable (Operation string void void), (Operation string void void) -> void, () -> (Operation string void void))
 * ```
 * I'm destructuring the result of `stateOf` so that I can re-export
 * a piped version of `_newTodoOperation`
 */
const [_newTodoOperation$, setNewTodoOperation, getNewTodoOperation] = stateOf(
  makeNoop("") as NewTodoOperation
);

/**
 * @private
 * 
 * ```hs
 * newTodoOperation$ :: StateObservable (Operation string void void)
 * ```
 * 
 * [[StateObservable]] that handles creating a new [[Todo]] for the user.
 * It starts with a [[Noop]] operation of a `string`, the title of the new [[Todo]].
 * 
 * Any time the [[StateObservable]]'s `setState` function `setNewTodoOperation` is
 * called the observable's operator checks if the status has changed to [[Pending]]
 * and if so will direct the [[NewTodoOperation]] to the [[create]] API for storing
 * the new todo in the datatabase.
 *
 * Using [[thruple]] to re-export everything as a [[StateObservable]]
 *
 *
 */
export const newTodoOperation$: StateObservable<NewTodoOperation> = thruple(
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
)

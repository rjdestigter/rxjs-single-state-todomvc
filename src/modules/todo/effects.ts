/**
 * @module todo
 */
import {
  EventType,
  Todo,
  MutableTodo,
  SaveEvent,
  DeleteEvent,
  TodoWithOperation,
  TodoOperation
} from "./types";

// Transactions
import {
  Transaction,
  TransactionType,
  makeAddTransaction,
  makeUpdateTransaction,
  makeRemoveTransaction,
  Transactional
} from "../transactions";

// Operations
import { Ok, Bad, isOk, makeNoop } from "../operations";

// Utilities
import { toMutable } from "./utils";
import { tuple } from "../utils";

/** Operations that can be reset to Noop */
export type ResetableOperation =
  | Ok<Todo, EventType.Save>
  | Bad<MutableTodo, EventType.Save | EventType.Delete>;

/* Events that can be done over if there outcome fails. */
export type RedoableEvent = SaveEvent | DeleteEvent;

/* Effectful function for updating state */
export type Writer = (
  todos: Transaction<Transactional<TodoWithOperation>>
) => void;

/**
 * resetOkAndBadTodosEffect :: Write -> (RedoableEvent, ResetableOperation) -> ()
 *  
 * @param writer 
 */
export const resetOkAndBadTodosEffect = (writer: Writer) => ([
  event,
  operation
]: [RedoableEvent, ResetableOperation]) => {
  const noop = makeNoop(
    isOk(operation) ? toMutable(operation.state) : operation.state
  );

  const transaction = {
    type: TransactionType.Update,
    payload: isOk(operation)
      ? tuple(operation.state, noop)
      : tuple(event.todo, noop)
  };

  writer(transaction);
};

// What I want is:
// export const add = (write: Writer) => compose(write, makeAddTransaction)
// or go crazy
// and make add:
// curry(flip(compose)(makeAddTransaction))
// But TypeScript can't handle me

const makeWriteEffect = (
  transactionMaker: (
    data: Transactional<[Todo, TodoOperation]>
  ) => Transaction<Transactional<[Todo, TodoOperation]>>
) => (writer: Writer) => (data: Transactional<[Todo, TodoOperation]>) =>
  writer(transactionMaker(data));

export const addEffect = makeWriteEffect(makeAddTransaction);

export const updateEffect = makeWriteEffect(makeUpdateTransaction);

export const remoteEffect = makeWriteEffect(makeRemoveTransaction);

type DeleteOutcome =
  | Ok<Todo, EventType.Delete>
  | Bad<MutableTodo, EventType.Delete>;

export const runDeleteOutcomeEffect = (writer: Writer) => (todo: Todo) => (
  outcome: DeleteOutcome
) =>
  isOk(outcome)
    ? remoteEffect(writer)(tuple(todo, outcome))
    : updateEffect(writer)(tuple(todo, outcome));

type SaveOutcome = Ok<Todo, EventType.Save> | Bad<MutableTodo, EventType.Save>;

export const runSaveOutcomeEffect = (writer: Writer) => (todo: Todo) => (
  outcome: SaveOutcome
) => {
  updateEffect(writer)(
    tuple(isOk(outcome) ? { ...todo, ...outcome.state } : todo, outcome)
  );
};

export const runCreateOutcomeEffect = (writer: Writer) => (
  outcome: Ok<Todo> | Bad<string>
) => {
  if (isOk(outcome)) {
    const todoWithOperation = tuple(
      outcome.state,
      makeNoop({
        title: outcome.state.title,
        completed: false
      })
    );

    addEffect(writer)(todoWithOperation);
  }
};

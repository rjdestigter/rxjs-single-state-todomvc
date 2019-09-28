import { scan } from "rxjs/operators";

import { tuple } from "../utils";
import { TransactionType, Transaction, update, add, remove } from "../transactions";

import { stateOf } from "./stateOf";

/**
 * transactionalStateOf :: t | [t] -> (t -> t -> boolean) -> boolean -> (Observable [t], Transaction t | [t] -> void)
 * 
 * Creates a stateful, transactional observable for lists.
 */
export const transactionalStateOf = <T>(
  initialState: T | T[],
  isEqual: (t1: T, t2: T) => boolean = (t1, t2) => t1 === t2,
  isTuple: boolean = false
) => {
  const initialTransaction: Transaction<T | T[]> = {
    type: TransactionType.Add,
    payload: initialState
  } as any;



  const [state$, setState] = stateOf(initialTransaction);

  const transactional$ = state$.pipe(
    scan(
      (acc, transaction) => {
        switch (transaction.type) {
          case TransactionType.Add: {
            return add(isEqual, isTuple)(acc)(transaction)
          }
          case TransactionType.Update: {
            return update(isEqual, isTuple)(acc)(transaction)
          }

          case TransactionType.Remove: {
            return remove(isEqual, isTuple)(acc)(transaction)
          }

          default:
            return acc;
        }
      },
      [] as T[]
    )
  );

  return tuple(transactional$, setState);
};


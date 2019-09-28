import { tuple } from "../utils";

import { stateOf } from "./stateOf";
import { scan } from "rxjs/operators";

import { TransactionType, Transaction } from "../transactions";

/**
 * Value alias used to better clearly indicate when
 * passing `true` to `transactionalStateOf`'s third `isTuple` parameter.
 */
export const IS_TUPLE = true;

/**
 * Creates a stateful, transactional observable for lists
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

  /**
   * Wrapper around Array.isArray in case data T is a tuple like type.
   *
   * @param data
   */
  const isArray = <A>(data: A | A[]): data is A[] => {
    if (Array.isArray(data)) {
      return isTuple && data.length > 0 ? Array.isArray(data[0]) : true;
    }

    return false;
  };

  const [state$, setState] = stateOf(initialTransaction);

  const transactional$ = state$.pipe(
    scan(
      (acc, transaction) => {
        switch (transaction.type) {
          case TransactionType.Add: {
            const data = isTuple
              ? [
                  ...acc,
                  ...(isArray(transaction.payload)
                    ? transaction.payload
                    : [transaction.payload])
                ]
              : acc.concat(transaction.payload);
            return data;
          }
          case TransactionType.Update: {
            const next = [...acc];
            const data = isArray(transaction.payload)
              ? transaction.payload
              : [transaction.payload];

            data.forEach(record => {
              const index = acc.findIndex(r => isEqual(r, record));

              if (index >= 0) {
                next.splice(index, 1, record);
              } else {
                next.push(record);
              }
            });
            return next;
          }

          case TransactionType.Remove: {
            const data = isArray(transaction.payload)
              ? [...transaction.payload]
              : [transaction.payload];

            return acc.filter(record => {
              const index = data.findIndex(data => isEqual(record, data));
              if (index >= 0) {
                data.splice(index, 1);
                return false;
              }

              return true;
            });
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


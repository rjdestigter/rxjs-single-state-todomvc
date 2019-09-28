import { isArray } from "../utils";

import { TransactionLike, TransactionType } from "./types";

export * from "./types";
export * from "./utils";

/**
 * add :: (a -> a -> boolean) -> boolean - [a] -> Update a -> [a]
 *
 * Add data to state (a list of T) given the payload of an [[Add]] transaction
 * and return the next state.
 */
export const add = <T>(
  isEqual: (t1: T, t2: T) => boolean = (t1, t2) => t1 === t2,
  dataIsTuple = false
) => (state: T[]) => (
  transaction: TransactionLike<TransactionType.Add, T | T[]>
) => {
  const data = dataIsTuple
    ? [
        ...state,
        ...(isArray(dataIsTuple)(transaction.payload)
          ? transaction.payload
          : [transaction.payload])
      ]
    : state.concat(transaction.payload);
  return data;
};

/**
 * update :: (a -> a -> boolean) -> boolean -> [a] -> Update a -> [a]
 *
 * Update data in state (a list of T) given the payload of an [[Update]] transaction
 * and return the next state.
 */
export const update = <T>(
  isEqual: (t1: T, t2: T) => boolean = (t1, t2) => t1 === t2,
  dataIsTuple = false
) => (state: T[]) => (
  transaction: TransactionLike<TransactionType.Update, T | T[]>
) => {
  const next = [...state];
  const data = isArray(dataIsTuple)(transaction.payload)
    ? transaction.payload
    : [transaction.payload];

  data.forEach(record => {
    const index = next.findIndex(r => isEqual(r, record));

    if (index >= 0) {
      next.splice(index, 1, record);
    } else {
      next.push(record);
    }
  });
  return next;
};

/**
 * remove :: (a -> a -> boolean) -> boolean -> [a] -> Remove a -> [a]
 *
 * Remove data from state (a list of T) given the payload of an [[Remove]] transaction
 * and return the next state.
 */
export const remove = <T>(
  isEqual: (t1: T, t2: T) => boolean = (t1, t2) => t1 === t2,
  dataIsTuple = false
) => (state: T[]) => (
  transaction: TransactionLike<TransactionType.Remove, T | T[]>
) => {
  const data = isArray(dataIsTuple)(transaction.payload)
    ? [...transaction.payload]
    : [transaction.payload];

  return state.filter(record => {
    const index = data.findIndex(data => isEqual(record, data));
    if (index >= 0) {
      data.splice(index, 1);
      return false;
    }

    return true;
  });
};

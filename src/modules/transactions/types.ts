/**
 * @module transactions
 */

/**
 * Type of transaction you might apply to a dataset
 */
export enum TransactionType {
  Update = "Update",
  Remove = "Remove",
  Add = "Add"
}

/**
 * A [[TransactionType]] combined with a payload.
 */
export type TransactionLike<T, P> = {
  type: T;
  payload: P;
};

/**
 * A transaction decribing the dataset should update an existing
 * piece of data with information in this transaction's payload.
 */
export type Update<T> = TransactionLike<TransactionType.Update, T>;

/**
 * A transaction decribing the dataset should remove an existing
 * piece of data matching transaction's payload.
 */
export type Remove<T> = TransactionLike<TransactionType.Remove, T>;

/**
 * A transaction decribing the dataset should add a new piece
 * of data that is this transaction's payload.
 */
export type Add<T> = TransactionLike<TransactionType.Add, T>;

/**
 * An [[Add]], [[Update]], or [[Remomve]] transaction
 */
export type Transaction<A, U = A, R = A> = Add<A> | Update<U> | Remove<R>;

/**
 * Type describing data used in transactions for data sets that are lists
 */
export type Transactional<T> = T[] | T;

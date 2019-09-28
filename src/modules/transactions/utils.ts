/**
 * @module transactions
 */
import { TransactionType } from './types'

/**
 * makeTransactionMaker :: TransactionType -> a -> Add a
 * 
 * Creates a function for creating transaction objects of a specific type.
 * It is a curried function combining transaction type and payload in to a transaction object.
 * 
 * @param type The type of transaction
 */
const makeTransactionMaker = <T extends TransactionType>(type: T) => <P>(payload: P) => ({type, payload})


/**
 * makeAddTransaction :: p -> Add p
 * 
 * Creates an [[Add]] [[Transaction]] object for a given payload.
 * 
 * @param payload The transaction payload. 
 */
export const makeAddTransaction = makeTransactionMaker(TransactionType.Add)

/**
 * makeUpdateTransaction :: p -> Remove p
 * 
 * Creates an [[Update]] [[Transaction]] object for a given payload.
 * 
 * @param payload The transaction payload. 
 */
export const makeUpdateTransaction = makeTransactionMaker(TransactionType.Update)

/**
 * makeRemoveTransaction :: p -> Remove p
 * 
 * Creates an [[Remove]] [[Transaction]] object for a given payload.
 * 
 * @param payload The transaction payload. 
 */
export const makeRemoveTransaction = makeTransactionMaker(TransactionType.Remove)
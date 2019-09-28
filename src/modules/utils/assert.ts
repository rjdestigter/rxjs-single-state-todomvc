/**
 * @module utils
 */
/**
 * isNotNull :: a | null -> a asserted
 * 
 * Filter nullable types from an array
 * 
 * @param value The nullable value to be checked
 */
export const isNotNull = <T>(value: T | null): value is T => value != null;

/**
 * take :: number -> [a] -> [a]
 * 
 * Take a number of elements from a list.
 * 
 * @param amount The number of elements to take.
 */
export const take = (amount: number) => <T>(xs: T[]) => {
  const txs: T[] = [];
  const len = xs.length;

  for (let i = 0; i < len && i < amount; i += 1) {
    txs.push(xs[i]);
  }

  return txs;
};

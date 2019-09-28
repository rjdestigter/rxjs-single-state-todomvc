import { of, concat } from 'rxjs'
import { delay } from 'rxjs/operators'

/**
 * mapToAfterMs :: b -> number -> a -> Observable a | b
 * 
 * @param to Value to emit first
 * @param ms Delay second value by number of milliseconds
 */
export const mapToAfterMs = <B>(to: B, ms: number = 1000) => <A>(from: A) =>
  concat(of(from), of(to).pipe(delay(ms)));

/**
 * toNullAfterMs :: number -> b -> Observable null | b
 * 
 * @param ms Delay second value by number of milliseconds
 */
export const toNullAfterMs = (ms = 1000) => mapToAfterMs(null, ms);

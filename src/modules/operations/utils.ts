import { Status, Noop, Pending, Bad } from './types'

// Assertions
const makeIsStatus = <T extends Status>(statusType: T) => (
  checkedStatus: Status
): checkedStatus is T => statusType === checkedStatus;

export const statusTypeIsOk = makeIsStatus(Status.Ok);
export const statusTypeIsBad = makeIsStatus(Status.Bad);
export const statusTypeIsNoop = makeIsStatus(Status.Noop);
export const statusTypeIsPending = makeIsStatus(Status.Pending);

// type Foo = <S, O extends Operation<S>, A extends O['status']>

export const makeIsOperationOfStatus = <S extends Status>(
  f: (statusType: Status) => statusType is S
) => <O extends { status: Status }>(
  operation: O
): operation is Extract<O, { status: S }> => f(operation.status);

export const isOk = makeIsOperationOfStatus(statusTypeIsOk);
export const isBad = makeIsOperationOfStatus(statusTypeIsBad);
export const isNoop = makeIsOperationOfStatus(statusTypeIsNoop);
export const isPending = makeIsOperationOfStatus(statusTypeIsPending);

export const makeNoop = <T>(state: T): Noop<T> => {
  return {
    status: Status.Noop,
    state
  };
};

// export const toPendingWithAction = <T, A, B extends A>(operation: Noop<T> | Bad<T, A>, action: B): Pending<T, B> => toPending(operation, action)

export function toPending<T>(operation: Noop<T> | Bad<T>): Pending<T>;
export function toPending<T, A>(
  operation: Noop<T> | Bad<T, A>,
  action: A
): Pending<T, A>;
export function toPending<T, A>(
  operation: Noop<T> | Bad<T, A>,
  action?: A
): Pending<T, any> {
  if (action != null) {
    return {
      status: Status.Pending,
      state: operation.state,
      action
    };
  }

  return {
    status: Status.Pending,
    state: operation.state
  };
}


export enum Status {
  Noop = "Noop",
  Pending = "Pending",
  Ok = "Ok",
  Bad = "Bad"
}

export type Noop<T> = {
  status: Status.Noop;
  state: T;
};

export type Pending<T, A = void> = {
  status: Status.Pending;
  state: T;
} & (A extends void ? {} : { action: A });

export type Bad<T, A = void> = {
  status: Status.Bad;
  state: T;
  error: string;
} & (A extends void ? {} : { action: A });

export type Ok<T, A = void> = {
  status: Status.Ok;
  state: T;
} & (A extends void ? {} : { action: A });

export type Operation<T, U = T, A = void> =
  | Noop<T>
  | Pending<T, A>
  | Bad<T, A>
  | (U extends void ? Noop<T> : Ok<U, A>);


> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Why
I built this take on TodoMVC to learn RxJS. I specifically set out to develop a single state solution and to experiment with serializable, time-travelable state by composing observables.

I ended up with a few nice architectural solutions that I would like to talk about:

- Creating stateful observables using RxJS's `BehaviourSubject`
- Composing a map of observable into a single state observable.
- Using get/set defenitions for stateful observables allowing developers to update state in a mutuabale like fashion whil maintaining immutability.
- Abstracting operational state from model state.
- Using transactions to read, update, and remove from state.

Throughout the process I also experimented with point-free style and other functional programming concepts.

# How Does It Work

## Stateful observables

TODO

## A single state observable

TODO

## Mutable yet immutable

TODO

## Operational state

TODO

## Transactions

TODO
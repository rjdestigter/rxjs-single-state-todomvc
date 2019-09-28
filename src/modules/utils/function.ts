/**
 * @module utils
 */
/**
 * ```hs
 * once :: (a -> b) -> (a -> b)
 * ```
 * @typeparam A The funtions argument type.
 * @typearam B The functions return type.
 * @param f The function
 * @returns A version of function `f` that will only run once.
 */
export const once = <A, B>(f: (a: A) => B) => {
  let output: B | undefined;

  return (a: A) => {
    if (!output) {
      output = f(a);
    }

    return output;
  };
};

/**
 * ```hs
 * identity :: a -> a
 * ```
 * 
 * @typeparam T The type of value taken and returned.
 * @param value The value to return
 * @returns The same value that was passed as the argument.
 *
 * Identify function
 */
export const identity = <T>(value: T) => {
  return value;
};

/**
 * ```hs
 * compose :: (b -> c) -> (a -> b) -> c
 * ```
 * Read as "f" after "g"
 * @typeparam A The first function argument taken.
 * @typeparam B The result type of function `g` and argument for function `f`
 * @typeparam C The result type of function `f`
 * @params f The function to pass the result of function `g` to
 * @params g Function that computes the first result `B`
 * @returns A function that takes `A` and returns `C` by applying output of `g` to `f`
 *
 * Function composition. f after g. g andThen f
 */
export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) =>
  f(g(a));

/**
 * ```hs
 * flip :: (a -> b -> c) -> (b -> a -> c)
 * ```
 * @param f 
 */
export const flip = <A, B, C>(f: (a: A, b: B) => C) => (b: B, a: A) => f(a, b)


/**
 * TODO
 * @param f 
 */
export const curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => f(a, b)

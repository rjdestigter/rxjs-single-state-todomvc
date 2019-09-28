/**
 * once :: (a -> b) -> (a -> b)
 * @param f 
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
 * identity :: a -> a
 *
 * Identify function
 */
export const identity = <T>(value: T) => {
  return value;
};

/**
 * compose :: (b -> c) -> (a -> b) -> c
 *
 * Function composition. f after g. g andThen f
 */
export const compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) =>
  f(g(a));

/**
 * TODO
 * @param f 
 */
export const flip = <A, B, C>(f: (a: A, b: B) => C) => (b: B, a: A) => f(a, b)


/**
 * TODO
 * @param f 
 */
export const curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B) => f(a, b)

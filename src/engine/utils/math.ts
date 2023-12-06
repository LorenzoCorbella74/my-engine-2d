import { Point } from "../models/vectors";

let random = Math.random;
let seed = 42;

function angle(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const angle = Math.atan2(dy, dx);
  return angle;
}

/**
 * Clamps a value between a minimum and maximum value.
 * meaning that if x is less than min, it returns min, and if x is greater than max, it returns max.
 *
 * @param {number} x - The value to clamp.
 * @param {number} min - The minimum value to clamp to. Default is 0.
 * @param {number} max - The maximum value to clamp to. Default is 1.
 * @return {number} The clamped value.
 */
function clamp(x: number, min = 0, max = 1) {
  return Math.max(min, Math.min(x, max));
}

function distance(a: Point, b: Point) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the linear interpolation of a value between a minimum and maximum value.
 *
 * @param {number} x - The value to interpolate.
 * @param {number} min - The minimum value for interpolation. Defaults to 0.
 * @param {number} max - The maximum value for interpolation. Defaults to 1.
 * @return {number} The interpolated value.
 */
function lerp(x: number, min = 0, max = 1) {
  return (x - min) / (max - min);
}

/**
 * Calculates the mix of two numbers based on a parameter.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @param {number} p - The parameter used to mix the two numbers.
 * @return {number} The resulting mix of the two numbers.
 */
function mix(a: number, b: number, p: number) {
  return a * (1 - p) + b * p;
}

/**
 * Generates a random INTEGER number between the given minimum and maximum values.
 *
 * @param {number} min - The minimum value for the random number.
 * @param {number} max - The maximum value for the random number.
 * @return {number} The generated random number.
 */
function rand(min: number, max: number) {
  return Math.floor(randf(min, max));
}

function randf(min: number, max: number) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return random() * (max - min) + min;
}

/**
 * Generates a random boolean value based on the probability of 1 in a given range.
 *
 * @param {number} max - The upper limit of the range.
 * @return {boolean} Returns true if the randomly generated number is 0, otherwise false.
 */
function randOneIn(max: number) {
  return rand(0, max) === 0;
}

/**
 * Selects a random element from an array.
 *
 * @param {T[]} items - The array of items.
 * @return {T} - The randomly selected item.
 */
function randOneFrom<T>(items: T[]) {
  return items[rand(0, items.length)];
}


function randomSeed(s: number) {
  if (!isNaN(s)) {
    seed = s;
  }
  return seed;
}


/**
 * Generates a random number between 0 and 1 using the linear congruential generator algorithm.
 *
 * @return {number} The generated random number.
 */
function randomSeeded() {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  seed = (seed * 16807 + 0) % 2147483647;
  return seed / 2147483647;
}

/**
 * Initializes the use of a seeded random number generator.
 *
 * @param {boolean} blnUse - Indicates whether to use the seeded random number generator. Defaults to true.
 * @return {void} This function does not return a value.
 */
function useSeededRandom(blnUse = true) {
  randomSeeded();
  random = blnUse ? randomSeeded : Math.random;
}

const ease = {
  quadIn(x: number) {
    return x * x;
  },
  quadOut(x: number) {
    return 1 - this.quadIn(1 - x);
  },
  cubicIn(x: number) {
    return x * x * x;
  },
  cubicInOut(p: number) {
    if (p < 0.5) return this.cubicIn(p * 2) / 2;
    return 1 - this.cubicIn((1 - p) * 2) / 2;
  },
  elasticOut(x: number) {
    const p = 0.4;
    return Math.pow(2, -10 * x) *
      Math.sin((x - p / 4) *
        (Math.PI * 2) / p) + 1;
  }
};

export const math = {
  angle,
  clamp,
  distance,
  ease,
  lerp,
  mix,
  rand,
  randf,
  randOneIn,
  randOneFrom,
  randomSeed,
  useSeededRandom
};
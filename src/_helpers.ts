export function round(
  num: number,
  decimals: number = 0,
  keepZeros: boolean = false
): number | string {
  return keepZeros
    ? num.toFixed(decimals)
    : decimals === 0
    ? Math.round(num)
    : Math.round(num * 10 ** decimals) / 10 ** decimals;
}

export function randint(min: number, max: number): number {
  return ~~(Math.random() * (max - min + 1) + min);
}

export function randUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randNormal(mean: number, std: number, bound?: number): number {
  const value =
    mean +
    std *
      Math.sqrt(-2.0 * Math.log(Math.random())) *
      Math.cos(2.0 * Math.PI * Math.random());
  return bound && Math.abs(value - mean) > bound
    ? randNormal(mean, std, bound)
    : value;
}

export function randChoose(arr: Array<any>) {
  return arr[~~(Math.random() * arr.length)];
}

export function weightedChoice(weights: number[]): number {
  const cumsum: number[] = weights.map(
    (
      (sum) => (value) =>
        (sum += value)
    )(0)
  );
  const rand = Math.random() * cumsum[cumsum.length - 1];
  for (let i = 0; i < cumsum.length; i++) {
    if (cumsum[i] > rand) {
      return i;
    }
  }
  throw "Something went wrong in _helper>weightedChoice | " + weights;
}

export function eulerToPitchYawRoll(euler: {
  x: number;
  y: number;
  z: number;
}) {
  return {
    θ: (180.0 / Math.PI) * euler.x,
    ψ: (180.0 / Math.PI) * euler.y,
    φ: (180.0 / Math.PI) * euler.z,
  };
}

export function clamp(x: number, min: number, max: number): number {
  if (x < min) {
    return min;
  }

  if (x > max) {
    return max;
  }

  return x;
}

export function blackbodyColor(kelvin: number): string {
  let temp = kelvin / 100;
  let red: number, green: number, blue: number;

  if (temp <= 66) {
    red = 255;
    green = temp;
    green = 99.4708025861 * Math.log(green) - 161.1195681661;
    if (temp <= 19) {
      blue = 0;
    } else {
      blue = temp - 10;
      blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
    }
  } else {
    red = temp - 60;
    red = 329.698727446 * Math.pow(red, -0.1332047592);
    green = temp - 60;
    green = 288.1221695283 * Math.pow(green, -0.0755148492);
    blue = 255;
  }

  red = Math.round(clamp(red, 0, 255));
  green = Math.round(clamp(green, 0, 255));
  blue = Math.round(clamp(blue, 0, 255));

  return `rgb(${red}, ${green}, ${blue})`;
}

export function hasDuplicates(arr: Array<any>): boolean {
  for (let i = 0; i < arr.length; i++) {
    if (arr.indexOf(arr[i]) !== i) return true;
  }
  return false;
}

export function range(start: number, stop: number, step: number = 1) {
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  let result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}
type Coordinate2D = [x: number, y: number];
export function intersectingEdges(
  p1: Coordinate2D,
  p2: Coordinate2D,
  p3: Coordinate2D,
  p4: Coordinate2D
): boolean {
  if (hasDuplicates([p1.toString(), p2.toString(), p3.toString(), p4.toString()])) return false;

  const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
  const n1 = (p1[1] - p3[1]) * (p4[0] - p3[0]) - (p1[0] - p3[0]) * (p4[1] - p3[1]);
  const n2 = (p1[1] - p3[1]) * (p2[0] - p1[0]) - (p1[0] - p3[0]) * (p2[1] - p1[1]);
  if (d === 0) {
    return n1 == 0 && n2 == 0;
  };

  const r = n1 / d;
  const s = n2 / d;
  return r >= 0 && r <= 1 && s >= 0 && s <= 1;
}

export function addArrays(arr1: number[], arr2: number[]): number[] {
  if (arr1.length !== arr2.length) { throw "Array length mismatch" };
  
  return arr1.map((x, i) => (x + arr2[i]));
}

export function inRange(num: number, range: [low: number, high: number], inclusive?: boolean): boolean {
  // return (num > range[0] && num < range[1]) && (!inclusive || num === range[0] || num === range[1]);
  return (inclusive ?? true) ? (num >= range[0] && num <= range[1]) : (num > range[0] && num < range[1]);
}

export function sumOfSquares(arr: number[]): number {
  return arr.map(x => x * x).reduce((a, b) => (a + b));
}
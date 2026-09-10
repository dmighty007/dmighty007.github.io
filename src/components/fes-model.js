/**
 * Decoupled physical model equations for the Free-Energy Surface V(x, z).
 * Defines potential height, analytical gradients, and stochastic Langevin dynamics.
 */

export const BASIN_LEFT = { x: -1.4, z: -0.75 };
export const BASIN_RIGHT = { x: 1.4, z: 0.75 };

export const MOBILITY = 0.45;
export const THERMAL_ENERGY = 0.02; // kB * T
export const DIFFUSION = MOBILITY * THERMAL_ENERGY; // Einstein relation: D = mu * kB * T

export function fesHeight(x, z) {
  const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
  const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
  const dS2 = x * x * 1.4 + z * z * 1.4;

  return (
    -0.85 * Math.exp(-dA2 / 0.8) -
    0.75 * Math.exp(-dB2 / 0.9) +
    0.26 * Math.exp(-dS2) +
    0.035 * (x * x + z * z) -
    0.12
  );
}

export function fesGradient(x, z, out) {
  const dA2 = (x + 1.4) ** 2 + (z + 0.75) ** 2;
  const dB2 = (x - 1.4) ** 2 + (z - 0.75) ** 2;
  const dS2 = x * x * 1.4 + z * z * 1.4;

  const eA = Math.exp(-dA2 / 0.8);
  const eB = Math.exp(-dB2 / 0.9);
  const eS = Math.exp(-dS2);

  const dVx =
    -0.85 * eA * ((-2 * (x + 1.4)) / 0.8) -
    0.75 * eB * ((-2 * (x - 1.4)) / 0.9) +
    0.26 * eS * (-2.8 * x) +
    0.07 * x;

  const dVz =
    -0.85 * eA * ((-2 * (z + 0.75)) / 0.8) -
    0.75 * eB * ((-2 * (z - 0.75)) / 0.9) +
    0.26 * eS * (-2.8 * z) +
    0.07 * z;

  if (out && typeof out.set === "function") {
    out.set(dVx, dVz);
  }
  return { x: dVx, z: dVz };
}

export function gaussRandom() {
  let u, v, s;
  do {
    u = Math.random() * 2 - 1;
    v = Math.random() * 2 - 1;
    s = u * u + v * v;
  } while (s >= 1 || s === 0);
  return u * Math.sqrt((-2 * Math.log(s)) / s);
}

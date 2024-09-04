import { Vector3 } from "three";
import { SCALE_FACTOR } from "../constants";

export const scalePosition = (x: number, y: number, z: number) => {
  return new Vector3(x, y, z).multiplyScalar(SCALE_FACTOR);
};

export const scaleRadius = (radius: number = 0) => {
  return radius * SCALE_FACTOR;
};

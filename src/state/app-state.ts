import { atom } from "jotai";

export interface AppOptions {
  debug: boolean;
  hideHydrogens: boolean;
  molecule: string;
}

export const debugAtom = atom(false);
export const hideHydrogensAtom = atom(false);
export const moleculeAtom = atom("6324");

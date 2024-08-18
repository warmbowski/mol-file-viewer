import { atom } from "jotai";

export interface AppOptions {
  debug: boolean;
  hideHydrogens: boolean;
  molecule: string;
}

export const debugAtom = atom(false);
export const noHAtom = atom(false);
export const hideBallsAtom = atom(false);
export const hideSticksAtom = atom(false);
export const hideCloudsAtom = atom(false);
export const moleculeAtom = atom("6324");
export const ballRadiusAtom = atom(0);

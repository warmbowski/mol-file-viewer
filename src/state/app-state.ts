import { atom } from "jotai";
import { RadiusType } from "../constants";

export type CloudType = "none" | "atomic" | "vanderwaals";

const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item) as T;
    }
    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};

// Persisted
export const debugAtom = atomWithLocalStorage("nfv-debug", false);
export const noHAtom = atomWithLocalStorage("nfv-noHAtom", false);
export const hideBallsAtom = atomWithLocalStorage("nfv-hideBalls", false);
export const hideSticksAtom = atomWithLocalStorage("nfv-hideSticks", false);
// export const hideCloudsAtom = atomWithLocalStorage("nfv-hadeClouds", false);
export const cloudTypeAtom = atomWithLocalStorage<CloudType>(
  "nfv-cloud",
  "atomic"
);
export const ballRadiusAtom = atomWithLocalStorage<RadiusType>(
  "nfv-ballRadius",
  0
);
export const moleculeAtom = atomWithLocalStorage("nfv-molecule", "6324");

// Not persisted
export const dropElementsAtom = atom(false);

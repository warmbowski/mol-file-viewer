import { atom } from "jotai";
import { ElementData, PeriodicTable } from "../constants/periodicTable";
import { ColorTheme } from "../constants/colorThemes.noformat";
import { RootState } from "@react-three/fiber";

export type RadiusType = keyof ElementData["radius"];
export type CloudType = "none" | "atomic" | "vanderwaals" | "shrinkwrap";

const atomWithLocalStorage = <T>(
  key: string,
  initialValue: T,
  doNotPersistValues: T[] = []
) => {
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
      if (!doNotPersistValues.includes(nextValue)) {
        localStorage.setItem(key, JSON.stringify(nextValue));
      }
    }
  );
  return derivedAtom;
};

// Persisted
export const debugAtom = atomWithLocalStorage("nfv-debug", false);
export const noHAtom = atomWithLocalStorage("nfv-noHAtom", false);
export const hideBallsAtom = atomWithLocalStorage("nfv-hideBalls", false);
export const hideSticksAtom = atomWithLocalStorage("nfv-hideSticks", false);
export const colorThemeAtom = atomWithLocalStorage<ColorTheme>(
  "nfv-colorTheme",
  ColorTheme.ALT
);
// export const hideCloudsAtom = atomWithLocalStorage("nfv-hadeClouds", false);
export const cloudTypeAtom = atomWithLocalStorage<CloudType>(
  "nfv-cloud",
  "atomic"
);
export const ballRadiusAtom = atomWithLocalStorage<RadiusType>(
  "nfv-ballRadius",
  "fixed"
);
export const moleculeAtom = atomWithLocalStorage("nfv-molecule", "6324", [
  "custom",
]);

// Not persisted
// export const dropElementsAtom = atom(false);
export const canvasStateAtom = atom<RootState | null>(null);
export const fileToDownloadAtom = atom<Blob | null>(null);
export const processingWorkerAtom = atom(0);

// derived
export const periodicTableAtom = atom((get) => {
  const ct = get(colorThemeAtom);
  return new PeriodicTable(ct);
});

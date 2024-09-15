import { atom } from "jotai";
import { ElementData, PeriodicTable } from "../constants/periodicTable";
import { ColorTheme } from "../constants/colorThemes.noformat";
import { RootState } from "@react-three/fiber";
import { CompoundNameOrId } from "@api";

export type RadiusType = keyof ElementData["radius"];
export type CloudType = "none" | "atomic" | "vanderwaals" | "shrinkwrap";

const atomWithLocalStorage = <T>(
  key: string,
  initialValue: T,
  doNotPersistFunction?: (nextValue: T) => boolean
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
      if (doNotPersistFunction) {
        if (doNotPersistFunction(nextValue)) {
          return;
        }
      }
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );
  return derivedAtom;
};

// Persisted
export const debugAtom = atomWithLocalStorage("mfv-debug", false);
export const noHAtom = atomWithLocalStorage("mfv-noHAtom", false);
export const hideBallsAtom = atomWithLocalStorage("mfv-hideBalls", false);
export const hideSticksAtom = atomWithLocalStorage("mfv-hideSticks", false);
export const colorThemeAtom = atomWithLocalStorage<ColorTheme>(
  "mfv-colorTheme",
  ColorTheme.ALT
);
export const cloudTypeAtom = atomWithLocalStorage<CloudType>(
  "mfv-cloud",
  "atomic"
);
export const ballRadiusAtom = atomWithLocalStorage<RadiusType>(
  "mfv-ballRadius",
  "fixed"
);
export const pubChemMoleculeAtom =
  atomWithLocalStorage<CompoundNameOrId | null>(
    "mfv-selected-molecule",
    {
      text: "water",
      by: "name",
    },
    (nextValue) => nextValue?.text === "custom"
  );

// Not persisted
export const canvasStateAtom = atom<RootState | null>(null);
export const fileToDownloadAtom = atom<Blob | null>(null);
export const processingWorkerAtom = atom(0);

// derived
export const periodicTableAtom = atom((get) => {
  const ct = get(colorThemeAtom);
  return new PeriodicTable(ct);
});

import { Atom, atom } from "jotai";
import { RootState } from "@react-three/fiber";
import { ElementData, PeriodicTable } from "../constants/periodicTable";
import { ColorTheme } from "../constants/colorThemes.noformat";
import { simpleShallowEqual } from "@utils";
import { UPLOAD_MOLECULE_PLACEHOLDER } from "@constants";
import {
  SelectedMolecule,
  SelectedMoleculeSchema,
  selectedMoleculeSchema,
} from "./validations";

const atomWithLocalStorage = <T, V = void>(
  key: string,
  initialValue: T,
  validationSchema?: V,
  doNotPersistFunction?: (nextValue: T) => boolean
) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      if (validationSchema) {
        const parsed = JSON.parse(item);
        try {
          // validate local storage value
          return selectedMoleculeSchema.parse(parsed) as T;
        } catch {
          // if local storage value is corrupted, remove it
          localStorage.removeItem(key);
          return initialValue;
        }
      } else {
        return JSON.parse(item) as T;
      }
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

export function atomWithHistory<T>(
  targetAtom: Atom<T>,
  limit: number,
  initialHistory: T[]
) {
  const getInitialValue = () => initialHistory || ([] as T[]);
  const historyAtom = atom(
    () => getInitialValue(),
    (get) => () => void (get(historyAtom).length = 0)
  );
  historyAtom.onMount = (mount) => mount();
  historyAtom.debugPrivate = true;
  return atom((get) => {
    const ref = get(historyAtom);
    const filteredRef = ref.filter(
      (item) => !simpleShallowEqual(item, get(targetAtom))
    );
    return [get(targetAtom), ...filteredRef].slice(0, limit);
  });
}

// ***** Atoms *****
export type RadiusType = keyof ElementData["radius"];
export type CloudType = "none" | "atomic" | "vanderwaals" | "shrinkwrap";

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
export const selectedMoleculeAtom = atomWithLocalStorage<
  SelectedMolecule,
  SelectedMoleculeSchema
>(
  "mfv-selected-molecule",
  {
    text: "water",
    by: "name",
  },
  selectedMoleculeSchema,
  (nextValue) => nextValue?.text === UPLOAD_MOLECULE_PLACEHOLDER
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

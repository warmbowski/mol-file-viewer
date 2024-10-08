import { atom } from "jotai";
import { RootState } from "@react-three/fiber";
import { ElementData, PeriodicTable } from "../constants/periodicTable";
import { ColorTheme } from "../constants/colorThemes.noformat";
import { INITIAL_HISTORY, UPLOAD_MOLECULE_PLACEHOLDER } from "@constants";
import {
  SelectedMolecule,
  SelectedMoleculeSchema,
  selectedMoleculeSchema,
} from "./validations";
import { atomWithLocalStorage, getMoleculeFromUrlSearchParams } from "./logic";
import { simpleShallowEqual } from "@utils";

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
  getMoleculeFromUrlSearchParams(),
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

const historyBaseAtom = atomWithLocalStorage<SelectedMolecule[]>(
  "mfv-molecule-history",
  INITIAL_HISTORY || []
);
export const selectedHistoryAtom = atom(
  (get) => get(historyBaseAtom),
  (get, set, newValue) => {
    const newItem =
      typeof newValue === "function"
        ? newValue(get(selectedHistoryAtom))
        : (newValue as SelectedMolecule);
    const filteredHistory = get(historyBaseAtom).filter((histItem) => {
      return !simpleShallowEqual(histItem, newItem);
    });
    set(historyBaseAtom, [newItem, ...filteredHistory].splice(0, 10));
  }
);

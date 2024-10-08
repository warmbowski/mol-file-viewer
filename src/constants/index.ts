import { SelectedMolecule } from "@state";

export const SCALE_FACTOR = 10;
export const FOV = 25;
export const INIT_CAMERA_Z = 13 * SCALE_FACTOR;
export const FIXED_RADIUS_PM = 30;
export const FIXED_RADIUS_H_PM = 20;
export const STICK_RADIUS = 0.06;
export const STICK_RADIUS_AROMATIC = 0.16;
export const DEFAULT_CLOUD_COLOR = 0x4d99ff;
export const HEADER_HEIGHT = 48;
export const FOOTER_HEIGHT = 48;
export const UPLOAD_MOLECULE_PLACEHOLDER = "custom";

export const INITIAL_HISTORY: SelectedMolecule[] = [
  { text: "water", by: "name" },
  { text: "ethane", by: "name" },
  { text: "ethanol", by: "name" },
  { text: "benzoic acid", by: "name" },
  { text: "caffeine", by: "name" },
  { text: "nepetalactone", by: "name" },
  { text: "dichlorodiphenyldichloroethylene", by: "name" },
  { text: "cyclotriphosphazene", by: "name" },
  { text: "cyclotetraphosphazene", by: "name" },
];

// remove this object and just use the array of keys once
// the mol files are deleted from the public folder
const MOLECULE_OPTIONS = {
  water: "",
  ethane: "6324",
  ethanol: "682",
  "benzoic acid": "238",
  caffeine: "2424",
  nepetalactone: "141747",
  dichlorodiphenyldichloroethylene: "2927",
  // "Silicon Compound": "CT1066647122",
  cyclotriphosphazene: "",
  cyclotetraphosphazene: "",
};
export const DEFAULT_MOLECULE_OPTIONS = Object.keys(MOLECULE_OPTIONS);

/**
 * Only use * exports at root of a module or alias
 */
export * from "./periodicTable";
export * from "./colorThemes.noformat";
export * from "./types";

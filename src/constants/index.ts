export const SCALE_FACTOR = 10;
export const FIXED_RADIUS_PM = 30;
export const FIXED_RADIUS_H_PM = 20;
export const STICK_RADIUS = 0.06;
export const STICK_RADIUS_AROMATIC = 0.16;
export const DEFAULT_CLOUD_COLOR = 0x4d99ff;
export const HEADER_HEIGHT = 48;
export const FOOTER_HEIGHT = 48;

const MOLECULE_OPTIONS = {
  water: "",
  ethane: "6324",
  ethanol: "682",
  "benzoic acid": "238",
  caffeine: "2424",
  nepetalactone: "141747",
  dichlorodiphenyldichloroethylene: "2927",
  "Silicon Compound": "CT1066647122",
  cyclotriphosphazene: "CT1083511253",
  cyclotetraphosphazene: "CT1083511253",
};
export const DEFAULT_MOLECULE_OPTIONS = Object.keys(MOLECULE_OPTIONS);

/**
 * Only use * exports at root of a module or alias
 */
export * from "./periodicTable";
export * from "./colorThemes.noformat";
export * from "./types";

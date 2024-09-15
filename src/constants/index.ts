export const SCALE_FACTOR = 10;
export const FIXED_RADIUS_PM = 30;
export const FIXED_RADIUS_H_PM = 20;
export const STICK_RADIUS = 0.06;
export const STICK_RADIUS_AROMATIC = 0.16;
export const DEFAULT_CLOUD_COLOR = 0x4d99ff;
export const HEADER_HEIGHT = 48;
export const FOOTER_HEIGHT = 48;

export const MOLECULE_OPTIONS = {
  Ethane: "6324",
  Ethanol: "682",
  "Benzoic acid": "238",
  Caffiene: "2424",
  Catnip: "141747",
  Dichlorodiphenyldichloroethylene: "2927",
  "Silicon Compound": "CT1066647122",
  "Phosphazene Compound": "CT1083511253",
  custom: "custom",
};

/**
 * Only use * exports at root of a module or alias
 */
export * from "./periodicTable";
export * from "./colorThemes.noformat";
export * from "./types";

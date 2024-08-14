export enum BondType {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  AROMATIC = 4,
}

/**
 * atom positions are in angstroms, so atomic radii are listed in angstroms
 * as well in htis map. Ideally, the radii would be dependent on the bond
 * (https://www.webelements.com/carbon/atom_sizes.html), but using the
 * "emperical" values is a good starting point.
 */
export const ELEMENT_DATA_MAP = new Map([
  ["C", { radius: 0.7, color: 0x333333 }],
  ["H", { radius: 0.25, color: 0xffffff }],
  ["O", { radius: 0.6, color: 0xff0000 }],
  ["N", { radius: 0.65, color: 0x0000ff }],
  ["S", { radius: 1.0, color: 0xffff00 }],
  ["P", { radius: 1.0, color: 0xff00ff }],
  ["F", { radius: 0.5, color: 0x00ff00 }],
  ["Cl", { radius: 1.0, color: 0x00ff00 }],
  ["Br", { radius: 1.15, color: 0x00ff00 }],
  ["I", { radius: 1.4, color: 0x00ff00 }],
]);

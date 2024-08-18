export enum BondType {
  NONE = 0,
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
  AROMATIC = 4,
  VANDERWAALS = 5,
}

export enum StericToHybridization {
  sp = 2,
  sp2 = 3,
  sp3 = 4,
  sp3d = 5,
  sp3d2 = 6,
}

/**
 * Color palette
 * https://coolors.co/palette/001524-15616d-ffecd1-ff7d00-78290f-f5cb5c
 * https://coolors.co/palette/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226
 */

/**
 * atom positions are in angstroms, so [BondType.NONE] radii are listed in angstroms
 * as well in htis map. Ideally, the radii would be dependent on the bond
 * (https://www.webelements.com/carbon/atom_sizes.html), but using the
 * "emperical" values is a good starting point.
 */
export const ELEMENT_DATA_MAP = new Map([
  [
    "C",
    {
      radius: 0.7,
      color: 0x001524,
      radii: {
        [BondType.NONE]: 0.7,
        [BondType.SINGLE]: 0.77,
        [BondType.DOUBLE]: 0.66,
        [BondType.TRIPLE]: 0.6,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.77,
      },
      valence: 4,
      lonePair: 0,
    },
  ],
  [
    "H",
    {
      radius: 0.25,
      color: 0xffecd1,
      radii: {
        [BondType.NONE]: 0.25,
        [BondType.SINGLE]: 0.32,
        [BondType.DOUBLE]: NaN,
        [BondType.TRIPLE]: NaN,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.2,
      },
      valence: 1,
      lonePair: 0,
    },
  ],
  [
    "O",
    {
      radius: 0.6,
      color: 0xff7d00,
      radii: {
        [BondType.NONE]: 0.6,
        [BondType.SINGLE]: 0.63,
        [BondType.DOUBLE]: 0.57,
        [BondType.TRIPLE]: 0.53,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.5,
      },
      valence: 6,
      lonePair: 2,
    },
  ],
  [
    "N",
    {
      radius: 0.65,
      color: 0x15616d,
      radii: {
        [BondType.NONE]: 0.65,
        [BondType.SINGLE]: 0.71,
        [BondType.DOUBLE]: 0.6,
        [BondType.TRIPLE]: 0.54,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.66,
      },
      valence: 5,
      lonePair: 1,
    },
  ],
  [
    "S",
    {
      radius: 1.0,
      color: 0xf5cb5c,
      radii: {
        [BondType.NONE]: 1.0,
        [BondType.SINGLE]: 1.02,
        [BondType.DOUBLE]: 0.94,
        [BondType.TRIPLE]: 0.95,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.89,
      },
      valence: 6,
      lonePair: 2,
    },
  ],
  [
    "P",
    {
      radius: 1.0,
      color: 0x78290f,
      radii: {
        [BondType.NONE]: 1.0,
        [BondType.SINGLE]: 1.11,
        [BondType.DOUBLE]: 1.02,
        [BondType.TRIPLE]: 0.94,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.9,
      },
      valence: 5,
      lonePair: 1,
    },
  ],
  [
    "F",
    {
      radius: 0.5,
      color: 0x94d2bd,
      radii: {
        [BondType.NONE]: 0.5,
        [BondType.SINGLE]: 0.64,
        [BondType.DOUBLE]: 0.59,
        [BondType.TRIPLE]: 0.53,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.46,
      },
      valence: 1,
      lonePair: 3,
    },
  ],
  [
    "Cl",
    {
      radius: 1.0,
      color: 0x94d2bd,
      radii: {
        [BondType.NONE]: 1.0,
        [BondType.SINGLE]: 0.99,
        [BondType.DOUBLE]: 0.95,
        [BondType.TRIPLE]: 0.93,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.82,
      },
      valence: 1,
      lonePair: 3,
    },
  ],
  [
    "Br",
    {
      radius: 1.15,
      color: 0x94d2bd,
      radii: {
        [BondType.NONE]: 1.15,
        [BondType.SINGLE]: 1.14,
        [BondType.DOUBLE]: 1.09,
        [BondType.TRIPLE]: 1.1,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 1.86,
      },
      valence: 1,
      lonePair: 3,
    },
  ],
  [
    "I",
    {
      radius: 1.4,
      color: 0x94d2bd,
      radii: {
        [BondType.NONE]: 1.4,
        [BondType.SINGLE]: 1.33,
        [BondType.DOUBLE]: 1.29,
        [BondType.TRIPLE]: 1.25,
        [BondType.AROMATIC]: NaN,
        [BondType.VANDERWAALS]: 2.04,
      },
      valence: 1,
      lonePair: 3,
    },
  ],
]);

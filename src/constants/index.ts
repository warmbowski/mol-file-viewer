export const FIXED_RADIUS_PM = 30;
export const FIXED_RADIUS_H_PM = 20;
export const STICK_RADIUS = 0.06;
export const STICK_RADIUS_AROMATIC = 0.16;
export const DEFAULT_CLOUD_COLOR = 0x4d99ff;

// enum RadiusType {
//   Fixed = -1,
//   Atomic = 0,
//   CovalentSingle = 1,
//   CovalentDouble = 2,
//   CovalentTriple = 3,
//   Aromatic = 4,
//   VanDerWaals = 5,
// }

// export const ELEMENT_DATA_MAP = new Map([
//   [
//     "C",
//     {
//       radius: 0.7,
//       color: 0x001524,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 0.7,
//         [RadiusType.CovalentSingle]: 0.77,
//         [RadiusType.CovalentDouble]: 0.66,
//         [RadiusType.CovalentTriple]: 0.6,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.77,
//       },
//       valence: 4,
//       lonePair: 0,
//     },
//   ],
//   [
//     "H",
//     {
//       radius: 0.25,
//       color: 0xffecd1,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_H_PM / 100,
//         [RadiusType.Atomic]: 0.25,
//         [RadiusType.CovalentSingle]: 0.32,
//         [RadiusType.CovalentDouble]: NaN,
//         [RadiusType.CovalentTriple]: NaN,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.2,
//       },
//       valence: 1,
//       lonePair: 0,
//     },
//   ],
//   [
//     "O",
//     {
//       radius: 0.6,
//       color: 0xff7d00,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 0.6,
//         [RadiusType.CovalentSingle]: 0.63,
//         [RadiusType.CovalentDouble]: 0.57,
//         [RadiusType.CovalentTriple]: 0.53,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.5,
//       },
//       valence: 6,
//       lonePair: 2,
//     },
//   ],
//   [
//     "N",
//     {
//       radius: 0.65,
//       color: 0x15616d,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 0.65,
//         [RadiusType.CovalentSingle]: 0.71,
//         [RadiusType.CovalentDouble]: 0.6,
//         [RadiusType.CovalentTriple]: 0.54,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.66,
//       },
//       valence: 5,
//       lonePair: 1,
//     },
//   ],
//   [
//     "S",
//     {
//       radius: 1.0,
//       color: 0xf5cb5c,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 1.0,
//         [RadiusType.CovalentSingle]: 1.02,
//         [RadiusType.CovalentDouble]: 0.94,
//         [RadiusType.CovalentTriple]: 0.95,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.89,
//       },
//       valence: 6,
//       lonePair: 2,
//     },
//   ],
//   [
//     "P",
//     {
//       radius: 1.0,
//       color: 0x78290f,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 1.0,
//         [RadiusType.CovalentSingle]: 1.11,
//         [RadiusType.CovalentDouble]: 1.02,
//         [RadiusType.CovalentTriple]: 0.94,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.9,
//       },
//       valence: 5,
//       lonePair: 1,
//     },
//   ],
//   [
//     "F",
//     {
//       radius: 0.5,
//       color: 0x94d2bd,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 0.5,
//         [RadiusType.CovalentSingle]: 0.64,
//         [RadiusType.CovalentDouble]: 0.59,
//         [RadiusType.CovalentTriple]: 0.53,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.46,
//       },
//       valence: 1,
//       lonePair: 3,
//     },
//   ],
//   [
//     "Cl",
//     {
//       radius: 1.0,
//       color: 0x94d2bd,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 1.0,
//         [RadiusType.CovalentSingle]: 0.99,
//         [RadiusType.CovalentDouble]: 0.95,
//         [RadiusType.CovalentTriple]: 0.93,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.82,
//       },
//       valence: 1,
//       lonePair: 3,
//     },
//   ],
//   [
//     "Br",
//     {
//       radius: 1.15,
//       color: 0x94d2bd,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 1.15,
//         [RadiusType.CovalentSingle]: 1.14,
//         [RadiusType.CovalentDouble]: 1.09,
//         [RadiusType.CovalentTriple]: 1.1,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 1.86,
//       },
//       valence: 1,
//       lonePair: 3,
//     },
//   ],
//   [
//     "I",
//     {
//       radius: 1.4,
//       color: 0x94d2bd,
//       radii: {
//         [RadiusType.Fixed]: FIXED_RADIUS_PM / 100,
//         [RadiusType.Atomic]: 1.4,
//         [RadiusType.CovalentSingle]: 1.33,
//         [RadiusType.CovalentDouble]: 1.29,
//         [RadiusType.CovalentTriple]: 1.25,
//         [RadiusType.Aromatic]: NaN,
//         [RadiusType.VanDerWaals]: 2.04,
//       },
//       valence: 1,
//       lonePair: 3,
//     },
//   ],
// ]);

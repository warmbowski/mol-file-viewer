export enum BondType {
  SINGLE = 1,
  DOUBLE = 2,
  TRIPLE = 3,
}

export const ELEMENT_DATA_MAP = new Map([
  ["C", { radius: 0.8, color: 0x333333 }],
  ["H", { radius: 0.3, color: 0xffffff }],
  ["O", { radius: 0.5, color: 0xff0000 }],
  ["N", { radius: 0.6, color: 0x0000ff }],
  ["S", { radius: 0.8, color: 0xffff00 }],
  ["P", { radius: 0.9, color: 0xff00ff }],
  ["F", { radius: 0.4, color: 0x00ff00 }],
  ["Cl", { radius: 0.5, color: 0x00ff00 }],
  ["Br", { radius: 0.6, color: 0x00ff00 }],
  ["I", { radius: 0.7, color: 0x00ff00 }],
]);

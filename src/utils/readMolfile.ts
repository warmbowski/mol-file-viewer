import { ElementSymbol } from "../constants/types";

export interface MoleculeObject {
  header: MoleculeHeader;
  counts: MoleculeCounts;
  extents: MoleculeExtents;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
  properties: string;
  base64: string;
}

export function readMolFile(molFile: string): MoleculeObject {
  const lines = molFile.split("\n");

  // parse out header information
  const header = parseHeader(lines);

  // parse out counts information
  const counts = parseCounts(lines);

  // parse out atoms block
  let atoms = parseMoleculeAtoms(lines, 4, counts.atoms);

  // parse out bonds block
  const bonds = parseMoleculeBonds(lines, counts.atoms + 4, counts.bonds);

  // calculate extents
  const extents = cacluateMoleculeExtents(atoms);

  // parse out properties
  const properties = parseMoleculeProperties(
    lines,
    counts.atoms + counts.bonds + 4
  );

  // shift atoms around mid extents
  atoms = shiftAtomsAroundCenter(atoms, extents);

  // build molecule tree on MoleculeAtom objects
  atoms = buildMoleculeTree(atoms, bonds);

  const molecule = {
    header,
    counts,
    atoms,
    bonds,
    extents,
    properties,
    base64: btoa(molFile),
  };

  return molecule;
}

export interface MoleculeHeader {
  title: string;
  program: string;
  timestamp: string;
  comment: string;
}

function parseHeader(fileLines: string[]): MoleculeHeader {
  const [program, timestamp] = fileLines[1].split("  ");
  return {
    title: fileLines[0] || "",
    program: program || "",
    timestamp: timestamp || "",
    comment: fileLines[2] || "",
  };
}

export interface MoleculeCounts {
  atoms: number;
  bonds: number;
  lists: number;
  chiral: boolean;
  stext: string;
}

function parseCounts(fileLines: string[]): MoleculeCounts {
  const countChunks = [];
  for (let i = 0; i < fileLines[3].length; i += 3) {
    countChunks.push(fileLines[3].slice(i, i + 3));
  }
  return countChunks.reduce((acc, cur, idx) => {
    switch (idx) {
      case 0:
        acc.atoms = Number(cur.trim());
        break;
      case 1:
        acc.bonds = Number(cur.trim());
        break;
      case 2:
        acc.lists = Number(cur.trim());
        break;
      case 4:
        acc.chiral = Number(cur.trim()) === 1 ? true : false;
        break;
      case 5:
        acc.stext = cur;
        break;
    }
    return acc;
  }, {} as MoleculeCounts);
}

export interface MoleculeAtom {
  id: number;
  x: number;
  y: number;
  z: number;
  symbol: ElementSymbol;
  bondedAtoms: MoleculeAtom[];
}

function parseMoleculeAtoms(
  fileLines: string[],
  startLineIndex: number,
  lineCount: number
): MoleculeAtom[] {
  const atomsArray: MoleculeAtom[] = [];
  for (let i = startLineIndex; i < startLineIndex + lineCount; i++) {
    const atom = {
      id: i - startLineIndex + 1,
      x: Number(fileLines[i].slice(0, 10).trim()),
      y: Number(fileLines[i].slice(10, 20).trim()),
      z: Number(fileLines[i].slice(20, 30).trim()),
      symbol: fileLines[i].slice(31, 33).trim() as ElementSymbol,
      bondedAtoms: [], // will be filled in later by linkAtoms function
    };
    atomsArray.push(atom);
  }
  return atomsArray;
}

export interface MoleculeBond {
  id: number;
  atom1: number;
  atom2: number;
  type: number;
}

function parseMoleculeBonds(
  fileLines: string[],
  startLineIndex: number,
  lineCount: number
): MoleculeBond[] {
  const bondsArray: MoleculeBond[] = [];

  for (let i = startLineIndex; i < startLineIndex + lineCount; i++) {
    const bond = {
      id: i - startLineIndex + 1,
      atom1: Number(fileLines[i].slice(0, 3).trim()),
      atom2: Number(fileLines[i].slice(3, 6).trim()),
      type: Number(fileLines[i].slice(6, 9).trim()),
    };
    bondsArray.push(bond);
  }
  return bondsArray;
}

function parseMoleculeProperties(fileLines: string[], startLineIndex: number) {
  // temporary implementation until we have a better understanding of
  // how to apply properties to the molecule data (i.e. charge, etc.)
  const properties = [];
  const endLineIndex = fileLines.findIndex((line) => line === "M  END");
  if (endLineIndex === -1 || endLineIndex < startLineIndex) return "";

  for (let i = startLineIndex; i < endLineIndex; i++) {
    properties.push(fileLines[i]);
  }
  return properties.join("\n");
}

export interface MoleculeExtents {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  mid: { x: number; y: number; z: number };
}

function cacluateMoleculeExtents(atoms: MoleculeAtom[]): MoleculeExtents {
  const extents = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity },
    mid: { x: 0, y: 0, z: 0 },
  };

  for (const atom of atoms) {
    extents.min.x = Math.min(extents.min.x, atom.x);
    extents.min.y = Math.min(extents.min.y, atom.y);
    extents.min.z = Math.min(extents.min.z, atom.z);

    extents.max.x = Math.max(extents.max.x, atom.x);
    extents.max.y = Math.max(extents.max.y, atom.y);
    extents.max.z = Math.max(extents.max.z, atom.z);
  }

  extents.mid = {
    x: (extents.min.x + extents.max.x) / 2,
    y: (extents.min.y + extents.max.y) / 2,
    z: (extents.min.z + extents.max.z) / 2,
  };
  return extents;
}

function shiftAtomsAroundCenter(
  atoms: MoleculeAtom[],
  extents: MoleculeExtents
) {
  return atoms.map((atom) => ({
    ...atom,
    x: atom.x - extents.mid.x,
    y: atom.y - extents.mid.y,
    z: atom.z - extents.mid.z,
  }));
}

function buildMoleculeTree(atoms: MoleculeAtom[], bonds: MoleculeBond[]) {
  const atomMap = new Map(atoms.map((a) => [a.id, a]));

  for (const bond of bonds) {
    const a1 = atomMap.get(bond.atom1);
    const a2 = atomMap.get(bond.atom2);

    if (!a1 || !a2) {
      throw new Error("Invalid bond");
    } else {
      a1.bondedAtoms.push(a2);
      a2.bondedAtoms.push(a1);
    }
  }

  return [...atomMap.values()];
}

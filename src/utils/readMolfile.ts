import { BondType } from "../constants";

export interface AtomData {
  id: number;
  x: number;
  y: number;
  z: number;
  symbol: string;
}

export interface BondData {
  atom1: number;
  atom2: number;
  type: BondType;
}

export interface MoleculeData {
  atoms: AtomData[];
  bonds: BondData[];
}

export interface MolObj {
  header: {
    title: string;
    program: string;
    timeStamp: string;
    comment: string;
  };
  counts: {
    atoms: number;
    bonds: number;
    lists: number;
    chiral: boolean;
    stext: string;
  };
  atoms: AtomData[];
  bonds: BondData[];
  extents: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
    mid: { x: number; y: number; z: number };
  };
}

export function readMolFile(molFile: string): MolObj {
  const split = molFile.split("\n");

  // parse out header information
  const header: MolObj["header"] = {
    title: split[0] || "",
    program: split[1].split("  ")[1] || "",
    timeStamp: split[1].split("  ")[2] || "",
    comment: split[2] || "",
  };

  // parse out counts information
  const countChunks = [];
  for (let i = 0; i < split[3].length; i += 3) {
    countChunks.push(split[3].slice(i, i + 3));
  }
  const counts = countChunks.reduce((acc, cur, idx) => {
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
  }, {} as MolObj["counts"]);

  // parse out atoms and molecule bounds
  const atomsArray: MolObj["atoms"] = [];
  const extents = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity },
    mid: { x: 0, y: 0, z: 0 },
  };

  for (let i = 4; i < 4 + counts.atoms; i++) {
    const atom = {
      id: i - counts.atoms - 3,
      x: Number(split[i].slice(0, 10).trim()),
      y: Number(split[i].slice(10, 20).trim()),
      z: Number(split[i].slice(20, 30).trim()),
      symbol: split[i].slice(31, 33).trim(),
    };
    atomsArray.push(atom);

    extents.min = {
      x: Math.min(extents.min.x, atom.x),
      y: Math.min(extents.min.y, atom.y),
      z: Math.min(extents.min.z, atom.z),
    };
    extents.max = {
      x: Math.max(extents.max.x, atom.x),
      y: Math.max(extents.max.y, atom.y),
      z: Math.max(extents.max.z, atom.z),
    };
  }

  extents.mid = {
    x: (extents.min.x + extents.max.x) / 2,
    y: (extents.min.y + extents.max.y) / 2,
    z: (extents.min.z + extents.max.z) / 2,
  };

  // parse out bonds
  const bondsArray: MolObj["bonds"] = [];
  for (let i = 4 + counts.atoms; i < 4 + counts.atoms + counts.bonds; i++) {
    const bond = {
      atom1: Number(split[i].slice(0, 3).trim()),
      atom2: Number(split[i].slice(3, 6).trim()),
      type: Number(split[i].slice(6, 9).trim()),
    };
    bondsArray.push(bond);
  }

  return {
    header,
    counts,
    atoms: atomsArray.map((atom) => ({
      ...atom,
      x: atom.x - extents.mid.x,
      y: atom.y - extents.mid.y,
      z: atom.z - extents.mid.z,
    })),
    bonds: bondsArray,
    extents,
  };
}

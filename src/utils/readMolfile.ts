import { BondType } from "../constants";

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
  atoms: Array<{
    x: number;
    y: number;
    z: number;
    type: string;
  }>;
  bonds: Array<{
    atom1: number;
    atom2: number;
    type: BondType;
  }>;
  molecule: {
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
  const atomsArray = [];
  const molecule = {
    min: { x: Infinity, y: Infinity, z: Infinity },
    max: { x: -Infinity, y: -Infinity, z: -Infinity },
    mid: { x: 0, y: 0, z: 0 },
  };

  for (let i = 4; i < 4 + counts.atoms; i++) {
    const atom = {
      x: Number(split[i].slice(0, 10).trim()),
      y: Number(split[i].slice(10, 20).trim()),
      z: Number(split[i].slice(20, 30).trim()),
      type: split[i].slice(31, 33).trim(),
    };
    atomsArray.push(atom);

    molecule.min = {
      x: Math.min(molecule.min.x, atom.x),
      y: Math.min(molecule.min.y, atom.y),
      z: Math.min(molecule.min.z, atom.z),
    };
    molecule.max = {
      x: Math.max(molecule.max.x, atom.x),
      y: Math.max(molecule.max.y, atom.y),
      z: Math.max(molecule.max.z, atom.z),
    };
  }

  molecule.mid = {
    x: (molecule.min.x + molecule.max.x) / 2,
    y: (molecule.min.y + molecule.max.y) / 2,
    z: (molecule.min.z + molecule.max.z) / 2,
  };

  // parse out bonds
  const bondsArray = [];
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
      x: atom.x - molecule.mid.x,
      y: atom.y - molecule.mid.y,
      z: atom.z - molecule.mid.z,
    })),
    bonds: bondsArray,
    molecule,
  };
}

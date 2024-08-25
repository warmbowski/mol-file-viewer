import { BallElement } from "./BallElement";
import { Vector3 } from "three";
import { MoleculeAtom } from "../utils/readMolfile";

interface BallElementsProps {
  atoms: MoleculeAtom[];
}

export function BallElements({ atoms }: BallElementsProps) {
  return atoms.map((atom, index) => {
    const { x, y, z, symbol } = atom;

    return (
      <BallElement
        key={`${symbol}${index}`}
        symbol={symbol}
        position={new Vector3(x, y, z)}
      />
    );
  });
}

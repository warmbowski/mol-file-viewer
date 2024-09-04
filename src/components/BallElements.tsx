import { BallElement } from "./BallElement";
import { MoleculeAtom } from "../utils/readMolfile";
import { scalePosition } from "../utils/scaleModelData";

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
        position={scalePosition(x, y, z)}
      />
    );
  });
}

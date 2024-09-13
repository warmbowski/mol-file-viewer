import { BallElement } from "./BallElement";
import { MoleculeAtom, scalePosition } from "@utils";

interface BallElementsProps {
  atoms: MoleculeAtom[];
}

export function BallElements({ atoms }: BallElementsProps) {
  return (
    <group name="atoms">
      {atoms.map((atom, index) => {
        const { x, y, z, symbol } = atom;

        return (
          <BallElement
            key={`${symbol}${index}`}
            symbol={symbol}
            position={scalePosition(x, y, z)}
          />
        );
      })}
    </group>
  );
}

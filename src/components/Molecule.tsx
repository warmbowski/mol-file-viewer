import { useMemo } from "react";
import {
  Vector3,
  LineCurve3,
  MeshBasicMaterial,
  Mesh,
  CapsuleGeometry,
} from "three";
// import { Sphere } from "@react-three/drei";
import { MolObj } from "../utils/readMolfile";
import { Element } from "./Elements";

export function Molecule({ atoms, bonds }: MolObj) {
  const elements = useMemo(() => {
    return atoms.map((atom, index) => {
      const { x, y, z, type } = atom;
      return (
        <Element
          key={`${type}${index}`}
          type={type}
          position={new Vector3(x, y, z)}
        />
      );
    });
  }, [atoms]);

  const elementBonds = useMemo(() => {
    return bonds.map((bond, index) => {
      const { atom1, atom2, type: bondCnt } = bond;
      const { x: x1, y: y1, z: z1 } = atoms[atom1 - 1];
      const { x: x2, y: y2, z: z2 } = atoms[atom2 - 1];

      const start = new Vector3(x1, y1, z1);
      const end = new Vector3(x2, y2, z2);
      const line = new LineCurve3(start, end);
      const distance = line.getLength();
      const radius = bondCnt / 15;

      // Not happy with adding bonds imperitively, but it works for now.
      // Couldn't figure out how to get rotation correct when using a
      // declarative Capsule from @rect-three/drei.
      const capsuleMaterial = new MeshBasicMaterial({ color: 0xffffff });
      const capsuleGeometry = new CapsuleGeometry(radius, distance, 10, 20);
      capsuleGeometry.translate(0, distance / 2, 0);
      capsuleGeometry.rotateX(Math.PI / 2);

      const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
      capsule.position.x = start.x;
      capsule.position.y = start.y;
      capsule.position.z = start.z;
      capsule.lookAt(end);

      return <primitive key={index} object={capsule} />;

      // return (
      //   <group key={index} name="nuclei">
      //     <Sphere args={[0.03, 32, 32]} position={new Vector3(x1, y1, z1)}>
      //       <meshPhongMaterial color={"red"} />
      //     </Sphere>
      //     <Sphere args={[0.03, 32, 32]} position={new Vector3(x2, y2, z2)}>
      //       <meshPhongMaterial color={"red"} />
      //     </Sphere>
      //   </group>
      // );
    });
  }, [atoms, bonds]);

  return (
    <group>
      {elements}
      {elementBonds}
    </group>
  );
}

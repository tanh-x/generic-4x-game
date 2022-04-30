import { useEffect, useRef, FunctionComponent } from "react";
import { useTexture } from "@react-three/drei";

import CloudLayer from "./CloudLayer";

interface GalaxyMeshProps {
  diameter: number;
}

const GalaxyMesh: FunctionComponent<GalaxyMeshProps> = (props): JSX.Element => {
  const cmaps = useTexture({
    "disk0": "assets/galaxy/color-disk0.png",
  });
  
  const amaps = useTexture({
    "ring0": "assets/galaxy/alpha-ring0.png",
    "disk0": "assets/galaxy/alpha-disk0.png",
  })

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <CloudLayer scale={1} depth={-5} color={cmaps.disk0} alpha={amaps.ring0}/>
    </group>
  );
};

export default GalaxyMesh;
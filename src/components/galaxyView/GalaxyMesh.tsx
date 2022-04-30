import { useEffect, useRef, FunctionComponent } from "react";
import { useTexture } from "@react-three/drei";
import { sRGBEncoding, LinearEncoding } from "three";

import CloudLayer from "./CloudLayer";

interface GalaxyMeshProps {
  diameter: number;
}

const GalaxyMesh: FunctionComponent<GalaxyMeshProps> = (props): JSX.Element => {
  const cmaps = useTexture({
    disk0: "assets/galaxy/color-disk0.png",
    disk1: "assets/galaxy/color-disk1.png",
    disk2: "assets/galaxy/color-disk2.png",
  });

  const amaps = useTexture({
    ring0: "assets/galaxy/alpha-ring0.png",
    ring1: "assets/galaxy/alpha-ring1.png",
    ring2: "assets/galaxy/alpha-ring2.png",

    disk0: "assets/galaxy/alpha-disk0.png",

    decal0: "assets/galaxy/alpha-decal0.png"
  });

  useEffect((): void => {
    Object.values(cmaps).map((tex) => {
      tex.encoding = sRGBEncoding;
    });
    Object.values(amaps).map((tex) => {
      tex.encoding = LinearEncoding;
    });
  }, []);
  

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <axesHelper args={[20]}/>
      {/* Central annulus around the supermassive black hole */}
      <CloudLayer
        scale={props.diameter * 0.7}
        position={[-6, 6, 3]}
        color={cmaps.disk1}
        alpha={amaps.ring1}
      />
      <CloudLayer
        scale={props.diameter * 1.2}
        position={[0, 0, -4]}
        color={cmaps.disk2}
        alpha={amaps.ring0}
      />
    </group>
  );
};

export default GalaxyMesh;

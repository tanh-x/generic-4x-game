import { useEffect, useRef, useContext, FunctionComponent } from "react";
import { useTexture } from "@react-three/drei";
import { sRGBEncoding, LinearEncoding } from "three";

import CloudLayer from "./CloudLayer";
import { GalaxyContext } from "_Main";
import { randUniform } from "_helpers";

const GalaxyMesh: FunctionComponent<{}> = (): JSX.Element => {
  const _GALAXY = useContext(GalaxyContext);
  const diameter = _GALAXY.genParams.radius * 2;

  const cmaps = useTexture({
    disk: "assets/galaxy/color-disk.jpg",
    ring: "assets/galaxy/color-ring.jpg",
    spiral: "assets/galaxy/color-spiral.jpg",
  });

  const amaps = useTexture({
    ring: "assets/galaxy/alpha-ring.jpg",
    disk: "assets/galaxy/alpha-disk.jpg",
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
    <group rotation={[-Math.PI / 2, 0, 0]} >
      {/* Spiral arms */}
      <CloudLayer
        scale={diameter * 1.5}
        position={[0, 0, -5]}
        color={cmaps.spiral}
        alpha={amaps.ring}
        rotate
        rotateSpeed={0.2}
      />
      {/* Back fill  */}
      <CloudLayer
        scale={diameter * 1.1}
        position={[0, 0, -16]}
        color={cmaps.disk}
        alpha={amaps.disk}
        rotate
        rotateSpeed={0.7}
      /> 
      {/* Front fill */}
      <CloudLayer
        scale={diameter * 0.6}
        position={[0, 0, 12]}
        color={cmaps.disk}
        alpha={amaps.disk}
        rotate
        rotateSpeed={2.1}
      /> 
      {/* Dense clouds */}
      <CloudLayer
        scale={diameter}
        position={[0, 0, 5]}
        color={cmaps.ring}
        alpha={amaps.disk}
        rotate
        rotateSpeed={-1}
      />
    </group>
  );
};

export default GalaxyMesh;

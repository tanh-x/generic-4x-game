import { useEffect, useRef, useContext, FunctionComponent } from "react";
import { useTexture } from "@react-three/drei";
import { sRGBEncoding, LinearEncoding } from "three";

import CloudLayer from "./CloudLayer";
import { GamestateContext } from "_Main";
import { randUniform } from "_helpers";

const GalaxyMesh: FunctionComponent<{}> = (): JSX.Element => {
  const _GAME = useContext(GamestateContext);
  const diameter = _GAME.GALAXY.genParams.radius * 2;

  const cmaps = useTexture({
    disk: "assets/galaxy/color-disk.png",
    ring: "assets/galaxy/color-ring.png",
    spiral: "assets/galaxy/color-spiral.png",
  });

  const amaps = useTexture({
    ring: "assets/galaxy/alpha-ring.png",
    disk: "assets/galaxy/alpha-disk.png",
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
    <group rotation={[-Math.PI / 2, 0, randUniform(0, 6.2831853)]} >
      <axesHelper args={[20]} />
      {/* Spiral arms */}
      <CloudLayer
        scale={diameter * 1.5}
        position={[0, 0, -5]}
        color={cmaps.spiral}
        alpha={amaps.ring}
      />
      {/* Back fill  */}
      <CloudLayer
        scale={diameter * 1.1}
        position={[0, 0, -16]}
        color={cmaps.disk}
        alpha={amaps.disk}
      /> 
      {/* Front fill */}
      <group rotation={[0, 0, 1.2]}>
        <CloudLayer
          scale={diameter * 0.6}
          position={[0, 0, 12]}
          color={cmaps.disk}
          alpha={amaps.disk}
        /> 
      </group>
      {/* Dense clouds */}
      <CloudLayer
        scale={diameter}
        position={[0, 0, 5]}
        color={cmaps.ring}
        alpha={amaps.disk}
      />
    </group>
  );
};

export default GalaxyMesh;

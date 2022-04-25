import {
  useEffect,
  useRef,
  useContext,
  MutableRefObject,
  FunctionComponent,
} from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring } from "@react-spring/three";

import { GamestateContext } from "_Main";
import {} from "scripts/planetaryGeneration";

interface SystemProps {
  switchView: Function;
  focusedIndexRef: MutableRefObject<number | undefined>;
}

const System: FunctionComponent<SystemProps> = (props): JSX.Element => {
  console.log("RENDER systemView");
  const { camera } = useThree();
  const _GAME = useContext(GamestateContext);
  const system = _GAME.GALAXY.systems[props.focusedIndexRef.current!];
  // Camera position before zooming into the system, will revert back after exiting
  const initialCameraPosition = camera.position;
  const [initialAnimSpring, initialAnimAPI] = useSpring(
    (number: number, index: number) => {
      return {
        position: initialCameraPosition,
        onChange: (): void => {},
      };
    }
  );

  const onLClick = (): void => {
  };
  
  const onRClick = (): void => {
    props.switchView("galaxy");
  }

  useEffect(() => {
    console.log("MOUNT systemView");

    // Point the camera at where the star used to be
    camera.lookAt(...system.position);

    document.addEventListener("click", onLClick);
    document.addEventListener("contextmenu", onRClick);
    return (): void => {
      console.log("UNMOUNT systemView");
      document.removeEventListener("click", onLClick);
      document.removeEventListener("contextmenu", onRClick);
    };
  }, []);

  return (
    <>
      {/* Similar to the star on the galaxy view, but higher quality */}
      <mesh position={system.position}>
        <icosahedronBufferGeometry args={[system.star.radius, 10]} />
        <meshBasicMaterial />

      </mesh>
      <group position={system.position}>
        <mesh position={[1, 0, 0]}>
          <boxBufferGeometry args={[]}/>
          <meshBasicMaterial color={"#8fffff"}/>
        </mesh>
      </group>
    </>
  );
};

export default System;

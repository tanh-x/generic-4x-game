import {
  useEffect,
  useRef,
  useContext,
  MutableRefObject,
  FunctionComponent,
} from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

import { GamestateContext } from "_Main";
import {} from "scripts/planetaryGeneration";
import { Array3, addArrays } from "_helpers";

interface SystemProps {
  switchView: Function;
  focusedIndexRef: MutableRefObject<number | undefined>;
}

const System: FunctionComponent<SystemProps> = (props): JSX.Element => {
  console.log("RENDER systemView");
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const _GAME = useContext(GamestateContext);
  const system = _GAME.GALAXY.systems[props.focusedIndexRef.current!];
  // Camera position before zooming into the system, will revert back after exiting
  const initialCameraPosition = camera.position.toArray();
  const [transitionSpring, transitionSpringAPI] = useSpring(() => {
    return {
      position: initialCameraPosition,
      config: {
        tension: 100,
        precision: 0.005,
      },
      onChange: (): void => {
        camera.lookAt(
          ...(pivotSpring.position.animation.values.map((c) => {
            // @ts-ignore
            return c._value;
          }) as Array3)
        );
        camera.position.set(
          ...(transitionSpring.position.animation.values.map((c) => {
            // @ts-ignore
            return c._value;
          }) as Array3)
        );
      },
    };
  });

  const cameraPivotRef = useRef<THREE.Object3D>();
  const [pivotSpring, pivotSpringAPI] = useSpring(() => {
    return {
      position: system.position,
      config: {
        tension: 140,
        precision: 0.01,
      },
      onChange: (): void => {},
    };
  });

  const onLClick = (): void => {};

  const onRClick = (): void => {
    props.switchView("galaxy");
  };

  useEffect(() => {
    console.log("MOUNT systemView");

    // Point the camera at where the star used to be
    camera.lookAt(...system.position);

    if (true) {
      pivotSpringAPI.start({
        position: addArrays(system.position, [2.5, 0, 0]) as Array3,
      });
      transitionSpringAPI.start({
        position: addArrays(system.position, [2.5, 0, 2.5]) as Array3,
      });
    }

    document.addEventListener("click", onLClick);
    document.addEventListener("contextmenu", onRClick);
    return (): void => {
      camera.position.set(...initialCameraPosition);
      document.removeEventListener("click", onLClick);
      document.removeEventListener("contextmenu", onRClick);
    };
  }, []);

  return (
    <>
      {/* <OrbitControls ref={controlsRef} enabled={false} /> */}
      <animated.mesh
        position={pivotSpring.position}
        ref={cameraPivotRef}
        visible={false}
      >
        <boxBufferGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color={"#8fffff"} />
      </animated.mesh>

      {/* Similar to the star on the galaxy view, but higher quality */}
      <mesh position={system.position}>
        <icosahedronBufferGeometry args={[system.star.radius, 10]} />
        <meshBasicMaterial />
      </mesh>
      <group position={system.position}></group>
    </>
  );
};

export default System;

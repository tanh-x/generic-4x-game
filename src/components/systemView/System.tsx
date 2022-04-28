import {
  useEffect,
  useRef,
  useContext,
  MutableRefObject,
  FunctionComponent,
  Fragment,
} from "react";
import { useThree } from "@react-three/fiber";
import { Instances, Instance, MapControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

import { GamestateContext } from "_Main";
import { Array3, addArrays } from "_helpers";
import Planet from "./Planet";

interface SystemProps {
  switchView: Function;
  focusedIndexRef: MutableRefObject<number | undefined>;
}

const System: FunctionComponent<SystemProps> = (props): JSX.Element => {
  console.log("RENDER systemView");
  const { camera } = useThree();
  const _GAME = useContext(GamestateContext);
  const controlsRef = useRef<any>();
  const gridRef = useRef<any>();
  const system = _GAME.GALAXY.systems[props.focusedIndexRef.current!];
  // Camera position before zooming into the system, will revert back after exiting
  const initialCameraPosition = camera.position.toArray();
  const [transitionSpring, transitionSpringAPI] = useSpring(() => {
    return {
      position: initialCameraPosition,
      config: {
        tension: 160,
        precision: 0.008,
      },
      onChange: (): void => {
        camera.position.set(
          ...(transitionSpring.position.animation.values.map((c) => {
            // @ts-ignore
            return c._value;
          }) as Array3)
        );
      },
      onRest: (): void => {
        if (controlsRef.current === null) return;
        controlsRef.current.enabled = true;
      },
    };
  });
  const [scaleSpring, scaleSpringAPI] = useSpring(() => {
    return {
      from: {
        gridScale: 3,
        starScale: system.star.radius,
      },
      config: {
        tension: 75,
        precision: 0.008,
      },
    };
  });

  const onLClick = (): void => {};

  const onRClick = (): void => {
    transitionSpringAPI.start({
      position: initialCameraPosition,
    });
    scaleSpringAPI.start({
      gridScale: 0,
      starScale: system.star.radius,
      config: {
        tension: 200,
      },
    });
    setTimeout(() => {
      camera.position.set(...initialCameraPosition);
      props.switchView("galaxy");
    }, 400);
    // camera.position.set(...initialCameraPosition);
    // props.switchView("galaxy");
  };

  useEffect(() => {
    console.log("MOUNT systemView");

    transitionSpringAPI.start({
      position: addArrays(system.position, [5, 12, 5]) as Array3,
    });
    scaleSpringAPI.start({
      gridScale: 60,
      starScale: 1 / system.star.radius,
    });

    document.addEventListener("click", onLClick);
    document.addEventListener("contextmenu", onRClick);
    return (): void => {
      document.removeEventListener("click", onLClick);
      document.removeEventListener("contextmenu", onRClick);
    };
  }, []);

  return (
    <>
      <MapControls
        ref={controlsRef}
        enabled={false}
        enableRotate={false}
        enableZoom={false}
        target={system.position}
      />

      {/* Similar to the star on the galaxy view, but higher quality */}
      <animated.mesh position={system.position} scale={scaleSpring.starScale}>
        <icosahedronBufferGeometry args={[system.star.radius, 10]} />
        <meshBasicMaterial color={system.star.color} />
      </animated.mesh>

      {/* Planets */}
      <group position={system.position}>
        <animated.gridHelper
          ref={gridRef}
          scale={scaleSpring.gridScale}
          args={[1, 20, "#333", "#042f2c"]}
        />
        {/* <axesHelper args={[10]} /> */}
        {/* {system.planets.map((planet, index) => (
          <Planet
          key={index}
            position={[
              10 + 10 * ((index / (system.planets.length - 1)) - 0.5),
              0,
              0,  
            ]
            }
          />
        ))} */}
      </group>
    </>
  );
};

export default System;

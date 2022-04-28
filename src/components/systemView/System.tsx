import {
  useEffect,
  useRef,
  useContext,
  MutableRefObject,
  FunctionComponent,
  Fragment,
} from "react";
import { useThree } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
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
  const controlsRef = useRef<any>();
  const _GAME = useContext(GamestateContext);
  const system = _GAME.GALAXY.systems[props.focusedIndexRef.current!];
  // Camera position before zooming into the system, will revert back after exiting
  const initialCameraPosition = camera.position.toArray();
  const [transitionSpring, transitionSpringAPI] = useSpring(() => {
    return {
      position: initialCameraPosition,
      config: {
        tension: 120,
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
    pivotSpringAPI.start({
      position: system.position,
    });
    transitionSpringAPI.start({
      position: initialCameraPosition,
    });
    setTimeout(() => {
      camera.position.set(...initialCameraPosition);
      props.switchView("galaxy");
    }, 600);
    // camera.position.set(...initialCameraPosition);
    // props.switchView("galaxy");
  };

  useEffect(() => {
    console.log("MOUNT systemView");

    if (true) {
      pivotSpringAPI.start({
        position: addArrays(system.position, [10, 0, 0]) as Array3,
      });
      transitionSpringAPI.start({
        position: addArrays(system.position, [10, 8, 6]) as Array3,
      });
    }

    document.addEventListener("click", onLClick);
    document.addEventListener("contextmenu", onRClick);
    return (): void => {
      document.removeEventListener("click", onLClick);
      document.removeEventListener("contextmenu", onRClick);
    };
  }, []);

  return (
    <>

      {/* Similar to the star on the galaxy view, but higher quality */}
      <mesh position={system.position}>
        <icosahedronBufferGeometry args={[system.star.radius, 10]} />
        <meshBasicMaterial color={system.star.color} />
      </mesh>

      {/* Lighting setup */}
      <ambientLight color={system.star.color} intensity={0.008} />
      <directionalLight
        position={[-200.0, 0, 0]}
        color={"white"}
        intensity={0.32}
      />
      <directionalLight
        position={[-200.0, 0, 0]}
        color={system.star.color}
        intensity={0.4}
      />
      <directionalLight
        position={[1, 0, 0.2]}
        color="#322354"
        intensity={0.2}
      />

      {/* Planets */}
      <group position={system.position}>
        <axesHelper args={[10]}/>
        {system.planets.map((planet, index) => (
          <Planet
          key={index}
            position={[
              10 + 10 * ((index / (system.planets.length - 1)) - 0.5),
              0,
              0,  
            ]
            }
          />
        ))}
      </group>

      {/* Camera pivot indicator */}
      <animated.mesh
        position={pivotSpring.position}
        ref={cameraPivotRef}
        visible={false}
      >
        <boxBufferGeometry args={[0.3, 0.3, 0.3]} />
        <meshBasicMaterial color={"#8fffff"} />
      </animated.mesh>

      {/* Background stars */}
      <Instances
        name="star systems instances"
        limit={_GAME.GALAXY.genParams.starCount}
      >
        <icosahedronBufferGeometry args={[0.32, 2]} />
        <meshBasicMaterial />
        {_GAME.GALAXY.systems.map((system, index): JSX.Element => {
          return (
            <Fragment key={index}>
              <Instance
                position={system.position}
                color={system.star.color}
                scale={system.star.radius}
              />
            </Fragment>
          );
        })}
      </Instances>
    </>
  );
};

export default System;

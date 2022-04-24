import * as THREE from "three";
import {
  useState,
  useEffect,
  useContext,
  useRef,
  FunctionComponent,
  Fragment,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  Instances,
  Instance,
  Line,
  PerspectiveCamera,
  MapControls,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

import { addArrays } from "_helpers";
import { GamestateContext } from "_Main";

import Stars from "./systems/Stars";
import Paths from "./systems/Paths";
import EnvFX from "./EnvFX";

const defaultCameraDirection = new THREE.Vector3(0, 5, 1).normalize();
const deg = Math.PI / 180;

interface GalaxyProps {}

const Galaxy: FunctionComponent<GalaxyProps> = (props): JSX.Element => {
  console.log("rerendering galaxy view");

  const { gl, raycaster, scene, mouse, camera } = useThree();
  const _GAME = useContext(GamestateContext);
  const controlsRef = useRef<any>();
  const controlsUpdateFn = useRef((): void => {});
  const starsHitboxesRef = useRef<any>();
  const focusedStarIndex = useRef<number | undefined>(undefined);

  const [spring, api] = useSpring((number: number, index: number) => {
    return {
      position: camera.position.toArray(),
      reset: true,
      config: {
        tension: 100,
        precision: 0.05,
      },
      onChange: () => {
        camera.position.set(
          ...(spring.position.animation.values.map((component) => {
            // @ts-ignore
            return component._value;
          }) as [number, number, number])
        );
      },
      onStart: () => {
        // Completely kill the controls by forcefully removing its
        // organs and central nervous system when the animation starts
        controlsRef.current.enabled = false;
        controlsRef.current.update = (): void => {};
      },
      onRest: () => {
        // Restore life functions to the controls
        controlsRef.current.update = controlsUpdateFn.current;
        controlsRef.current.enabled = true;
      },
    };
  });

  const raycastStars = (): number | undefined => {
    raycaster.setFromCamera(mouse, camera);
    const intxs: THREE.Intersection[] = raycaster.intersectObjects(
      starsHitboxesRef.current.children, 
    );
    for (let i = 0; i < intxs.length; i++) {
      if (intxs[i].object.userData.systemIndex !== undefined) {
        return intxs[i].object.userData.systemIndex;
      }
    }
  }

  const onLClick = (): void => {
    const selectedIndex = raycastStars();
    if (selectedIndex === undefined) {
      focusedStarIndex.current = undefined;
      return
    }
    focusedStarIndex.current = selectedIndex;
    focusOnSystem(selectedIndex);
  };

  const onLDoubleClick = (): void => {
    
  };

  const focusOnSystem = (index: number): void => {
    console.log(_GAME.GALAXY.systems[index].name, index);
    focusedStarIndex.current = index;
    const focusedSystemPosition = _GAME.GALAXY.systems[index].position;
    spring.position.start({
      from: camera.position.toArray(),
      to: addArrays(
        focusedSystemPosition,
        camera.position
          .clone() // Dont mutate the camera vector
          .sub(controlsRef.current.target) // Get directional vector of camera
          .normalize()
          .multiplyScalar(25) // Zoom in
          .toArray()
      ) as [x: number, y: number, z: number],
    });
    controlsRef.current.target.set(...focusedSystemPosition);
  };

  useEffect(() => {
    camera.position.copy(defaultCameraDirection.clone().multiplyScalar(60));
    camera.lookAt(0, 0, 0);
    controlsUpdateFn.current = controlsRef.current.update.bind({});

    document.addEventListener("click", onLClick);
    document.addEventListener("dblclick", onLDoubleClick);
    return (): void => {
      document.removeEventListener("click", onLClick);
      document.removeEventListener("dblclick", onLDoubleClick);
    };
  }, []);

  useFrame((): void => {});
  return (
    <>
      <MapControls
        ref={controlsRef}
        // enableRotate={false}
        dampingFactor={0.08}
        minDistance={10}
        zoomSpeed={2}
        maxDistance={300}
        maxPolarAngle={45 * deg}
        minAzimuthAngle={-30 * deg}
        maxAzimuthAngle={30 * deg}
      />
      <EnvFX />

      <Stars
        hitboxesRef={starsHitboxesRef}
        controlsRef={controlsRef}
        focusOnSystem={focusOnSystem}
      />
      <Paths systems={_GAME.GALAXY.systems} edgeList={_GAME.GALAXY.edgeList} />
    </>
  );
};

export default Galaxy;

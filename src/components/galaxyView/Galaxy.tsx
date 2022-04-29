import * as THREE from "three";
import {
  useState,
  useEffect,
  useContext,
  useRef,
  FunctionComponent,
  MutableRefObject,
  Fragment,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { MapControls, TrackballControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

import { Array3, addArrays } from "_helpers";
import { GamestateContext } from "_Main";

import Stars from "./systems/Stars";
import Paths from "./systems/Paths";
import EnvFX from "components/EnvFX";

const defaultCameraDirection = new THREE.Vector3(0, 3, 1).normalize();
const deg = Math.PI / 180;

interface GalaxyProps {
  switchView: Function;
  focusedIndexRef: MutableRefObject<number | undefined>;
}

const Galaxy: FunctionComponent<GalaxyProps> = (props): JSX.Element => {
  // console.log("RENDER galaxyView");

  const { gl, raycaster, scene, mouse, camera } = useThree();
  const _GAME = useContext(GamestateContext);
  const controlsRef = useRef<any>();
  const ballControlsRef = useRef<any>();
  const controlsUpdateFn = useRef((): void => {});
  const ballControlsUpdateFn = useRef((): void => {});
  const starsHitboxesRef = useRef<any>();

  const [spring, api] = useSpring(() => {
    return {
      position: camera.position.toArray(),
      reset: true,
      config: {
        tension: 180,
        precision: 0.05,
      },
      onChange: () => {
        camera.position.set(
          ...(spring.position.animation.values.map((component) => {
            // @ts-ignore
            return component._value;
          }) as Array3)
        );
      },
      onStart: () => {
        // Completely kill the controls by forcefully removing its
        // organs and central nervous system when the animation starts
        controlsRef.current.enabled = false;
        controlsRef.current.update = (): void => {};
        ballControlsRef.current.enabled = false;
        ballControlsRef.current.update = (): void => {};
      },
      onRest: () => {
        // Restore life functions to the controls
        controlsRef.current.update = controlsUpdateFn.current;
        controlsRef.current.enabled = true;
        ballControlsRef.current.update = ballControlsUpdateFn.current;
        ballControlsRef.current.enabled = true;
      },
    };
  });

  const raycastStars = (): number | undefined => {
    raycaster.setFromCamera(mouse, camera);
    const intxs: THREE.Intersection[] = raycaster.intersectObjects(
      starsHitboxesRef.current.children
    );
    for (let i = 0; i < intxs.length; i++) {
      if (intxs[i].object.userData.systemIndex !== undefined) {
        return intxs[i].object.userData.systemIndex;
      }
    }
  };

  const onLClick = (): void => {
    if (spring.position.isAnimating) return;

    const selectedIndex = raycastStars();
    if (selectedIndex === undefined) {
      props.focusedIndexRef.current = undefined;
      return;
    }
    console.log(_GAME.GALAXY.systems[selectedIndex]);

    if (props.focusedIndexRef.current === selectedIndex) {
      props.switchView("system");
    } else {
      focusOnSystem(selectedIndex);
    }
  };

  const onLDoubleClick = (): void => {};

  const focusOnSystem = (index: number): void => {
    props.focusedIndexRef.current = index;
    const focusedSystemPosition = _GAME.GALAXY.systems[index].position;
    spring.position.start({
      from: camera.position.toArray(),
      to: addArrays(
        focusedSystemPosition,
        camera.position
          .clone()
          .sub(controlsRef.current.target) // Get directional vector of camera
          .setLength(100) // Zoom in/out to 100 units away from the star
          .toArray()
      ) as Array3,
    });
    controlsRef.current.target.set(...focusedSystemPosition);
  };

  useEffect(() => {
    // console.log("MOUNT galaxyView");

    controlsUpdateFn.current = controlsRef.current.update.bind({});
    ballControlsUpdateFn.current = ballControlsRef.current.update.bind({});
    if (props.focusedIndexRef.current === undefined) {
      // Should be on initial render
      camera.position.copy(defaultCameraDirection.clone().multiplyScalar(150));
      camera.lookAt(0, 0, 0);
    } else {
      // Should be on switching from another view
      const focusedPosition =
        _GAME.GALAXY.systems[props.focusedIndexRef.current].position;
      controlsRef.current.target.set(...focusedPosition);
      ballControlsRef.current.target.set(...focusedPosition);
      camera.lookAt(...focusedPosition);
    }

    document.addEventListener("click", onLClick);
    document.addEventListener("dblclick", onLDoubleClick);
    return (): void => {
      console.log("UNMOUNT galaxyView");
      document.removeEventListener("click", onLClick);
      document.removeEventListener("dblclick", onLDoubleClick);
    };
  }, []);

  useFrame((): void => {
    ballControlsRef.current.target = controlsRef.current.target;
  });

  return (
    <>
      <MapControls
        ref={controlsRef}
        // enableRotate={false}
        enableZoom={false}
        dampingFactor={0.15}
        rotateSpeed={0.4}
        panSpeed={0.8}
        minDistance={20}
        zoomSpeed={2}
        maxDistance={_GAME.GALAXY.genParams.radius * 2.5}
        // maxPolarAngle={50 * deg}
        // minAzimuthAngle={-30 * deg}
        // maxAzimuthAngle={30 * deg}
      />
      <TrackballControls
        ref={ballControlsRef}
        // enabled={false}
        noRotate={true}
        noPan={true}
        noZoom={false}
        zoomSpeed={1.5}
        dynamicDampingFactor={0.15}
      />

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

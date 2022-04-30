import {
  useEffect,
  useRef,
  useContext,
  MutableRefObject,
  FunctionComponent,
  Fragment,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, TrackballControls } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { Color } from "three";

import Planet from "./Planet";
import { GalaxyContext } from "_Main";
import { Array3, addArrays, randChoose } from "_helpers";
import { keplerianOrbit } from "scripts/keplerianOrbit";

interface SystemProps {
  switchView: Function;
  focusedIndexRef: MutableRefObject<number | undefined>;
}

const System: FunctionComponent<SystemProps> = (props): JSX.Element => {
  console.log("RENDER systemView");
  const { camera } = useThree();
  const _GALAXY = useContext(GalaxyContext);
  const controlsRef = useRef<any>();
  const ballControlsRef = useRef<any>();
  const gridRef = useRef<any>();
  const system = _GALAXY.systems[props.focusedIndexRef.current!];
  const orbitTrails =
    system.planets.length !== 0
      ? system.planets[0].misc.orbitPoints.map(
          (x, i) =>
            new Color(
              `hsl(0, 0%, ${Math.round(
                20 + (i * 60) / system.planets[0].misc.orbitPoints.length
              )}%)`
            )
        )
      : undefined;

  // Camera position before zooming into the system, will revert back after exiting
  const initialCameraPosition = camera.position.toArray();
  const [transitionSpring, transitionSpringAPI] = useSpring(() => {
    return {
      position: initialCameraPosition,
      config: {
        tension: 120,
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
        controlsRef.current.maxDistance = 30;
        ballControlsRef.current.enabled = true;
      },
    };
  });
  const [scaleSpring, scaleSpringAPI] = useSpring(() => {
    return {
      from: {
        gridScale: 1 / 50,
        gridPosition: [0, -60, 0] as Array3,
        starScale: 1,
      },
      config: {
        tension: 160,
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
      gridScale: 1 / 50,
      gridPosition: [0, -30, 0],
      starScale: 1,
      config: {
        tension: 200,
      },
    });
    setTimeout(() => {
      camera.position.set(...initialCameraPosition);
      props.switchView("galaxy");
    }, 200);
    // camera.position.set(...initialCameraPosition);
    // props.switchView("galaxy");
  };

  useEffect(() => {
    // console.log("MOUNT systemView");

    transitionSpringAPI.start({
      position: addArrays(system.position, [5.7, 7, 5.7]) as Array3,
    });
    scaleSpringAPI.start({
      gridScale: 1,
      gridPosition: [0, 0, 0],
      starScale: 0.25,
    });

    document.addEventListener("click", onLClick);
    document.addEventListener("contextmenu", onRClick);
    return (): void => {
      document.removeEventListener("click", onLClick);
      document.removeEventListener("contextmenu", onRClick);
    };
  }, []);

  useFrame(() => {
    ballControlsRef.current.target = controlsRef.current.target;
  });

  return (
    <>
      {/* Similar to the star on the galaxy view, but higher quality */}
      <animated.mesh position={system.position} scale={scaleSpring.starScale}>
        <icosahedronBufferGeometry args={[system.star.radius, 10]} />
        <meshBasicMaterial color={system.star.color} />
        {/* <directionalLight /> */}
      </animated.mesh>

      {/* Planets */}
      <animated.group position={system.position} scale={scaleSpring.gridScale}>
        <rectAreaLight
          position={[10, 0, 0]}
          intensity={100}
          width={10}
          height={10}
          color={0xffffff}
        />
        <ambientLight intensity={0.1} color={0xffffff} />
        <pointLight position={[0, 0, 0]} intensity={5} color={0xffffff} />
        <animated.gridHelper
          position={scaleSpring.gridPosition}
          ref={gridRef}
          args={[50, 40, "#2c2c2f", "#212a3f"]}
        />
        {/* <axesHelper args={[10]} /> */}
        {system.planets.map((planet, index) => (
          <Fragment key={index}>
            <Planet position={planet.misc.orbitPoints[0]} />
            <Line
              points={planet.misc.orbitPoints}
              alphaWrite
              color="#84919a"
              // color={system.star.color}
              vertexColors={orbitTrails as Color[] & true}
              linewidth={0.7}
            />
          </Fragment>
        ))}
      </animated.group>
      <OrbitControls
        ref={controlsRef}
        enabled={false}
        // enableRotate={false}
        enablePan={false}
        enableZoom={false}
        target={system.position}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 3}
        minDistance={3}
        dampingFactor={0.14}
        autoRotate
        autoRotateSpeed={0.4}
        // maxDistance={30}
      />
      <TrackballControls
        ref={ballControlsRef}
        // enabled={false}
        noRotate={true}
        noPan={true}
        noZoom={false}
        zoomSpeed={0.8}
        dynamicDampingFactor={0.15}
      />
    </>
  );
};

export default System;

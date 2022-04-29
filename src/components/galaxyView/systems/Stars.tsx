import {
  useRef,
  useEffect,
  useContext,
  FunctionComponent,
  Fragment,
} from "react";
import { Euler, Color } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Instance, Instances, useTexture } from "@react-three/drei";

import { GamestateContext } from "_Main";
import StarMesh from "components/galaxyView/systems/StarMesh";
import SystemOrbitsFX from "./SystemOrbitsFX";
import StarLabels from "./StarLabels";
import { StarSystem } from "scripts/galaxyGeneration";

interface StarsProps {
  hitboxesRef: any;
  controlsRef: any;
  focusOnSystem: Function;
}
const rotatePlaneFaceUp = new Euler(-Math.PI / 2, 0, 0);

const Stars: FunctionComponent<StarsProps> = (props): JSX.Element => {
  const _GAME = useContext(GamestateContext);
  const { camera, scene } = useThree();
  const starInstancesRef = useRef<any>();
  const labelsRef = useRef<any>();

  useEffect((): void => {
    // Stars and their hitboxes will be static, update their matrices once at initial render
    [
      ...starInstancesRef.current.children,
      ...props.hitboxesRef.current.children,
      ...labelsRef.current.children,
    ].map((ob: THREE.Object3D): void => {
      ob.updateMatrix();
    });
  }, []);

  useFrame((): void => {});

  return (
    <>
      {/* HTML labels */}
      <StarLabels labelsRef={labelsRef} controlsRef={props.controlsRef} />

      {/* Stars */}
      <Instances
        name="star systems instances"
        ref={starInstancesRef}
        limit={_GAME.GALAXY.genParams.starCount}
      >
        <icosahedronBufferGeometry args={[1, 3]} />
        <meshBasicMaterial />
        {_GAME.GALAXY.systems.map(
          (system: StarSystem, index: number): JSX.Element => {
            return (
              <Fragment key={index}>
                <StarMesh 
                  position={system.position}
                  color={system.star.color}
                  scale={system.star.radius}
                />
              </Fragment>
            );
          }
        )}
      </Instances>

      {/* Concentric circles around stars */}
      {/* <SystemOrbitsFX innerRadius={2.6} outerRadius={2.7} color="#2f2f35" /> */}
      <SystemOrbitsFX innerRadius={3.4} outerRadius={3.5} color="#2f3237" />
      <SystemOrbitsFX innerRadius={4.2} outerRadius={4.3} color="#40454c" />
      <SystemOrbitsFX innerRadius={4.9} outerRadius={5.0} />

      {/* Hitboxes for click to focus */}
      <Instances
        name="raycast hitboxes instances"
        ref={props.hitboxesRef}
        limit={_GAME.GALAXY.genParams.starCount}
        visible={false}
      >
        <boxBufferGeometry args={[7.5, 7.5, 5]} />
        <meshBasicMaterial wireframe={true} />
        {_GAME.GALAXY.systems.map((system: StarSystem, index: number) => {
          return (
            <Instance
              key={index}
              position={system.position}
              rotation={rotatePlaneFaceUp}
              userData={{
                systemIndex: index,
              }}
              matrixAutoUpdate={false}
            />
          );
        })}
      </Instances>
    </>
  );
};

export default Stars;

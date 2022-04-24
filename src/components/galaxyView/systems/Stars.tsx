import {
  useRef,
  useEffect,
  useContext,
  FunctionComponent,
  Fragment,
} from "react";
import { Euler } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Instance, Instances, Edges } from "@react-three/drei";

import { GamestateContext } from "_Main";
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
      {/* Stars */}
      <Instances ref={starInstancesRef} limit={_GAME.GALAXY.genParams.starCount}>
        <icosahedronBufferGeometry args={[1, 2]} />
        <meshBasicMaterial />
        {_GAME.GALAXY.systems.map(
          (system: StarSystem, index: number): JSX.Element => {
            return (
              <Fragment key={index}>
                <Instance
                  name={`star${index}`}
                  position={system.position}
                  color={system.star.color}
                  scale={0.4 + system.star.mass * 0.03}
                  matrixAutoUpdate={false}
                />
              </Fragment>
            );
          }
        )}
      </Instances>

      {/* HTML labels */}
      <StarLabels
        labelsRef={labelsRef}
        controlsRef={props.controlsRef}
      />

      {/* Hitboxes for click to focus */}
      <Instances
        ref={props.hitboxesRef}
        limit={_GAME.GALAXY.genParams.starCount}
        visible={false}
      >
        <boxBufferGeometry args={[3, 3, 3]} />
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

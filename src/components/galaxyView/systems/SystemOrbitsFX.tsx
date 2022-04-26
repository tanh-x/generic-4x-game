import { useRef, useContext, useEffect, FunctionComponent } from "react";
import { Instances, Instance } from "@react-three/drei";
import { Euler, Color } from "three";

import { StarSystem } from "scripts/galaxyGeneration";
import { GamestateContext } from "_Main";

const rotatePlaneFaceUp = new Euler(-Math.PI / 2, 0, 0);

interface SystemOrbitsFXProps {
  innerRadius: number,
  outerRadius: number,
  color?: string | Color,
  segments?: number,
}

const SystemOrbitsFX: FunctionComponent<SystemOrbitsFXProps> = (props): JSX.Element => {
  const _GAME = useContext(GamestateContext);
  const fxCirclesRef = useRef<any>();

  useEffect((): void => {
    fxCirclesRef.current.children.map((ob: THREE.Object3D): void => {
      ob.updateMatrix();
    });
  }, []);

  return (<Instances
    name="outer circle fx instances"
    ref={fxCirclesRef}
    limit={_GAME.GALAXY.genParams.starCount}
  >
    <ringBufferGeometry args={[props.innerRadius, props.outerRadius, props.segments ?? 24]} />
    <meshBasicMaterial />
    {_GAME.GALAXY.systems.map(
      (system: StarSystem, index: number): JSX.Element => {
        return (
          <Instance
            key={index}
            position={system.position}
            rotation={rotatePlaneFaceUp}
            color={props.color ?? new Color(system.star.color).multiplyScalar(0.3)}
            matrixAutoUpdate={false}
          />
        );
      }
    )}
  </Instances>);
}

export default SystemOrbitsFX;
import { FunctionComponent } from "react";
import { Array3 } from "_helpers";

interface PlanetProps {
  position: Array3,
}

const Planet: FunctionComponent<PlanetProps> = (props): JSX.Element => {
  return <>
    <mesh position={props.position}>
      <icosahedronBufferGeometry args={[0.2, 6]}/>
      <meshLambertMaterial color={'#854'} />
    </mesh>
  </>;
}

export default Planet;
import { FunctionComponent } from "react";
import { Instance } from "@react-three/drei";

interface StarMeshProps {
  position: [x: number, y: number, z: number];
  color: string;
  scale: number;
}

const StarMesh: FunctionComponent<StarMeshProps> = (props): JSX.Element => {
  return <Instance
    position={props.position}
    color={props.color}
    scale={props.scale}
    matrixAutoUpdate={false}
  />;
};

export default StarMesh;
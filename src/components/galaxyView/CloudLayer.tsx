import { useRef, FunctionComponent } from "react";

interface CloudLayerProps {
  scale: number
  depth: number,
  color: THREE.Texture,
  alpha: THREE.Texture,
}

const CloudLayer: FunctionComponent<CloudLayerProps> = (props): JSX.Element => {
  return <mesh
    position={[0, 0, props.depth]} // The group has been rotated so z becomes global y
    scale={props.scale}
    // visible={false}
  >
    <planeBufferGeometry />
    <meshBasicMaterial
      transparent
      map={props.color}
      alphaMap={props.alpha}
    />
  </mesh>;
}

export default CloudLayer;

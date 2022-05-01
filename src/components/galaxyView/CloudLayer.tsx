import { useRef, FunctionComponent, useEffect } from "react";
import { useFrame} from "@react-three/fiber";

interface CloudLayerProps {
  scale: number
  position: [number, number, number],
  color: THREE.Texture,
  alpha: THREE.Texture,
  rotate?: boolean,
  rotateSpeed?: number,
}

const CloudLayer: FunctionComponent<CloudLayerProps> = (props): JSX.Element => {
  const layerRef = useRef<THREE.Mesh>();
  const speed = useRef<number>();

  useEffect((): void => {
    speed.current = -0.00013 * (props.rotateSpeed ?? 1)
  }, []);

  useFrame((): void => {
    if (props.rotate) {
      layerRef.current?.rotateZ(speed.current!);
    }
  });

  return <mesh
    position={props.position} // The group has been rotated so z becomes global y
    scale={props.scale}
    ref={layerRef}
  >
    <planeBufferGeometry />
    <meshBasicMaterial
      transparent
      depthWrite={false}
      map={props.color}
      alphaMap={props.alpha}
    />
  </mesh>;
}

export default CloudLayer;

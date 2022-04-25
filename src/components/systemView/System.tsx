import { useEffect, useRef, useContext, FunctionComponent } from "react";
import { useThree } from "@react-three/fiber";
import { } from "@react-three/drei";

import { } from "scripts/planetaryGeneration";

interface SystemProps {

}

const System: FunctionComponent<SystemProps> = (props): JSX.Element => {
  const { camera } = useThree();
  
  const onLClick = (): void => {
    console.log( camera.position );
  }

  useEffect(() => {
    document.addEventListener("click", onLClick);
    return (): void => {
      document.removeEventListener("click", onLClick);
    }
  }, [])

  return <></>;
}

export default System;
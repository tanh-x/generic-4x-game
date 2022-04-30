import { useEffect, FunctionComponent } from "react";
import { useLoader } from "@react-three/fiber";
import {
  Environment,
  useTexture,
  useCubeTexture,
  Stars,
} from "@react-three/drei";

const EnvFX: FunctionComponent<{}> = () => {
  const cubemap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "assets/skybox/" }
  );
  cubemap.encoding = 3001; // sRGB encoding
  
  useEffect((): void => {

  }, []);

  return (
    <>
      <Environment
        background={"only"}
        path={"assets/"}
        map={cubemap}
      />

      <Stars
        radius={-197}
        depth={400}
        count={1000}
        factor={3}
        saturation={0}
        fade={true}
      />
    </>
  );
};

export default EnvFX;

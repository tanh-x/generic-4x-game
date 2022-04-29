import { useEffect, FunctionComponent } from "react";
import { Environment, useTexture, useCubeTexture, Stars } from "@react-three/drei";

const EnvFX: FunctionComponent<{}> = () => {
  const skybox = useTexture({
    px: "assets/px.png",
    nx: "assets/nx.png",
    py: "assets/py.png",
    ny: "assets/ny.png",
    pz: "assets/pz.png",
    nz: "assets/nz.png",
  })
  const cubemap = useCubeTexture([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
  ], { path: "assets/"} );

  useEffect((): void => {
    console.log(skybox)
  }, [])

  return (
    <>
      <Environment
        background={"only"}
        // files={["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]}
        path={"assets/"}
        map={cubemap}
      />

      <Stars
        radius={-197}
        depth={400}
        count={2000}
        factor={1.5}
        saturation={0}
        fade={true}
        
      />
    </>
  );
};

export default EnvFX;

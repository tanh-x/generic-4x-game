import { FunctionComponent } from "react";
import { Environment, Stars } from "@react-three/drei";

const EnvFX: FunctionComponent<{}> = () => {
  return (
    <>
      {/* <Environment
        background={"only"}
        files={["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]}
        path={"assets/"}
      /> */}

      <Stars
        radius={-200}
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

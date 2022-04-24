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
        radius={-96}
        depth={200}
        count={1200}
        factor={1.2}
        saturation={0}
        fade={true}
      />
    </>
  );
};

export default EnvFX;

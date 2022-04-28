import "./App.css";
import { useState, FunctionComponent, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import { NoToneMapping } from "three";
import Main from "_Main";
import DebugInfo from "components/DebugInfo/DebugInfo";
import DebugInfoUpdater from "components/DebugInfo/DebugInfoUpdater";

interface DebugInfoInterface {
  fps: number;
  frameCount: number;
  objCount: number;
  geomCount: number;
  triCount: number;
  heapSize: string;
  cameraPosition: { x: number; y: number; z: number };
  cameraRotation: { x: number; y: number; z: number };
}

const App: FunctionComponent<any> = () => {
  const [info, setInfo] = useState<DebugInfoInterface>({
    fps: 0,
    frameCount: 0,
    objCount: 0,
    geomCount: 0,
    triCount: 0,
    heapSize: "0 MiB",
    cameraPosition: { x: 0, y: 0, z: 0 },
    cameraRotation: { x: 0, y: 0, z: 0 },
  });

  return (
    <div className="">
      <Canvas camera={{ fov: 50, near: 0.05, far: 3000 }} gl={{ alpha: false, toneMapping: NoToneMapping }}>
        <Suspense fallback={null}>
          <Main />
        </Suspense>
        <DebugInfoUpdater updateInfo={setInfo} />
      </Canvas>
      <div className="overlay-upper-left">
        <DebugInfo info={info} />
      </div>
    </div>
  );
};

export default App;

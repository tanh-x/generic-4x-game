import "./App.css";
import { useState, FunctionComponent, Suspense, createContext } from "react";
import { Canvas } from "@react-three/fiber";

import { NoToneMapping } from "three";
import Main from "_Main";
import DebugInfo from "components/DebugInfo/DebugInfo";
import DebugInfoUpdater from "components/DebugInfo/DebugInfoUpdater";

import * as GalaxyUI from "components/interface/galaxyView";

import { GamestateProps, GalaxyProps } from "scripts/gamestateType";
import * as GalaxyGeneration from "scripts/galaxyGeneration";

const _GAME: GamestateProps = {
  PLAYERS: [],
  TEAMS: [],
  turn: 0,
};
export const GamestateContext = createContext(_GAME);

const _GALAXY: GalaxyProps = {
  genParams: GalaxyGeneration.params,
  systems: GalaxyGeneration.SYSTEMS,
  adjList: GalaxyGeneration.systemsAdjList,
  edgeList: GalaxyGeneration.systemsEdgeList,
};
export const GalaxyContext = createContext(_GALAXY);

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
    <div className="app-wrapper">
      <GamestateContext.Provider value={_GAME}>
        <GalaxyContext.Provider value={_GALAXY}>
          <Canvas
            camera={{ fov: 50, near: 0.1, far: 1200 }}
            // linear
            gl={{ alpha: false, toneMapping: NoToneMapping }}
          >
            <Suspense fallback={null}>
              <Main />
            </Suspense>
            <DebugInfoUpdater updateInfo={setInfo} />
          </Canvas>
          <div className="overlay-upper-left">
            <GalaxyUI.Status />
          </div>
          <div className="overlay-lower-left">
            <DebugInfo info={info} />
          </div>
        </GalaxyContext.Provider>
      </GamestateContext.Provider>
    </div>
  );
};

export default App;

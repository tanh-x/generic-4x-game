import * as THREE from "three";
import {
  useState,
  useEffect,
  createContext,
  useRef,
  FunctionComponent,
  memo,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { MapControls, useDetectGPU } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";

import Galaxy from "components/galaxyView/Galaxy";
import System from "components/systemView/System";
import EnvFX from "components/EnvFX";
import { GamestateProps } from "scripts/gamestateType";
import * as GalaxyGeneration from "scripts/galaxyGeneration";

const _GAME: GamestateProps = {
  GALAXY: {
    genParams: GalaxyGeneration.params,
    systems: GalaxyGeneration.SYSTEMS,
    adjList: GalaxyGeneration.systemsAdjList,
    edgeList: GalaxyGeneration.systemsEdgeList,
  },
  turn: 0,
};
export const GamestateContext = createContext(_GAME);

const Main: FunctionComponent<{}> = (): JSX.Element => {
  // console.log("RENDER main");
  const { camera } = useThree();

  type ViewportType = "galaxy" | "system";
  const [viewportState, setViewportState] = useState<ViewportType>("galaxy");
  const focusedIndexRef = useRef<number | undefined>(undefined);

  const switchView = (newViewport: ViewportType): void => {
    if (newViewport === undefined) return;
    console.log("------- SWITCHING VIEWPORTS -------");
    setViewportState(newViewport);
  };

  return (
    <>
      
      <GamestateContext.Provider value={_GAME}>
        {
          {
            galaxy: <Galaxy switchView={switchView} focusedIndexRef={focusedIndexRef}/>,
            system: <System switchView={switchView} focusedIndexRef={focusedIndexRef}/>,
          }[viewportState]
        }
      </GamestateContext.Provider>
      {/* <axesHelper position={[0, 0.001, 0]} args={[5]} /> */}
      {/* <gridHelper args={[200, 20]}/> */}

      {true && (
        <>
          <EnvFX />
          <EffectComposer>
            <Bloom luminanceThreshold={0.07} kernelSize={3} height={512} />
          </EffectComposer>
        </>
      )}
    </>
  );
};

export default memo(Main);

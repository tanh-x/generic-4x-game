import * as THREE from "three";
import {
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
  // console.log("rerendering scene");

  useEffect((): void => {
  }, []);

  useFrame((): void => {

  });

  return (
    <>
      <GamestateContext.Provider value={_GAME}>
        <Galaxy />
      </GamestateContext.Provider>
      {/* <axesHelper position={[0, 0.001, 0]} args={[5]} /> */}

      { true &&
        <EffectComposer>
          <Bloom luminanceThreshold={0.07} kernelSize={3} height={512} />
        </EffectComposer>
      }
      
    </>
  );
};

export default memo(Main);

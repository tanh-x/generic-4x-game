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
import { useSpring, animated } from "@react-spring/three";

import Galaxy from "components/galaxyView/Galaxy";
import System from "components/systemView/System";
import EnvFX from "components/EnvFX";
import GalaxyMesh from "components/galaxyView/GalaxyMesh";
import { GamestateProps } from "scripts/gamestateType";
import * as GalaxyGeneration from "scripts/galaxyGeneration";

const _GAME: GamestateProps = {
  GALAXY: {
    genParams: GalaxyGeneration.params,
    systems: GalaxyGeneration.SYSTEMS,
    adjList: GalaxyGeneration.systemsAdjList,
    edgeList: GalaxyGeneration.systemsEdgeList,
  },
  PLAYERS: [],
  TEAMS: [],
  turn: 0,
};
export const GamestateContext = createContext(_GAME);

const Main: FunctionComponent<{}> = (): JSX.Element => {
  // console.log("RENDER main");
  const { camera, gl } = useThree();

  type ViewportType = "galaxy" | "system";
  const [enablePP, setEnablePP] = useState(true);
  const [viewportState, setViewportState] = useState<ViewportType>("galaxy");
  const focusedIndexRef = useRef<number | undefined>(undefined);
  const galaxyMeshRef = useRef<THREE.Group>();

  const [galaxyTransSpring, galaxyTransSpringAPI] = useSpring(() => {
    return {
      from: {
        position: [0, 0, 0] as [number, number, number],
      },
      onStart: (): void => {
        galaxyMeshRef.current!.visible = true;
      },
      onRest: (): void => {
        galaxyMeshRef.current!.visible = (viewportState === "galaxy"); // toggle
      },
      config: {
        tension: 140
      }
    }
  });

  const switchView = (newViewport: ViewportType): void => {
    if (newViewport === undefined) return;
    console.log("------- SWITCHING VIEWPORTS -------");
    setViewportState(newViewport);
    galaxyTransSpringAPI.start({ position: newViewport === "galaxy" ? [0, 0, 0] : [0, 50, 0] });
  };

  return (
    <>
      <GamestateContext.Provider value={_GAME}>
        {
          {
            galaxy: (
              <Galaxy
                switchView={switchView}
                focusedIndexRef={focusedIndexRef}
              />
            ),
            system: (
              <System
                switchView={switchView}
                focusedIndexRef={focusedIndexRef}
              />
            ),
          }[viewportState]
        }
        <animated.group ref={galaxyMeshRef} position={galaxyTransSpring.position}>
          <GalaxyMesh />
        </animated.group>
      </GamestateContext.Provider>
      {/* <axesHelper position={[0, 0.001, 0]} args={[5]} /> */}
      {/* <gridHelper args={[200, 20]}/> */}

      {enablePP && (
        <>
          <EnvFX />
          <EffectComposer>
            <Bloom luminanceThreshold={0.07} kernelSize={4} height={1024} />
          </EffectComposer>
        </>
      )}
    </>
  );
};

export default memo(Main);

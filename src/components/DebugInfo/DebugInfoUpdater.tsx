import { useRef, FunctionComponent, memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { round } from "_helpers";

declare var performance: any;

interface DebugInfoUpdaterProps {
  updateInfo: Function;
}

const DebugInfoUpdater: FunctionComponent<DebugInfoUpdaterProps> = (
  props
): JSX.Element => {
  const fpsRenderInterval = useRef(0);
  const { gl, camera, scene, clock } = useThree();
  const prerender = useRef(true);

  useFrame((): void => {
    if (gl.info.render.frame % 43 === 41) {
      // update info once every n frames
      const fpsNewInterval: number = clock.elapsedTime;
      props.updateInfo({
        fps: 43 / (fpsNewInterval - fpsRenderInterval.current),
        frameCount: gl.info.render.frame,
        objCount: scene.children.length,
        geomCount: gl.info.memory.geometries,
        triCount: gl.info.render.triangles,
        heapSize:
          performance.memory !== undefined
            ? round(performance.memory.usedJSHeapSize / 1048576, 2, true) +
              " MiB"
            : "N/A",
        cameraPosition: camera.position,
        cameraRotation: camera.rotation,
      });
      fpsRenderInterval.current = fpsNewInterval;
    }
  });

  return <></>;
};

export default memo(DebugInfoUpdater);

import "./DebugInfo.css";
import { Fragment, FunctionComponent } from "react";
import { round, eulerToPitchYawRoll } from "_helpers";

interface DebugInfoProps {
  info: any;
}

const DebugInfo: FunctionComponent<DebugInfoProps> = (props): JSX.Element => {
  const cameraProperties = {
    ...props.info.cameraPosition,
    ...eulerToPitchYawRoll(props.info.cameraRotation),
  };

  return (
    <>
      <ul className="main-block leading-1">
        <li>
          {round(props.info.fps, 2, true)} FPS | dt ={" "}
          {round(1000 / props.info.fps, 2)}/16.67ms | (f: {props.info.frameCount})
        </li>
        <li>usedJSHeapSize: {props.info.heapSize}</li>
        <li>
          scene: {props.info.objCount} objs, {props.info.triCount} tris in{" "}
          {props.info.geomCount} geometries
        </li>
        <li>
          {" "}
          camera: [
          {Object.keys(cameraProperties).map((e, i) => {
            return (
              <Fragment key={i}>
                &nbsp;{e}={round(cameraProperties[e], 2, true)}
              </Fragment>
            );
          })}
          &nbsp;]
        </li>
        {/* <li>{props.info.clientGPU?.fps}</li> */}
      </ul>
    </>
  );
};

export default DebugInfo;

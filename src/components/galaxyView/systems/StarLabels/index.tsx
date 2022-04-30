import "./styles.css";
import {
  useState,
  useRef,
  useContext,
  useEffect,
  Fragment,
  FunctionComponent,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import { GalaxyContext } from "_Main";
import { randChoose } from "_helpers";
import { StarSystem } from "scripts/galaxyGeneration";

interface StarLabelsProps {
  labelsRef: any;
  controlsRef: any;
}

const StarLabels: FunctionComponent<StarLabelsProps> = (props): JSX.Element => {
  const _GALAXY = useContext(GalaxyContext);
  const { camera } = useThree();
  const [zoomLevel, setZoomLevel] = useState<number>(2);

  useEffect((): void => {}, []);

  useFrame((): void => {
    const newZoomLevel = ~~(
      (camera.position.clone().sub(props.controlsRef.current.target).length() -
        30) /
      140
    );
    if (newZoomLevel !== zoomLevel) {
      setZoomLevel(newZoomLevel);
    }
  });

  return (
    <group name="system labels" ref={props.labelsRef}>
      {_GALAXY.systems.map((system: StarSystem, index: number) => {
        return (
          <Fragment key={index}>
            <Html
              position={system.position}
              // as="Fragment"
              prepend
              matrixAutoUpdate={false}
              style={{
                pointerEvents: "none",
                height: 0,
                width: 0,
                opacity: zoomLevel >= 2 ? 0 : 1,
                transition: "opacity .2s",
              }}
            >
              <Label index={index} system={system} zoomLevel={zoomLevel} />
            </Html>
          </Fragment>
        );
      })}
    </group>
  );
};

interface LabelProps {
  index: number;
  system: StarSystem;
  zoomLevel: number;
}

const Label: FunctionComponent<LabelProps> = (props): JSX.Element => {
  return (
    <>
      <div
        className="outer-box"
        style={{
          ...(props.zoomLevel >= 1
            ? {
                height: "2.25rem",
              }
            : {
                height: "3.8rem",
              }),
          ...{ borderTop: `0.4em solid ${props.system.star.color}` },
        }}
      >
        <div className="name-box" style={{ background: "rgba(100, 116, 139, 0.5)"}}>
          <span>{props.system.name}</span>
        </div>
        <div
          className="planet-box"
          style={
            props.zoomLevel >= 1
              ? {
                  transform: "translate(0, 1.2em)",
                  opacity: "0",
                }
              : {
                  transform: "translate(0, 0%)",
                  opacity: "1",
                }
          }
        >
          {props.system.planets.map((planet, index): JSX.Element => {
            return <b key={index}>{randChoose(["○", "●", "◉"])}</b>;
          })}
        </div>
        {/* <div
          className="self-center"
          style={{
            borderLeft: "2px solid #fff8",
            height: "60%",
            transform: "translate(calc(50% - 1px), 20%)",
          }}
        /> */}
      </div>
    </>
  );
};

export default StarLabels;

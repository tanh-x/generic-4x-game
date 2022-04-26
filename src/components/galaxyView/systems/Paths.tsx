import { useEffect, useRef, FunctionComponent } from "react";
import { useThree } from "@react-three/fiber";
import { Color, Vector3 } from "three";
import {
  Line,
  Segments,
  Segment,
} from "@react-three/drei";

import { StarSystem } from "scripts/galaxyGeneration";
import { addArrays, Array3 } from "_helpers";

interface EdgesProps {
  edgeList: Array<[number, number]>;
  systems: StarSystem[];
}

const Paths: FunctionComponent<EdgesProps> = (props): JSX.Element => {
  const { scene } = useThree();
  const segmentsRef = useRef<any>();

  return (
    <>
      {
        props.edgeList.map((edge, index) => {    
          return (
            <Line
              name="dd"
              key={index}
              points={[
                props.systems[edge[0]].position,
                props.systems[edge[1]].position,
              ]}
              // @ts-ignore
              vertexColors={[
                new Color(props.systems[edge[0]].star.color),
                new Color(props.systems[edge[1]].star.color),
              ]}
              color={"#fff"}
              linewidth={0.8}
              alphaWrite={undefined}
              matrixAutoUpdate={false}
            />
          );
        })
      }
      {/* <Segments ref={segmentsRef} limit={props.edgeList.length} lineWidth={0.8}>
        {props.edgeList.map((edge, index) => (
          <Segment
            key={index}
            start={new Vector3(...props.systems[edge[0]].position)}
            end={new Vector3(...props.systems[edge[1]].position)}
          />
        ))}
      </Segments> */}
    </>
  );
};

export default Paths;
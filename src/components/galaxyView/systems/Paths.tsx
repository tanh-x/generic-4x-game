import { useEffect, useRef, FunctionComponent } from "react";
import { useThree } from "@react-three/fiber";
import { Color, Vector3 } from "three";
import { Line, Segments, Segment } from "@react-three/drei";

import { StarSystem } from "scripts/galaxyGeneration";
import { addArrays, Array3, clamp } from "_helpers";

interface EdgesProps {
  edgeList: Array<[number, number]>;
  systems: StarSystem[];
}

const Paths: FunctionComponent<EdgesProps> = (props): JSX.Element => {
  const { scene } = useThree();
  const segmentsRef = useRef<any>();

  return (
    <>
      {/* {props.edgeList.map((edge, index) => {
        // Component-wise subtraction of vectors
        const positionA = new Vector3(...props.systems[edge[0]].position);
        const positionB = new Vector3(...props.systems[edge[1]].position);
        const dirVector = positionA.clone().sub(positionB).normalize().multiplyScalar(4.0);

        return (
          <Line
            name="dd"
            key={index}
            points={[
              positionA.sub(dirVector),
              positionB.add(dirVector)
            ]}
            // @ts-ignore
            vertexColors={[
              new Color(props.systems[edge[0]].star.color),
              new Color(props.systems[edge[1]].star.color),
            ]}
            color={"#fff"}
            linewidth={1}
            alphaWrite={undefined}
            matrixAutoUpdate={false}
          />
        );
      })} */}
      <Segments ref={segmentsRef} limit={props.edgeList.length} lineWidth={0.6}>
        {props.edgeList.map((edge, index) => {
          const positionA = new Vector3(...props.systems[edge[0]].position);
          const positionB = new Vector3(...props.systems[edge[1]].position);
          const dirVector = positionA
            .clone()
            .sub(positionB)
            .normalize()
            .multiplyScalar(5.0);

          return (
            <Segment
              key={index}
              start={positionA.sub(dirVector)}
              end={positionB.add(dirVector)}
              color={new Color("#fff").multiplyScalar(
                clamp(
                  1000 /
                    positionA
                      .clone()
                      .lerp(positionB, 0.5)
                      .sub(new Vector3(0, 0, 0))
                      .length() **
                      1.84,
                  0.05,
                  0.7
                )
              )}
            />
          );
        })}
      </Segments>
    </>
  );
};

export default Paths;

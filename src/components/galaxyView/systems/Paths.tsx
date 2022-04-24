import { FunctionComponent } from "react";
import { Color } from "three";
import { Instance, Instances, Line } from "@react-three/drei";

import { StarSystem } from "scripts/galaxyGeneration";

interface EdgesProps {
  edgeList: Array<[number, number]>;
  systems: StarSystem[];
}

const Paths: FunctionComponent<EdgesProps> = (props): JSX.Element => {
  return (
    <>
      {
        props.edgeList.map((edge, index) => {    
          return (
            <Line
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
              color={"hsl(0, 0%, 70%)"}
              linewidth={0.7}
              alphaWrite={undefined}
              matrixAutoUpdate={false}
            />
          );
        })
      }
    </>
  );
};

export default Paths;

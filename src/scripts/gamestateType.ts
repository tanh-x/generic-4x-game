import { StarSystem, paramsProps } from "scripts/galaxyGeneration";

export interface GalaxyProps {
  genParams: paramsProps;
  systems: StarSystem[];
  adjList: Array<number[]>;
  edgeList: Array<[number, number]>;
}

export interface GamestateProps {
  GALAXY: GalaxyProps;
  turn: number;
}

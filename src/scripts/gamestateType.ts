import { StarSystem, paramsProps } from "scripts/galaxyGeneration";

export interface GalaxyProps {
  genParams: paramsProps;
  systems: StarSystem[];
  adjList: Array<number[]>;
  edgeList: Array<[number, number]>;
}

export interface PlayerProps {
  index: number;
  uid: number;
  team: number
}

export interface TeamProps {
  index: number;
  name: string;
  players: number[];
  homeSystem: StarSystem;
}

export interface GamestateProps {
  GALAXY: GalaxyProps;
  PLAYERS: PlayerProps[];
  TEAMS: TeamProps[];
  turn: number;
}

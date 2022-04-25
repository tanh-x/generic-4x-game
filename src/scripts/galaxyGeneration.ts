import {
  randint,
  weightedChoice,
  randUniform,
  randNormal,
  randChoose,
  intersectingEdges,
  sumOfSquares,
} from "_helpers";
import generateName from "scripts/generateName";
import { generatePlanetarySystem, Planet } from "./planetaryGeneration";

export const spectralTypesList = [
  // Main sequence stars
  "blue",
  "bluewhite",
  "white",
  "yellowwhite",
  "yellow",
  "orange",
  "red",
  "brown",
  "subbrown",
] as const;

export type SpectralType = typeof spectralTypesList[number];

export interface SpectralClassProps {
  // Proper display name
  label: string;
  // Spectral type letter
  symbol: string;
  // Probability weight, 1 unit = roughly 1%; the sum from every type can be arbitrary
  pWeight: number;
  // Used in shading and ui elements
  color: string[];
  // More massive stars can host more bodies, roughly solar masses
  massRange: [min: number, max: number];
  // Luminosity determines the temperature of planets as a function of distance
  luminosity: number;
}

export const spectralClassesData: Record<SpectralType, SpectralClassProps> = {
  blue: {
    label: "Blue",
    symbol: "O",
    pWeight: 5,
    color: ["#C8C0FF", "#B4B1FF", "#B2B2FF", "#B3A6FF"],
    massRange: [12, 25],
    luminosity: 200,
  },
  bluewhite: {
    label: "Blue-White",
    symbol: "B",
    pWeight: 8,
    color: ["#A3C5FF", "#B2E1FF", "#B5DAFF", "#B4F1FF"],
    massRange: [5.5, 12],
    luminosity: 120,
  },
  white: {
    label: "White",
    symbol: "A",
    pWeight: 6,
    color: ["#DDDDFF", "#DDDDFF", "#F0F1FF", "#D2D5FF"],
    massRange: [2.8, 5.5],
    luminosity: 70,
  },
  yellowwhite: {
    label: "Yellow-White",
    symbol: "F",
    pWeight: 6,
    color: ["#F8F7FF", "#F9F5FF", "#FFF4EA", "#FFF5F5"],
    massRange: [1.5, 2.8],
    luminosity: 45,
  },
  yellow: {
    label: "Yellow",
    symbol: "G",
    pWeight: 10,
    color: ["#FFF4EA", "#FFEDE3", "#fff5cf", "#ffedcf"],
    massRange: [0.8, 1.5],
    luminosity: 30,
  },
  orange: {
    label: "Orange",
    symbol: "K  ",
    pWeight: 20,
    color: ["#FFD2A1", "#FFC199", "#FFBB78", "#FFDAB5"],
    massRange: [0.3, 0.8],
    luminosity: 20,
  },
  red: {
    label: "Red",
    symbol: "M",
    pWeight: 25,
    color: ["#FFB56C", "#FFAC6F", "#FF932C", "#FFAD5E"],
    massRange: [0.08, 0.3],
    luminosity: 12,
  },
  brown: {
    label: "Brown",
    symbol: "L",
    pWeight: 8,
    color: ["#EF854C", "#EF7C6F", "#DF735C", "#EF7D3E"],
    massRange: [0.05, 0.13],
    luminosity: 6,
  },
  subbrown: {
    label: "Sub-Brown",
    symbol: "Y",
    pWeight: 3,
    color: ["#BF654C", "#CF5C5F", "#C3636C", "#CF6D7E"],
    massRange: [0.05, 0.13],
    luminosity: 1,
  },
};
const pWeightList = Object.values(spectralClassesData).map(
  (_sc) => _sc.pWeight
);

export interface StellarBody {
  spectralClass: string;
  color: string;
  mass: number;
  luminosity: number;
}

export interface StarSystem {
  index: number;
  name: string;
  star: StellarBody;
  planets: Planet[];
  position: [x: number, y: number, z: number];
}

export interface paramsProps {
  radius: number;
  starCount: number;
  distribution: "uniform" | "gaussian";
  maxEdgeLength: number; // maximum distance for two stars to be neighbors
  maxEdgesPerNode: number;
  minDistance?: number; // minimum distance (-ish) on the xz plane between 2 stars
}

export const params: paramsProps = {
  radius: 170,
  starCount: 100,
  distribution: "gaussian",
  maxEdgeLength: 30,
  maxEdgesPerNode: 5,
  minDistance: 20,
};

const SYSTEMS: StarSystem[] = [];

const systemsAdjList: number[][] = Array(params.starCount).fill([]);
const systemsEdgeList: Array<[number, number]> = [];

const createEdge = (a: number, b: number): void => {
  if (!systemsAdjList[a].includes(b)) {
    systemsAdjList[a] = systemsAdjList[a].concat(b);
  }
  if (!systemsAdjList[b].includes(a)) {
    systemsAdjList[b] = systemsAdjList[b].concat(a);
  }
  systemsEdgeList.push([a, b]);
};

const generate2DPosition = (): [x: number, y: number, z: number] => {
  if (params.distribution === "uniform") {
    return [
      randUniform(-params.radius, params.radius),
      0,
      randUniform(-params.radius, params.radius),
    ];
  } else if (params.distribution === "gaussian") {
    return [
      randNormal(0, params.radius * 0.33, 1.1 * params.radius),
      0,
      randNormal(0, params.radius * 0.33, 1.1 * params.radius),
    ];
  }
  return [0, -20, 0];
};

const getXZ = (index: number): [x: number, z: number] => {
  return [SYSTEMS[index].position[0], SYSTEMS[index].position[2]];
};

// Generating star systems
for (let i = 0; i < params.starCount; i++) {
  const _sc: SpectralType = spectralTypesList[weightedChoice(pWeightList)];
  const _data: SpectralClassProps = spectralClassesData[_sc];

  const name = generateName();
  const star: StellarBody = {
    spectralClass: _sc,
    color: randChoose(_data.color),
    mass: randUniform(..._data.massRange),
    luminosity: _data.luminosity * randNormal(1, 0.16, 0.3),
  };

  let position: [x: number, y: number, z: number] = [0, 0, 0];
  // Generate XZ position, regenerate if manhattan distance < threshold
  const maxIters = 50;
  for (let iter = 0; iter < maxIters; iter++) {
    let checkFailed = false;
    position = generate2DPosition();
    if (params.minDistance === undefined || SYSTEMS.length === 0) break;
    // The check will get less strict over many iterations
    const threshold = ((-0.6 / maxIters) * iter + 1.2) * params.minDistance;
    for (let k = 0; k < SYSTEMS.length; k++) {
      const dx = Math.abs(position[0] - SYSTEMS[k].position[0]);
      const dz = Math.abs(position[2] - SYSTEMS[k].position[2]);
      if (dx + dz < threshold) {
        checkFailed = true;
        break;
      }
    }
    if (checkFailed) {
      continue;
    } else {
      break;
    }
  }
  // Add random y-coord variation
  position[1] = randNormal(0, 2.7, 4.5);

  const planets = generatePlanetarySystem(
    star.luminosity,
    star.mass,
    Math.sqrt(sumOfSquares(position)) / params.radius
  );

  SYSTEMS.push({
    index: i,
    name,
    star,
    position,
    planets,
  });
}

// Generating links between stars
for (let i = 0; i < params.starCount; i++) {
  const [x, z] = getXZ(i);

  for (let j = 0; j < params.starCount; j++) {
    // Stop the loop if it already have enough edges
    if (systemsAdjList[i].length >= params.maxEdgesPerNode) {
      break;
    }
    // Stop considering this star
    if (
      j === i || // if it is itself
      systemsAdjList[j].length >= params.maxEdgesPerNode || // if the destination has enough edges
      systemsAdjList[j].includes(j) // if theyre already linked
    ) {
      continue;
    }
    const dist = Math.sqrt(
      (SYSTEMS[j].position[0] - x) ** 2 + (SYSTEMS[j].position[2] - z) ** 2
    );
    if (
      dist <= params.maxEdgeLength &&
      // Probability as a function of distance and max length
      Math.random() < 0.9
      // Math.random() < 0.4 * params.maxEdgeLength / (dist + 0.5)
    ) {
      let hasCollision = false;
      for (let k = 0; k < systemsEdgeList.length; k++) {
        const p1 = systemsEdgeList[k][0];
        const p2 = systemsEdgeList[k][1];
        if (intersectingEdges(getXZ(i), getXZ(j), getXZ(p1), getXZ(p2))) {
          hasCollision = true;
          break;
        }
      }
      if (!hasCollision) {
        createEdge(i, j);
      }
    }
  }
}

export { SYSTEMS, systemsAdjList, systemsEdgeList };

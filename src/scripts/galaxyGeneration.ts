import { Color } from "three";

import {
  randint,
  weightedChoice,
  randUniform,
  randNormal,
  randChoose,
  intersectingEdges,
  sumOfSquares,
  Array3,
} from "_helpers";
import generateName from "scripts/generateName";
import { generatePlanetarySystem, Planet } from "./planetaryGeneration";
import {
  spectralTypesList,
  SpectralType,
  SpectralClassProps,
  spectralClassesData,
} from "data/stars";

const pWeightList = Object.values(spectralClassesData).map(
  (_sc) => _sc.pWeight
);

export interface StellarBody {
  spectralClass: string;
  color: string;
  // color3: Color;
  mass: number;
  radius: number;
  luminosity: number;
}

export interface StarSystem {
  index: number;
  name: string;
  star: StellarBody;
  planets: Planet[];
  position: Array3;
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
  radius: 270,
  starCount: 100,
  distribution: "gaussian",
  maxEdgeLength: 72,
  maxEdgesPerNode: 4,
  minDistance: 52,
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
      randNormal(0, params.radius * 0.4, 1.1 * params.radius),
      0,
      randNormal(0, params.radius * 0.4, 1.1 * params.radius),
    ];
  }
  return [0, -20, 0];
};

const getXZ = (index: number): [x: number, z: number] => {
  return [SYSTEMS[index].position[0], SYSTEMS[index].position[2]];
};

// const defaultColor3 = new Color("black");
// Generating star systems
// First, put a central blackhole
// MUST BE INDEX 0 (or files: galaxygen will break)
SYSTEMS.push({
  index: 0,
  name: randChoose([
    "Tartaros",
    "Erebus",
    "Naraka",
    "Osiris",
    "Anubis",
    "Irkalla",
    "Ereshkigal",
    "Elysium",
    "Jahannam",
    "Hades",
    "Nyx",
  ]),
  star: {
    spectralClass: "blackhole",
    color: "#111",
    mass: 2_418_114,
    radius: 4,
    luminosity: 0,
  },
  planets: [],
  position: [0, 0, 0],
});
// Place special systems

// Generate the rest of the galaxy
const remaining = params.starCount - SYSTEMS.length;
for (let i = 0; i < remaining; i++) {
  const _sc: SpectralType = spectralTypesList[weightedChoice(pWeightList)];
  const _data: SpectralClassProps = spectralClassesData[_sc];

  const name = generateName();
  const star: StellarBody = {
    spectralClass: _sc,
    color: randChoose(_data.color),
    // color3: defaultColor3, // default, will be changed
    mass: randUniform(..._data.massRange),
    radius: 1, // default, will be set soon
    luminosity: _data.luminosity * randNormal(1, 0.16, 0.3),
  };
  // Behaves weirdly based on the default color, check later
  // star.color3 = new Color(star.color);
  star.radius = 0.73 + star.mass * 0.072;

  let position: [x: number, y: number, z: number] = [0, 0, 0];
  // Generate XZ position, regenerate if manhattan distance < threshold
  const maxIters = 70;
  for (let iter = 0; iter < maxIters; iter++) {
    if (iter === 49) {
      console.log(i);
    }
    let checkFailed = false;
    position = generate2DPosition();
    if (params.minDistance === undefined || SYSTEMS.length === 0) break;
    // The check will get less strict over many iterations
    const threshold = ((-0.7 / maxIters) * iter + 1.2) * params.minDistance;
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
  position[1] = randNormal(0, 7.7, 12.5);

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
// Pick 2 points that will bisect the galaxy
const bisectorAngle = randUniform(0, Math.PI);
const bisectorA: [number, number] = [
  params.radius * 2 * Math.cos(bisectorAngle),
  params.radius * 2 * Math.sin(bisectorAngle) + 0.01,
];
const bisectorB: [number, number] = [-bisectorA[0], -bisectorA[1]];
console.log(bisectorA, bisectorB);

// Generating links between stars
for (let i = 0; i < params.starCount; i++) {
  const [x, z] = getXZ(i);

  for (let j = 0; j < params.starCount; j++) {
    // Stop the loop if it already have enough edges
    if (systemsAdjList[i].length >= params.maxEdgesPerNode) {
      break;
    }

    // Stop considering this star...
    if (
      j === i || // if it is itself
      systemsAdjList[j].length >= params.maxEdgesPerNode || // if the destination has enough edges
      systemsAdjList[i].includes(j) // if theyre already linked
    ) {
      continue;
    }

    const dist = Math.sqrt(
      (SYSTEMS[j].position[0] - x) ** 2 + (SYSTEMS[j].position[2] - z) ** 2
    );
    if (
      dist <= params.maxEdgeLength &&
      // Probability as a function of distance and max length
      // Math.random() < 0.85
      (i !== 0 || Math.random() < (0.5 * params.maxEdgeLength) / (dist + 0.5))
    ) {
      let hasCollision = false;
      for (let k = 0; k < systemsEdgeList.length; k++) {
        const p1 = systemsEdgeList[k][0];
        const p2 = systemsEdgeList[k][1];
        if (
          intersectingEdges(getXZ(i), getXZ(j), getXZ(p1), getXZ(p2)) ||
          (i !== 0 &&
            intersectingEdges(getXZ(i), getXZ(j), bisectorA, bisectorB))
        ) {
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
// Finishing touches...

// TODO: Connect every isolated systems or groups of linked systems

export { SYSTEMS, systemsAdjList, systemsEdgeList };

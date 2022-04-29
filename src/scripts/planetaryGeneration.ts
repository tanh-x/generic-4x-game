import {
  randChoose,
  randUniform,
  randNormal,
  weightedChoice,
  clamp,
  inRange,
  Array3,
} from "_helpers";

import {
  planetTypesList,
  PlanetType,
  planetCategoriesList,
  PlanetCategory,
  PlanetProps,
  planetTypesData,
} from "data/planets";

import { keplerianOrbit } from "scripts/keplerianOrbit";

export interface Planet {
  type: PlanetType;
  stats: {
    FOOD: number;
    INFL: number;
    APRV: number;
    MATS: number;
    ENRG: number;
    // MPWR: number,
    // INDT: number,
    SCIS: number;
    CRED: number;
  };
  misc: {
    temperature: number;
    orbitPoints: Array3[];
  };
}
const deg = Math.PI / 180;
const orbitLineCount = 128;
const orbitThetas = Array.from(
  { length: orbitLineCount + 1 },
  (x, i) => (i / orbitLineCount) * Math.PI * 2
);
export const generatePlanetarySystem = (
  starLuminosity: number,
  starMass: number,
  galacticDistance: number
): Planet[] => {
  const generated: Planet[] = [];
  for (let d = 0; d < 12; d += 0.4) {
    if (generated.length === 5 || Math.random() > 1.0 - d * 0.05) {
      break;
    }
    if (Math.random() > 0.4) {
      continue;
    }

    const radiationFlux: number = Math.min(
      (Math.sqrt(starLuminosity) * 1.8) / (d + 1),
      6.5
    );
    const temperature: number = clamp(
      radiationFlux + randNormal(-0.4, 1.3, 3.0),
      0,
      8
    );
    // TODO: Category as a function of distance and mass
    // const planetCategory: PlanetCategory = ;

    const candidateTypes: PlanetType[] = (
      Object.keys(planetTypesData) as PlanetType[]
    ).filter(
      (key) =>
        inRange(temperature, planetTypesData[key].temperatureRange) &&
        (planetTypesData[key].category ===
          randChoose([...planetCategoriesList]) ||
          planetTypesData[key].category ===
            randChoose([...planetCategoriesList]))
    );
    if (candidateTypes.length === 0) {
      continue;
    }

    const weights: number[] = candidateTypes.map(
      (p) =>
        planetTypesData[p].pWeight +
        (galacticDistance >= planetTypesData[p].galacticDistanceBias.threshold
          ? planetTypesData[p].galacticDistanceBias.amount
          : 0)
    );

    const type: PlanetType = candidateTypes[weightedChoice(weights)];
    const _data: PlanetProps = planetTypesData[type];
    const stats: Planet["stats"] = {
      ..._data.baseStats, // mats, enrg, scis, cred
      FOOD: _data.habitationLevel * 3,
      INFL: Math.round((1 - galacticDistance) * 4),
      APRV: _data.habitationLevel - 3,
    };

    const orbitalParameters = {
      semiMajorAxis: 0.8 * generated.length ** 1.42 + randUniform(1.3, 1.6),
      eccentricity: Math.abs(randUniform(-0.25, 0.25)),
      inclination: randNormal(0, generated.length * 4 + 3, 25) * deg,
      argumentPeriapsis: randUniform(0, 2 * Math.PI),
      longitudeAscNode: randNormal(0, generated.length * 2, 30) * deg,
    };

    const misc: Planet["misc"] = {
      temperature: temperature,
      orbitPoints: orbitThetas.map((theta) =>
        keplerianOrbit({
          method: "anomaly",
          t: theta,
          GM: 1,
          ...orbitalParameters,
        })
      ),
    };

    // Append new planet onto array
    generated.push({
      type,
      stats,
      misc,
    });
  }
  return generated;
};

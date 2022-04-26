import {
  randChoose,
  randNormal,
  weightedChoice,
  clamp,
  inRange,
} from "_helpers";

import {
  planetTypesList,
  PlanetType,
  planetCategoriesList,
  PlanetCategory,
  PlanetProps,
  planetTypesData,
} from "data/planets";

const normaliseDensityIntegral = 1.0 / Math.sqrt(2.0 * Math.PI);
const normalPD = (x: number, mu: number, sigma: number): number => {
  return (
    (1.0 / sigma) *
    normaliseDensityIntegral *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2)
  );
};

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
  };
}

export const generatePlanetarySystem = (
  starLuminosity: number,
  starMass: number,
  galacticDistance: number
): Planet[] => {
  const generated: Planet[] = [];
  for (let d = 0; d < 12; d += 0.4) {
    if (generated.length === 6 || Math.random() > 1.0 - d * 0.05) {
      break;
    }
    if (Math.random() > 0.6) {
      continue;
    }

    const radiationFlux: number = Math.min(
      (Math.sqrt(starLuminosity) * 1.8) / (d + 1),
      8.5
    );
    const temperature: number = clamp(
      radiationFlux + randNormal(0, 1.1, 3.0),
      0,
      8
    );
    // TODO: Category as a function of distance and mass
    const planetCategory: PlanetCategory = randChoose([
      ...planetCategoriesList,
    ]);

    const candidateTypes: PlanetType[] = (
      Object.keys(planetTypesData) as PlanetType[]
    ).filter(
      (key) =>
        inRange(temperature, planetTypesData[key].temperatureRange) &&
        planetTypesData[key].category === planetCategory
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

    const misc: Planet["misc"] = {
      temperature: temperature,
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

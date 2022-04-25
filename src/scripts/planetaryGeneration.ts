import {
  randChoose,
  randNormal,
  weightedChoice,
  clamp,
  inRange,
} from "_helpers";

const normaliseDensityIntegral = 1.0 / Math.sqrt(2.0 * Math.PI);
const normalPD = (x: number, mu: number, sigma: number): number => {
  return (
    (1.0 / sigma) *
    normaliseDensityIntegral *
    Math.exp(-0.5 * ((x - mu) / sigma) ** 2)
  );
};

const planetTypesList = [
  "rocky",
  "icy",
  "metallic",

  "volcanic",
  "carbonic",

  "terran",
  "ocean",
  "desert",
  "arsenic",
  "desolate",

  "watergiant",
  "hydrogen",
  "ammonia",
  "methane",
  "alkali",
  "silicate",
  "substellar",
] as const;
type PlanetType = typeof planetTypesList[number];

const planetCategoriesList = [
  "barren",
  "terrestial",
  "habitable",
  "giant",
] as const;
type PlanetCategory = typeof planetCategoriesList[number];

interface PlanetProps {
  label: string;
  category: PlanetCategory;
  habitationLevel: number;
  pWeight: number;
  // 0: ice, 1: cold, 2: low-habitable, 3: mid-habitable, 4: high-habitable,
  // 5: hot, 6: burning, 7: melting, 8: substellar
  temperatureRange: [low: number, high: number];
  galacticDistanceBias: {
    threshold: number; // distance from galactic center to apply bias
    amount: number; // bias amount, can be negative to bias towards center
  };
  baseStats: {
    MATS: number;
    ENRG: number;
    SCIS: number;
    CRED: number;
  };
}

export const planetTypesData: Record<PlanetType, PlanetProps> = {
  // BARREN PLANETS
  rocky: {
    label: "Rocky Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 20,
    temperatureRange: [0, 7],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 6,
      ENRG: 3,
      SCIS: 4,
      CRED: 2,
    },
  },
  icy: {
    label: "Icy Body",
    category: "barren",
    habitationLevel: 2,
    pWeight: 15,
    temperatureRange: [0, 4],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 4,
      ENRG: 2,
      SCIS: 6,
      CRED: 3,
    },
  },
  metallic: {
    label: "Metal Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 15,
    temperatureRange: [1, 5],
    galacticDistanceBias: { threshold: 0.5, amount: 10 },
    baseStats: {
      MATS: 8,
      ENRG: 4,
      SCIS: 3,
      CRED: 4,
    },
  },

  // TERRESTIAL PLANETS
  volcanic: {
    label: "Volcanic World",
    category: "terrestial",
    habitationLevel: 0,
    pWeight: 12,
    temperatureRange: [4, 8],
    galacticDistanceBias: { threshold: 0.3, amount: -10 },
    baseStats: {
      MATS: 12,
      ENRG: 10,
      SCIS: 5,
      CRED: 6,
    },
  },
  carbonic: {
    label: "Carbonic World",
    category: "terrestial",
    habitationLevel: 1,
    pWeight: 11,
    temperatureRange: [1, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 14,
      ENRG: 7,
      SCIS: 4,
      CRED: 6,
    },
  },

  // HABITABLE PLANETS
  terran: {
    label: "Terran World",
    category: "habitable",
    habitationLevel: 6,
    pWeight: 7,
    temperatureRange: [2, 4],
    galacticDistanceBias: { threshold: 0.7, amount: 5 },
    baseStats: {
      MATS: 6,
      ENRG: 5,
      SCIS: 10,
      CRED: 16,
    },
  },
  ocean: {
    label: "Ocean World",
    category: "habitable",
    habitationLevel: 5,
    pWeight: 16,
    temperatureRange: [1, 4],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 3,
      ENRG: 3,
      SCIS: 16,
      CRED: 10,
    },
  },
  desert: {
    label: "Desert World",
    category: "habitable",
    habitationLevel: 4,
    pWeight: 15,
    temperatureRange: [2, 5],
    galacticDistanceBias: { threshold: 0.3, amount: -5 },
    baseStats: {
      MATS: 8,
      ENRG: 5,
      SCIS: 10,
      CRED: 10,
    },
  },
  arsenic: {
    label: "Arsenic World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 10,
    temperatureRange: [2, 4],
    galacticDistanceBias: { threshold: 0.3, amount: -5 },
    baseStats: {
      MATS: 10,
      ENRG: 5,
      SCIS: 12,
      CRED: 8,
    },
  },
  desolate: {
    label: "Desolate World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 8,
    temperatureRange: [2, 4],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 6,
      ENRG: 3,
      SCIS: 6,
      CRED: 6,
    },
  },

  // GIANT PLANETS
  watergiant: {
    label: "Water Giant",
    category: "giant",
    habitationLevel: 1,
    pWeight: 10,
    temperatureRange: [2, 6],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 15,
      ENRG: 15,
      SCIS: 15,
      CRED: -6,
    },
  },
  hydrogen: {
    label: "Hydrogen Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 25,
    temperatureRange: [0, 4],
    galacticDistanceBias: { threshold: 0.6, amount: -8 },
    baseStats: {
      MATS: 10,
      ENRG: 5,
      SCIS: 15,
      CRED: 0,
    },
  },
  ammonia: {
    label: "Ammonia Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 18,
    temperatureRange: [1, 4],
    galacticDistanceBias: { threshold: 0.5, amount: -4 },
    baseStats: {
      MATS: 15,
      ENRG: 8,
      SCIS: 15,
      CRED: -6,
    },
  },
  methane: {
    label: "Methane Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 10,
    temperatureRange: [1, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      MATS: 8,
      ENRG: 15,
      SCIS: 15,
      CRED: -6,
    },
  },
  alkali: {
    label: "Alkali Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 7,
    temperatureRange: [3, 6],
    galacticDistanceBias: { threshold: 0.7, amount: 6 },
    baseStats: {
      MATS: 12,
      ENRG: 36,
      SCIS: 15,
      CRED: -12,
    },
  },
  silicate: {
    label: "Silicate Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 3,
    temperatureRange: [4, 8],
    galacticDistanceBias: { threshold: 0.85, amount: 8 },
    baseStats: {
      MATS: 48,
      ENRG: 16,
      SCIS: 15,
      CRED: -30,
    },
  },
  substellar: {
    label: "Substellar Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 1,
    temperatureRange: [5, 8],
    galacticDistanceBias: { threshold: 0.85, amount: 10 },
    baseStats: {
      MATS: 5,
      ENRG: 60,
      SCIS: 8,
      CRED: -40,
    },
  },
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
  for (let d = 0; d < 12; d += 0.6) {
    if (generated.length === 7 || Math.random() > 1.0 - d * 0.05) {
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

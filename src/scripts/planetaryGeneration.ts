import { randChoose, randNormal, clamp, inRange } from "_helpers";

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
  "substellar"
] as const;
type PlanetType = typeof planetTypesList[number];

const planetCategoriesList = [
  "barren",
  "terrestial",
  "habitable",
  "giant",
  "special",
] as const;
type PlanetCategory = typeof planetCategoriesList[number];

interface PlanetProps {
  label: string;
  category: PlanetCategory;
  habitationLevel: number;
  pWeight: number;
  // 0: ice, 1: cold, 2: low-habitable, 3: mid-habitable, 4: high-habitable,
  // 5: hot, 6: burning, 7: melting, 8: substellar
  temperatureRange: number[];
  galacticDistanceBias: {
    threshold: number; // distance from galactic center to apply bias
    amount: number; // bias amount, can be negative to bias towards center
  };
  baseStats: {
    materials: number,
    energy: number,
    science: number,
    credits: number,
  }
}

export const planetTypesData: Record<PlanetType, PlanetProps> = {
  // BARREN PLANETS
  rocky: {
    label: "Rocky Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 50,
    temperatureRange: [0, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 6,
      energy: 3,
      science: 4,
      credits: 2,
    },
  },
  icy: {
    label: "Icy Body",
    category: "barren",
    habitationLevel: 2,
    pWeight: 20,
    temperatureRange: [0, 2],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 4,
      energy: 2,
      science: 6,
      credits: 3,
    },
  },
  metallic: {
    label: "Metal Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 30,
    temperatureRange: [2, 5],
    galacticDistanceBias: { threshold: 0.5, amount: 10 },
    baseStats: {
      materials: 8,
      energy: 4,
      science: 3,
      credits: 4,
    },
  },

  // TERRESTIAL PLANETS
  volcanic: {
    label: "Volcanic World",
    category: "terrestial",
    habitationLevel: 0,
    pWeight: 30,
    temperatureRange: [5, 7],
    galacticDistanceBias: { threshold: 0.3, amount: -10 },
    baseStats: {
      materials: 12,
      energy: 10,
      science: 5,
      credits: 6,
    },
  },
  carbonic: {
    label: "Carbonic World",
    category: "terrestial",
    habitationLevel: 1,
    pWeight: 20,
    temperatureRange: [1, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 14,
      energy: 7,
      science: 4,
      credits: 6,
    },
  },

  // HABITABLE PLANETS
  terran: {
    label: "Terran World",
    category: "habitable",
    habitationLevel: 6,
    pWeight: 7,
    temperatureRange: [3, 3],
    galacticDistanceBias: { threshold: 0.7, amount: 10 },
    baseStats: {
      materials: 6,
      energy: 5,
      science: 10,
      credits: 16,
    },
  },
  ocean: {
    label: "Ocean World",
    category: "habitable",
    habitationLevel: 5,
    pWeight: 16,
    temperatureRange: [2, 3],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 3,
      energy: 3,
      science: 16,
      credits: 10,
    },
  },
  desert: {
    label: "Desert World",
    category: "habitable",
    habitationLevel: 4,
    pWeight: 15,
    temperatureRange: [3, 4],
    galacticDistanceBias: { threshold: 0.3, amount: -5 },
    baseStats: {
      materials: 8,
      energy: 5,
      science: 10,
      credits: 10,
    },
  },
  arsenic: {
    label: "Arsenic World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 10,
    temperatureRange: [2, 3],
    galacticDistanceBias: { threshold: 0.3, amount: -5 },
    baseStats: {
      materials: 10,
      energy: 5,
      science: 12,
      credits: 8,
    },
  },
  desolate: {
    label: "Desolate World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 8,
    temperatureRange: [2, 2],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 6,
      energy: 3,
      science: 6,
      credits: 6,
    },
  },

  // GIANT PLANETS
  watergiant: {
    label: "Water Giant",
    category: "giant",
    habitationLevel: 1,
    pWeight: 10,
    temperatureRange: [3, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 15,
      energy: 15,
      science: 15,
      credits: -6,
    },
  },
  hydrogen: {
    label: "Hydrogen Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 25,
    temperatureRange: [0, 1],
    galacticDistanceBias: { threshold: 0.6, amount: -8 },
    baseStats: {
      materials: 10,
      energy: 5,
      science: 15,
      credits: 0,
    },
  },
  ammonia: {
    label: "Ammonia Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 18,
    temperatureRange: [1, 2],
    galacticDistanceBias: { threshold: 0.5, amount: -4 },
    baseStats: {
      materials: 15,
      energy: 8,
      science: 15,
      credits: -6,
    },
  },
  methane: {
    label: "Methane Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 10,
    temperatureRange: [1, 3],
    galacticDistanceBias: { threshold: 0, amount: 0 },
    baseStats: {
      materials: 8,
      energy: 15,
      science: 15,
      credits: -6,
    },
  },
  alkali: {
    label: "Alkali Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 7,
    temperatureRange: [4, 5],
    galacticDistanceBias: { threshold: 0.7, amount: 6 },
    baseStats: {
      materials: 12,
      energy: 36,
      science: 15,
      credits: -12,
    },
  },
  silicate: {
    label: "Silicate Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 3,
    temperatureRange: [5, 8],
    galacticDistanceBias: { threshold: 0.85, amount: 8 },
    baseStats: {
      materials: 48,
      energy: 16,
      science: 15,
      credits: -30,
    },
  },
  substellar: {
    label: "Substellar Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 1,
    temperatureRange: [7, 8],
    galacticDistanceBias: { threshold: 0.85, amount: 10 },
    baseStats: {
      materials: 5,
      energy: 60,
      science: 8,
      credits: -40,
    }
  }
};

export interface Planet {
  type: PlanetType;
}

export const generatePlanetarySystem = (
  starLuminosity: number,
  starMass: number,
  galacticDistance: number,
): Planet[] => {
  const generated: Planet[] = [];
  for (let i = 0; i < 7; i++) {
    if (Math.random() < (1.0 - i * 0.08)) { break; }
    const radiationFlux: number = Math.min(Math.sqrt(starLuminosity) * 1.46 / (i + 1), 7);
    const temperature: number = clamp(radiationFlux + randNormal(0, 1.1, 3.0), 0, 8);
    // TODO: Category as a function of distance and mass
    const planetCategory: PlanetCategory = randChoose(planetCategoriesList);
    const candidateTypes: PlanetType[] = Object.keys(planetTypesData).filter(
      (key) => (
        planetTypesData[key].category === planetCategory &&
        inRange(temperature, planetTypesData[key].temperatureRange)
      )
    );
    const type = randChoose(candidateTypes);  
    
    // Append new planet onto array
    generated.push({
      type,
    });
  }
  return generated;
};

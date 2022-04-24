import { randChoose } from "_helpers";

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
  temperatureBias: number[];
  galacticDistanceBias: {
    threshold: number; // distance from galactic center to apply bias
    amount: number; // bias amount, can be negative to bias towards center
  };
}

export const planetTypesData: Record<PlanetType, PlanetProps> = {
  // BARREN PLANETS
  rocky: {
    label: "Rocky Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 50,
    temperatureBias: [0, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
  },
  icy: {
    label: "Icy Body",
    category: "barren",
    habitationLevel: 2,
    pWeight: 20,
    temperatureBias: [0, 2],
    galacticDistanceBias: { threshold: 0, amount: 0 },
  },
  metallic: {
    label: "Metal Body",
    category: "barren",
    habitationLevel: 1,
    pWeight: 30,
    temperatureBias: [2, 5],
    galacticDistanceBias: { threshold: 0.5, amount: 10 },
  },

  // TERRESTIAL PLANETS
  volcanic: {
    label: "Volcanic World",
    category: "terrestial",
    habitationLevel: 0,
    pWeight: 30,
    temperatureBias: [5, 7],
    galacticDistanceBias: { threshold: 0.3, amount: -10 },
  },
  carbonic: {
    label: "Carbonic World",
    category: "terrestial",
    habitationLevel: 1,
    pWeight: 20,
    temperatureBias: [1, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 },
  },

  // HABITABLE PLANETS
  terran: {
    label: "Terran World",
    category: "habitable",
    habitationLevel: 6,
    pWeight: 7,
    temperatureBias: [3, 3],
    galacticDistanceBias: { threshold: 0.7, amount: 10}
  },
  ocean: {
    label: "Ocean World",
    category: "habitable",
    habitationLevel: 5,
    pWeight: 16,
    temperatureBias: [2, 3],
    galacticDistanceBias: { threshold: 0, amount: 0}
  },
  desert: {
    label: "Desert World",
    category: "habitable",
    habitationLevel: 4,
    pWeight: 15,
    temperatureBias: [3, 4],
    galacticDistanceBias: { threshold: 0.3, amount: -5 }
  },
  arsenic: {
    label: "Arsenic World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 10,
    temperatureBias: [2, 3],
    galacticDistanceBias: { threshold: 0.3, amount: -5 }
  },
  desolate: {
    label: "Desolate World",
    category: "habitable",
    habitationLevel: 3,
    pWeight: 8,
    temperatureBias: [2, 2],
    galacticDistanceBias: { threshold: 0, amount: 0 }
  },

  // GIANT PLANETS
  watergiant: {
    label: "Water Giant",
    category: "giant",
    habitationLevel: 1,
    pWeight: 10,
    temperatureBias: [3, 5],
    galacticDistanceBias: { threshold: 0, amount: 0 }
  },
  hydrogen: {
    label: "Hydrogen Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 25,
    temperatureBias: [0, 1],
    galacticDistanceBias: { threshold: 0.6, amount: -8 }
  },
  ammonia: {
    label: "Ammonia Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 18,
    temperatureBias: [1, 2],
    galacticDistanceBias: { threshold: 0.5, amount: -4 }
  },
  methane: {
    label: "Methane Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 10,
    temperatureBias: [1, 3],
    galacticDistanceBias: { threshold: 0, amount: 0 }
  },
  alkali: {
    label: "Alkali Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 7,
    temperatureBias: [4, 5],
    galacticDistanceBias: { threshold: 0.7, amount: 6 }
  },
  silicate: {
    label: "Silicate Giant",
    category: "giant",
    habitationLevel: 0,
    pWeight: 3,
    temperatureBias: [5, 9],
    galacticDistanceBias: { threshold: 0.85, amount: 10 }
  },
};

export interface Planet {
  type: PlanetType
}

export const generatePlanetarySystem = (): Planet[] => {
  const generated: Planet[] = [];
  while (generated.length < 6 && Math.random() < (1 - generated.length * 0.1)) {
    generated.push({
      type: randChoose([...planetTypesList])
    })
  }
  console.log(generated)
  return generated;
};

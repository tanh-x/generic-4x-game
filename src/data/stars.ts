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

  "blackhole",
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
    pWeight: 10,
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
    pWeight: 16,
    color: ["#FFD2A1", "#FFC199", "#FFBB78", "#FFDAB5"],
    massRange: [0.3, 0.8],
    luminosity: 20,
  },
  red: {
    label: "Red",
    symbol: "M",
    pWeight: 20,
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

  blackhole: {
    label: "Black Hole",
    symbol: "BH",
    pWeight: 0,
    color: ["#111"],
    massRange: [50, 100],
    luminosity: 0,
  },
};
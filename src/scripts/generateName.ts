import { randChoose } from "_helpers";

const constellations = [
  "Andromeda",
  "Antlia",
  "Apus",
  "Aquarius",
  "Aquila",
  "Ara",
  "Aries",
  "Auriga",
  "Australe",
  "Australis",
  "Austrinus",
  "Bootes",
  "Borealis",
  "Berenices",
  "Caelum",
  "Camelo",
  "Cancer",
  "Canis",
  "Capricornus",
  "Carina",
  "Cassiopeia",
  "Centaurus",
  "Cepheus",
  "Cetus",
  "Chamaeleon",
  "Circinus",
  "Columba",
  "Coma",
  "Corona",
  "Corvus",
  "Crater",
  "Crux",
  "Cygnus",
  "Delphinus",
  "Dorado",
  "Draco",
  "Equuleus",
  "Eridanus",
  "Fornax",
  "Gemini",
  "Grus",
  "Hercules",
  "Horologium",
  "Hydra",
  "Hydrus",
  "Indus",
  "Lacerta",
  "Leo",
  "Lepus",
  "Libra",
  "Lupus",
  "Lynx",
  "Lyra",
  "Mensa",
  "Microscopium",
  "Monoceros",
  "Musca",
  "Norma",
  "Octans",
  "Ophiuchus",
  "Orion",
  "Pavo",
  "Pegasus",
  "Perseus",
  "Phoenix",
  "Pictor",
  "Pisces",
  "Pardalis",
  "Puppis",
  "Pyxis",
  "Reticulum",
  "Sagittarius",
  "Scorpius",
  "Sculptor",
  "Scutum",
  "Serpens",
  "Sextans",
  "Taurus",
  "Telescopium",
  "Triangulum",
  "Tucana",
  "Ursa",
  "Vela",
  "Venatici",
  "Virgo",
  "Volans",
  "Vulpecula",
];

const greeks = [
  "Vega",
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  // "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  // "Lambda",
  "Mu",
  "Nu",
  // "Omicron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  // "Upsilon",
  "Phi",
  "Chi",
  "Omega",
];

export default function generateName(): string {
  const suffix = randChoose(constellations)
  return suffix.length > 8 ? suffix : randChoose(greeks) + " " + suffix
}
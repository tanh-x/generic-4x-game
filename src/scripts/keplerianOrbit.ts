interface keplerianElements {
  method: "time" | "anomaly"; // compute by time or true anomaly
  t: number; // either time or true anomaly,
  GM: number; // gravitational parameter (mass * big G)
  semiMajorAxis: number; // (a): semi major axis
  eccentricity: number; // (e): eccentricity
  inclination: number; // (i): inclination
  argumentPeriapsis: number; // (ω): argument between ascending node and periapsis
  longitudeAscNode: number; // (Ω): longitude of ascending node, relative to reference direction
}

const [cos, sin, sqrt] = [Math.cos, Math.sin, Math.sqrt];
const TAU = 2 * Math.PI;
export function keplerianOrbit({
  method,
  t,
  GM,
  semiMajorAxis,
  eccentricity,
  inclination,
  argumentPeriapsis,
  longitudeAscNode,
}: keplerianElements): [x: number, y: number, z: number] {
  if (eccentricity > 1) throw "hyperbolic trajectories not allowed";

  let trueAnomaly: number, cosEccentricAnomaly: number;

  if (method === "anomaly") {
    trueAnomaly = t;
    cosEccentricAnomaly = (eccentricity + cos(t)) / (1 + eccentricity * cos(t));
  } else if (method === "time") {
    const meanAnomaly = (t * sqrt(GM / semiMajorAxis ** 3)) % TAU;
    // solve keplers mean anomaly equation
    // apparently i dont need to solve the equation????
    let eccentricAnomaly = meanAnomaly;
    // let phi = eccentricity * sin(meanAnomaly);
    // const maxIters = 0;
    // const errorThreshold = 10;
    // for (let i = 0; i < maxIters; i++) {
    //   if (Math.abs(phi) <= errorThreshold) {
    //     if (i !== 0) {
    //       console.log(i);
    //     }
    //     break
    //   };
    //   eccentricAnomaly -= phi / (1 - eccentricAnomaly * cos(eccentricAnomaly));
    //   phi =
    //     eccentricAnomaly - eccentricity * sin(eccentricAnomaly) - meanAnomaly;
    // }
    trueAnomaly =
      (2 *
        Math.atan(
          sqrt((1 + eccentricity) / (1 - eccentricity)) *
            Math.tan(eccentricAnomaly / 2)
        )) %
      TAU;
    cosEccentricAnomaly = cos(eccentricAnomaly);
  } else {
    throw "die";
  }

  const distanceToBody =
    semiMajorAxis * (1 - eccentricity * cosEccentricAnomaly);
  const factors = [
    longitudeAscNode,
    argumentPeriapsis + trueAnomaly,
    inclination,
  ];
  const c = factors.map((x) => cos(x));
  const s = factors.map((x) => sin(x));

  return [
    (c[0] * c[1] - s[0] * s[1] * c[2]) * distanceToBody,
    s[1] * s[2] * distanceToBody, // swap y and z
    (s[0] * c[1] + c[0] * s[1] * c[2]) * distanceToBody,
  ];
}

/* 
def keplerToCartesian(
    time,
    gravitationalParameter,
    semiMajorAxis,
    eccentricity,
    inclination
,
    argumentOfPeriapsis,
    longitudeOfAscNode,
):
    meanAnomaly = np.fmod(time * np.sqrt(gravitationalParameter/semiMajorAxis**3),
                          2*np.pi);
                          
    eccentricAnomaly = meanAnomaly;  # initial guess
    F = eccentricity * np.sin(meanAnomaly);
    iter = 0;
    maxIter = 40;
    errorThreshold = 1e-6;
    while (np.abs(F) > errorThreshold and iter < maxIter):
        eccentricAnomaly -= F / (1 - eccentricity * np.cos(eccentricAnomaly));
        F = eccentricAnomaly - eccentricity * np.sin(eccentricAnomaly) - meanAnomaly;
        iter += 1;
    eccentricAnomaly = np.fmod(eccentricAnomaly, 2 * np.pi);
    
    trueAnomaly = np.fmod(2 * np.arctan(
        np.sqrt((1 + eccentricity)/(1 - eccentricity)) * np.tan(eccentricAnomaly / 2)
    ), 2 * np.pi);
    
    distanceToBody = semiMajorAxis * (1 - eccentricity * np.cos(eccentricAnomaly))
    specificAngMomentum = np.sqrt(
        gravitationalParameter * semiMajorAxis * (1 - eccentricity**2)
    )
    
    _parameters = np.array([
        longitudeOfAscNode,
        argumentOfPeriapsis + trueAnomaly,
        inclination

    ])
    _c = np.cos(_parameters)
    _s = np.sin(_parameters)
        
    return np.array([
        _c[0]*_c[1] - _s[0]*_s[1]*_c[2],
        _s[0]*_c[1] + _c[0]*_s[1]*_c[2],
        _s[1]*_s[2]
    ]) * distanceToBody
*/

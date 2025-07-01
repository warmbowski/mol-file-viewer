// #version 300 es
precision highp float;

in vec3 vPos; // World position of the fragment
in vec3 vertexNormal;

uniform vec3 moleculeCenter;
uniform float potentialScale;

#define MAX_ATOMS 128
uniform int atomCount;
uniform float atomPositions[MAX_ATOMS * 3];
uniform float atomCharges[MAX_ATOMS];
uniform float atomRadii[MAX_ATOMS];

float computeElectrostaticPotential(vec3 point, vec3 atomPos, float charge, float radius) {
  float dist = length(point - atomPos);
  if (dist < radius) {
    return charge / radius * potentialScale;
  } else {
    return charge / dist * potentialScale;
  }
}

vec3 colorFromPotential(float potential) {
  float normPot = clamp(potential * 0.5 + 0.5, 0.0, 1.0); // Map -1..1 to 0..1
  if (potential > 0.0) {
    return mix(vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0), normPot); // white to blue
  } else if (potential < 0.0) {
    return mix(vec3(1.0, 1.0, 1.0), vec3(1.0, 0.0, 0.0), 1.0 - normPot); // white to red
  } else {
    return vec3(1.0, 1.0, 1.0); // Neutral: white
  }
}

void main() {
  vec3 point = vPos - moleculeCenter;
  float totalPotential = 0.0;
  for (int i = 0; i < MAX_ATOMS; ++i) {
    if (i >= atomCount) break;
    vec3 atomPos = vec3(
      atomPositions[i * 3 + 0],
      atomPositions[i * 3 + 1],
      atomPositions[i * 3 + 2]
    );
    float charge = atomCharges[i];
    float radius = atomRadii[i];
    totalPotential += computeElectrostaticPotential(point, atomPos, charge, radius);
  }

  vec3 finalColor = colorFromPotential(totalPotential);
  float intensity = pow(1.25 - dot(normalize(vertexNormal), vec3(0.0, 0.0, 1.0)), 1.25);
  gl_FragColor = vec4(finalColor, 1.0) * intensity;
}
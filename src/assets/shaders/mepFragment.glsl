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
    // Use the sign of the charge for inside and outside
    return -sign(charge) * abs(charge) / radius * potentialScale;
  } else {
    return sign(charge) * abs(charge) / dist * potentialScale;
  }
}

vec4 colorFromPotential(float potential) {
  // Clamp the potential to a reasonable range for visualization
  float normPot = clamp(potential, -1.0, 1.0);
  vec3 blue = vec3(0.0, 0.0, 1.0);
  vec3 red = vec3(1.0, 0.0, 0.0);
  // Instead of white, use transparent (alpha=0) for neutral
  float neutralBlend = smoothstep(0.0, 0.2, abs(normPot));
  vec3 color = mix(red, blue, normPot * 0.5 + 0.5); // red to blue
  float alpha = neutralBlend;
  return vec4(color, alpha);
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

  vec4 finalColor = colorFromPotential(totalPotential);
  float intensity = pow(1.5 - dot(normalize(vertexNormal), vec3(0.0, 0.0, 1.0)), 1.25);
  gl_FragColor = vec4(finalColor.rgb, finalColor.a) * intensity;
}
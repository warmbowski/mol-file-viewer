// #version 300 es
precision highp float;
// varying vec4 vPos;

in vec4 vPos; // Vertex position (molecule atom position)
uniform vec3 moleculeCenter; // Center of the molecule
uniform vec3 atomPosition; // Position of the atom in the molecule
uniform float atomCharge; // Charge of the atom (example, could be read from a texture)
uniform float atomRadius; // Radius of the atom
uniform float potentialScale; // Scaling factor for the potential
uniform float electronegativity; // Electronegativity of the atom (example, could be read from a texture)
varying vec3 vertexNormal; // Normal vector for lighting calculations

float computeElectrostaticPotential(vec3 point, vec3 atomPos, float charge, float radius) {
  vec3 r = point - atomPos;
  float dist = length(r);

  if (dist < radius) {
    // Inside the atom, potential is constant (approximation)
    return charge / radius * potentialScale;
  } else {
    // Outside the atom, potential falls off with distance
    return charge / dist * potentialScale;
  }
}

vec3 colorFromPotential(float potential) {
  if (potential > 0.0) {
    // Positive potential (blue)
    return vec3(0.0, 0.0, clamp(potential, 0.0, 1.0));
  } else if (potential < 0.0) {
    // Negative potential (red)
    return vec3(clamp(-potential, 0.0, 1.0), 0.0, 0.0);
  } else {
    // Neutral potential (green)
    return vec3(0.0, 1.0, 0.0);
  }
}

void main() {
  vec3 point = vPos.xyz; // Current fragment position (atom position)
  float potential = computeElectrostaticPotential(point, atomPosition, atomCharge, atomRadius);

  // Blend based on electronegativity
  vec3 potentialColor = colorFromPotential(potential);
  vec3 electronegativityColor;

  if (electronegativity > 2.5) { // Highly electronegative
        electronegativityColor = vec3(1.0, 0.0, 0.0); // Red
  } else if (electronegativity < 1.8){ // Low electronegativity
        electronegativityColor = vec3(0.0, 0.0, 1.0); // Blue
  } else { // Intermediate electronegativity
        electronegativityColor = vec3(0.0, 1.0, 0.0); // Green
  }

  // Blend potential and electronegativity colors. Adjust the blend factor as needed.
  float blendFactor = 0.5; // Adjust this to control the influence of electronegativity
  vec3 finalColor = mix(potentialColor, electronegativityColor, blendFactor);

  float intensity = pow(1.25 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.25);
  gl_FragColor = vec4(finalColor, 1.0) * intensity; // Apply intensity for lighting effect
}
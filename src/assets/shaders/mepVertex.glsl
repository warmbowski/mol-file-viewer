// #version 300 es
// Do NOT redeclare position, normal, modelMatrix, modelViewMatrix, projectionMatrix, normalMatrix

out vec3 vertexNormal;
out vec3 vPos; // Pass world position to fragment shader

void main() {
  vertexNormal = normalize(normalMatrix * normal);
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPos = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
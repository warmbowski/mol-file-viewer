// #version 300 es
varying vec3 vertexNormal;
out vec4 vPos; // Pass position to fragment shader

void main() {
  vertexNormal = normalize(normalMatrix * normal);
  vPos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = vPos;
}
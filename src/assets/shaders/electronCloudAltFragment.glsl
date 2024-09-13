varying vec3 vertexNormal;
uniform vec3 color;

void main() {
  float intensity = pow(1.0 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.7);
  gl_FragColor = vec4(color, 1) * intensity;
}
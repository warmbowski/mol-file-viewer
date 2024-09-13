varying vec3 vertexNormal;
uniform vec3 color;

void main() {
  float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = color * pow(intensity, 1.5);
  gl_FragColor = vec4(atmosphere, 0.1);
}
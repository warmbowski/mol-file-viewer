varying vec3 vertexNormal;

void main() {
  float intensity = pow(1.0 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.7);
  gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}
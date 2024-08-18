varying vec2 vecUV;

void main() {
  vecUV = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
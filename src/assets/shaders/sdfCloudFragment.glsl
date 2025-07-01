varying vec3 vertexNormal;
uniform vec3 color;

void main() {
  float intensity = pow(1.5 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 1.7);
  gl_FragColor = vec4(color, 1) * intensity;
}

// #ifdef GL_ES
// precision mediump float;
// #endif

// uniform vec2 u_resolution;

// void main() {
//   vec2 center = u_resolution * 0.5;
//   float radius = 80.0;
//   float dist = length(gl_FragCoord.xy - center);
//   float field = radius / dist;
//   float fill = smoothstep(1.0, 1.2, field);
//   vec3 color = mix(vec3(0.0), vec3(1.0), fill);
//   gl_FragColor = vec4(color, 1.0);
// }
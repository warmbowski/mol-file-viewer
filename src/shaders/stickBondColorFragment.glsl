  uniform vec3 color1;
  uniform vec3 color2;
  uniform float colorRatio;
  varying vec2 vecUV;

  void main() {
    vec3 col = mix(color1, color2, step(colorRatio, vecUV.y)); 
    gl_FragColor = vec4( col, 1.0);
    #include <tonemapping_fragment>
  }
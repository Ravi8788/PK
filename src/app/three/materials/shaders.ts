export const splitVertex = /* glsl */ `
  varying vec2 vUv;
  uniform float uSkew;
  void main() {
    vUv = uv;
    vec3 shifted = position;
    shifted.x += shifted.y * uSkew;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(shifted, 1.0);
  }
`

export const splitFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uSplit;
  uniform float uHasMap;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    if (uHasMap < 0.5) {
      gl_FragColor = vec4(uColor, 1.0);
      return;
    }
    float r = texture2D(uMap, vUv + vec2(uSplit, 0.0)).r;
    vec4 base = texture2D(uMap, vUv);
    float b = texture2D(uMap, vUv - vec2(uSplit, 0.0)).b;
    gl_FragColor = vec4(r, base.g, b, 1.0);
  }
`

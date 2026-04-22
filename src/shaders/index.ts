
export const flowVertexShader = `
uniform float uTime;
uniform float uProgress;
attribute float aOffset;
varying float vAlpha;
varying vec3 vColor;
uniform vec3 uColor;

void main() {
  float phase = mod(aOffset + uTime * 1.5, 1.0);
  vAlpha = smoothstep(0.0, 0.1, phase) * smoothstep(1.0, 0.8, phase);
  vColor = uColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 4.0 * vAlpha;
}
`

export const flowFragmentShader = `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(vColor, a);
}
`

export const lineFlowVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const lineFlowFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
varying vec2 vUv;

void main() {
  float dash = fract(vUv.x * 20.0 - uTime * uSpeed);
  float alpha = step(0.5, dash);
  gl_FragColor = vec4(uColor, alpha * 0.4);
}
`

export const photonVertexShader = `
uniform float uTime;
attribute float aPhase;
attribute float aSpeed;
attribute vec3 aVelocity;
varying float vAlpha;
varying float vPhase;

void main() {
  vec3 pos = position + aVelocity * mod(aPhase + uTime * aSpeed, 1.0) * 8.0;
  vAlpha = smoothstep(0.0, 0.15, mod(aPhase + uTime * aSpeed, 1.0)) 
         * smoothstep(1.0, 0.7, mod(aPhase + uTime * aSpeed, 1.0));
  vPhase = aPhase;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 3.5;
}
`

export const photonFragmentShader = `
uniform vec3 uColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(uColor * 2.0, a);
}
`

export const electronVertexShader = `
uniform float uTime;
uniform float uFlux;
attribute float aAngle;
attribute float aRadius;
attribute float aSpeed;
attribute float aHeight;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float t = mod(aAngle + uTime * aSpeed * uFlux, 6.28318);
  float r = aRadius + sin(uTime * 2.0 + aAngle) * 0.1;
  vec3 pos = vec3(cos(t) * r, aHeight + sin(uTime * 3.0 + aAngle * 2.0) * 0.05, sin(t) * r);
  
  vAlpha = uFlux * 0.8;
  vColor = mix(vec3(0.0, 0.8, 1.0), vec3(1.0, 0.5, 0.0), aRadius / 2.0);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 3.0;
}
`

export const electronFragmentShader = `
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(vColor, a);
}
`

export const gridVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const gridFragmentShader = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
  float line = min(grid.x, grid.y);
  float gridAlpha = 1.0 - min(line, 1.0);
  
  float pulse = sin(uTime * 0.5 + vPosition.x * 0.3 + vPosition.z * 0.2) * 0.5 + 0.5;
  vec3 gridColor = mix(uColor1, uColor2, pulse * gridAlpha);
  
  float dist = length(vPosition.xz) / 30.0;
  float fade = 1.0 - smoothstep(0.6, 1.0, dist);
  
  gl_FragColor = vec4(gridColor, gridAlpha * fade * 0.5);
}
`


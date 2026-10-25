const fogVert = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying float varViewDist;
varying vec2 varTexCoord;

void main(void) {
  vec4 viewPos = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewPos;
  varViewDist = length(viewPos.xyz);
  varTexCoord = aTexCoord;
}
`;

const fogFrag = `
precision highp float;

uniform sampler2D uSampler;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogMaxDist;

varying float varViewDist;
varying vec2 varTexCoord;

void main(void) {
  float expF = 1.0 - exp(-uFogDensity * varViewDist);
  float linF = clamp(varViewDist / uFogMaxDist, 0.0, 1.0);
  float f = clamp(max(expF, linF), 0.0, 1.0);

  vec3 fog = uFogColor / 255.0;

  vec4 texColor = texture2D(uSampler, varTexCoord);
  gl_FragColor = vec4(mix(texColor.rgb, fog, f), 1.0);
}
`;

let fogShader = null;

function initFog() {
  fogShader = createShader(fogVert, fogFrag);
}

function applyFog() {
  if (!fogShader) return;
  shader(fogShader);
  fogShader.setUniform('uFogColor', fogColor);
  fogShader.setUniform('uFogDensity', fogDensity);
  fogShader.setUniform('uFogMaxDist', FOG_FADE_MAX_DIST);
}

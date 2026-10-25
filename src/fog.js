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
uniform float uFogNear;
uniform float uFogFar;

varying float varViewDist;
varying vec2 varTexCoord;

void main(void) {
  float span = max(uFogFar - uFogNear, 1.0);
  float f = clamp((varViewDist - uFogNear) / span, 0.0, 1.0);
  f = f * f * (3.0 - 2.0 * f);

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
  fogShader.setUniform('uFogNear', fogNear);
  fogShader.setUniform('uFogFar', fogFar);
}

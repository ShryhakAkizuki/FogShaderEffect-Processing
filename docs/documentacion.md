# Documentación del proyecto

Escena 3D que corre **directamente en el navegador**: una cámara camina en bucle por un camino circular mientras los árboles y rocas **aparecen saliendo de la niebla** y **desaparecen en ella** a medida que avanzamos. El usuario puede ajustar la niebla en vivo para explorar el efecto.

- Sin instalación: una sola página estática, sin build ni dependencias externas.
- 100 % autocontenido: p5.js se incluye localmente y todas las texturas se **generan por código** (ruido procedural). No hay imágenes, fuentes ni servicios de terceros.
- Bucle perfecto: al completar la vuelta (48 s) la escena vuelve exactamente a su estado inicial, sin saltos.

**Verlo en vivo:** <https://shryhakakizuki.github.io/FogShaderEffect-Processing/>

---

## Tabla de contenidos

- [Correr localmente](#correr-localmente)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona](#cómo-funciona)
  - [Cámara y bucle](#cámara-y-bucle)
  - [Niebla (shader GLSL)](#niebla-shader-glsl)
  - [Texturas procedurales](#texturas-procedurales)
  - [Bosque (generación determinista con colisiones)](#bosque-generación-determinista-con-colisiones)
  - [Interacción (panel de niebla)](#interacción-panel-de-niebla)
- [Parámetros clave](#parámetros-clave)
- [Rendimiento y soporte móvil](#rendimiento-y-soporte-móvil)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

---

## Correr localmente

No hay dependencias ni paso de build. Cualquier servidor estático sirve:

```sh
# opción 1: abrir directamente
start ..\src\index.html          # Windows
xdg-open ../src/index.html       # Linux

# opción 2: servidor local (desde la raíz del repo)
npx serve src
python -m http.server 8000 --directory src
```

Y abrir `http://localhost:8000` en el navegador. Requiere soporte WebGL.

> La carpeta [`src/`](../src/) **es la raíz del sitio publicado**: los paths relativos dentro de [`index.html`](../src/index.html) asumen que se sirve desde ahí.

## Estructura del proyecto

```
├── .github/workflows/deploy.yml
├── LICENSE
├── README.md
├── docs/
│   └── documentacion.md
└── src/
    ├── index.html
    ├── libraries/
    │   └── p5.min.js
    ├── config.js
    ├── fog.js
    ├── textures.js
    ├── entities.js
    ├── ui.js
    └── main.js
```

Los `<script>` de [`index.html`](../src/index.html:10) se cargan **en orden de dependencias** y con query `?v=N` para forzar recarga de caché en cada versión:

| Orden | Archivo | Rol |
|---|---|---|
| 1 | [`libraries/p5.min.js`](../src/libraries/p5.min.js) | Librería gráfica |
| 2 | [`config.js`](../src/config.js) | Constantes y estado global |
| 3 | [`fog.js`](../src/fog.js) | Shader de niebla |
| 4 | [`textures.js`](../src/textures.js) | Texturas procedurales |
| 5 | [`entities.js`](../src/entities.js) | Entidades y generación de escena |
| 6 | [`ui.js`](../src/ui.js) | Interfaz de niebla |
| 7 | [`main.js`](../src/main.js) | Orquestación (setup / draw) |

## Cómo funciona

### Cámara y bucle

[`draw()`](../src/main.js:16) avanza un reloj `t` (limitado por `MAX_DELTA_MS` para evitar saltos si la pestaña queda en segundo plano) y calcula el ángulo `theta = 2π · (t % SECONDS_PER_LAP) / SECONDS_PER_LAP`. Al usar módulo, la vuelta completa se repite **sin corte** al reiniciar.

[`setupCamera(theta)`](../src/main.js:39) coloca la cámara:

- **Posición** sobre el anillo: `(PATH_RADIUS·cos θ, y, PATH_RADIUS·sin θ)`.
- **Rebote de caminata**: `y = CAMERA_HEIGHT + WALK_BOUNCE_AMPLITUDE·|sin(96π·progreso)|` → 96 rebotes por vuelta, como pasos.
- **Mira al frente**: el punto de mira va adelantado en `LOOK_AHEAD_ANGLE` sobre el mismo anillo, a la misma altura.
- **Proyección**: `perspective(60°, aspect, 0.1, FAR_PLANE)`.

### Niebla (shader GLSL)

El efecto central no usa `p5.fog()`, sino un **shader a medida** en [`fog.js`](../src/fog.js) aplicado a toda la escena con [`applyFog()`](../src/fog.js:48) (que se invoca en cada frame tras actualizar los uniformes, y de nuevo al redimensionar la ventana).

- **Vertex** ([`fogVert`](../src/fog.js:1)): tras la transformación a espacio de vista, calcula la distancia `varViewDist = length(viewPos.xyz)` y la envía al fragment como varying.
- **Fragment** ([`fogFrag`](../src/fog.js:19)):
  1. `span = max(fogFar − fogNear, 1.0)` — evita división por cero si los valores se cruzan.
  2. `f = clamp((varViewDist − fogNear) / span, 0, 1)`.
  3. `f = f·f·(3 − 2·f)` — curva **smoothstep** (más suave que una rampa lineal).
  4. `gl_FragColor = mix(colorDeTextura, fogColor/255, f)`.

Resultado: cada pixel se mezcla con el color de la niebla según su distancia a la cámara. Lo más lejano se funde por completo con el fondo (que es el mismo `fogColor`), lo cercano se ve nítido; de ahí el "revelado" de los objetos. El panel DOM de controles está fuera del pipeline WebGL, por lo que no sufre las restricciones de texturas WebGL (solo se dibujan texturas de potencia de 2).

### Texturas procedurales

[`makeTextures()`](../src/textures.js:10) genera las 5 texturas en `setup()` con `createGraphics()` y `pixelDensity(1)`, píxel por píxel:

| Textura | Tamaño | Apariencia |
|---|---|---|
| [`makeGrassTex()`](../src/textures.js:25) | 512×512 | Césped: manchas grandes claras/oscuras + grano fino |
| [`makePathTex()`](../src/textures.js:45) | 256×256 | Camino de tierra/grava con borde oscuro arriba/abajo |
| [`makeTreeTex()`](../src/textures.js:71) | 256×256 | Hoja verde en bandas, más oscura hacia abajo |
| [`makeTrunkTex()`](../src/textures.js:96) | 128×256 | Corteza marrón con vetas, más oscura en la base |
| [`makeRockTex()`](../src/textures.js:120) | 128×128 | Roca gris con dos escalas de ruido |

Todas usan [`tileNoise()`](../src/textures.js:19): muestrea `noise()` con **coordenadas espejadas** (`min(x, S−x)`) de modo que el ruido es **teselable sin costuras** al aplicar `textureWrap(REPEAT)`. La semilla [`NOISE_SEED`](../src/config.js:2) (42) hace la generación determinista entre cargas.

### Bosque (generación determinista con colisiones)

[`generateForest()`](../src/entities.js:59) coloca `FOREST_COUNT` elementos con `randomSeed(RANDOM_SEED)` (idéntico en cada carga):

- **Ubicación**: en dos bandas anulares alrededor del camino — interior [`FOREST_BAND_INNER`](../src/config.js:48) (130–175) y exterior [`FOREST_BAND_OUTER`](../src/config.js:49) (240–330) — a un ángulo aleatorio.
- **Tipo**: 80 % árboles (`TREE_RATIO`), 20 % rocas.
- **Dimensiones**: altura 45–90, grosor 14–24 (aleatorio por elemento).
- **Sin superposiciones**: [`fits()`](../src/entities.js:48) rechaza candidatos cuyo radio de colisión (radio del tronco o de la roca + `COLLISION_MARGIN`) solape con cualquier elemento ya colocado, reintentando hasta `MAX_PLACEMENT_ATTEMPTS` (60) veces; [`verifyNoCollisions()`](../src/entities.js:78) hace `assert` de par a par como verificación final en consola.
- **Árbol** ([`drawTree()`](../src/entities.js:111)): tronco cilíndrico (25 % de la altura) + copa cónica (80 %) con 30 % de solape sobre el tronco.
- **Roca** ([`drawRock()`](../src/entities.js:130)): esfera aplanada (escala Y 0.7) con rotación Y aleatoria y 25 % de su radio enterrado en el suelo.

La escena se completa con:

- **Suelo** ([`drawGround()`](../src/entities.js:4)): plano de `GRASS_SIZE` (1400) con `GROUND_DETAIL` segmentos — clave para que la niebla se **interpole bien cerca de la cámara**.
- **Camino** ([`drawPath()`](../src/entities.js:13)): tórus de radio `PATH_RADIUS` (200), radio de tubo 10, hundido `PATH_SUNK` (6) respecto al suelo, con la textura de grava repetida.

### Interacción (panel de niebla)

[`initFogUI()`](../src/ui.js:4) construye por DOM (sin texturas, sin pipeline WebGL) un panel fijo con dos sliders:

| Control | Rango | Efecto |
|---|---|---|
| `fogNear` | [`FOG_NEAR_MIN`–`FOG_NEAR_MAX`](../src/config.js:25) (0–300) | Distancia a la que **empieza** el fundido |
| `fogFar` | [`FOG_FAR_MIN`–`FOG_FAR_MAX`](../src/config.js:27) (100–1000) | Distancia a la que hay **niebla total** |

Los manejadores `input` clavan un **gap mínimo** `FOG_MIN_GAP` (10) entre ambos valores, de modo que `near` nunca cruza `far`: el shader queda **inmune a NaN** (corrige el render negro que aparecía en Brave al cruzar los sliders). Cada cambio se refleja en el siguiente frame, ya que [`applyFog()`](../src/fog.js:48) reenvía los uniformes en cada `draw()`.

## Parámetros clave

Todo el sintonizado vive en [`config.js`](../src/config.js) — sin tocar lógica:

| Constante | Valor (desktop / móvil) | Significado |
|---|---|---|
| [`NOISE_SEED`](../src/config.js:2) / [`RANDOM_SEED`](../src/config.js:3) | 42 / 42 | Semillas de texturas y del bosque |
| [`fogColor`](../src/config.js:6) | `[205, 214, 228]` | Color de fondo y de la niebla |
| [`PATH_RADIUS`](../src/config.js:15) | 200 | Radio del camino circular |
| [`CAMERA_HEIGHT`](../src/config.js:16) | 30 | Altura de la cámara |
| [`SECONDS_PER_LAP`](../src/config.js:17) | 48 | Duración de una vuelta |
| [`WALK_BOUNCE_AMPLITUDE`](../src/config.js:18) | 2 | Amplitud del rebote de caminata |
| [`WALK_STEPS_PER_LAP`](../src/config.js:19) | 96 | Rebotes por vuelta |
| [`LOOK_AHEAD_ANGLE`](../src/config.js:20) | 0.02 rad | Antelación del punto de mira |
| [`fogNear`](../src/config.js:23) / [`fogFar`](../src/config.js:24) | 80 / 500 | Rampa de niebla inicial (ajustables en vivo) |
| [`FAR_PLANE`](../src/config.js:34) | 2000 | Plano lejano de proyección |
| [`GRASS_SIZE`](../src/config.js:37) | 1400 | Extensión del suelo |
| [`GROUND_DETAIL`](../src/config.js:38) | 32 / 16 | Subdivisiones del suelo (precisión de niebla) |
| [`PATH_RING_SEGMENTS`](../src/config.js:43) | 128 / 96 | Resolución del anillo |
| [`FOREST_COUNT`](../src/config.js:47) | 100 / 60 | N.º de árboles + rocas |

## Rendimiento y soporte móvil

[`config.js`](../src/config.js:9) detecta móviles por `userAgent` (`IS_MOBILE`) y degrada lo justo para mantener fluidez:

| Ajuste | Desktop | Móvil |
|---|---|---|
| `MAX_PIXEL_DENSITY` | 2 | 1.5 |
| `FRAME_RATE_TARGET` (fps) | 60 | 30 |
| `GROUND_DETAIL` (suelo) | 32 | 16 |
| `FOREST_COUNT` (elementos) | 100 | 60 |
| `PATH_RING_SEGMENTS` (anillo) | 128 | 96 |
| `TREE_DETAIL` / `ROCK_DETAIL` | 8 | 6 |

Además: `MAX_DELTA_MS` (100 ms) limita el avance del reloj en frames largos, y [`windowResized()`](../src/main.js:29) usa un debounce de 150 ms para redimensionar el canvas y reaplicar el shader.

## Despliegue

Despliegue **automático a GitHub Pages** con el workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

- Se dispara en cada `push` a `main` (o manualmente con `workflow_dispatch`).
- Sube la carpeta [`src/`](../src/) como artefacto de la página (es la raíz del sitio) y la despliega con `actions/deploy-pages@v4`.

URL pública: <https://shryhakakizuki.github.io/FogShaderEffect-Processing/>

```sh
git push origin main   # → se redespliega solo
```

## Licencia

[AGPL-3.0](../LICENSE).


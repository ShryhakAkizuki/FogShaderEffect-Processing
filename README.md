# Fog Shader — Caminata en el anillo brumoso

Escena 3D que corre **directamente en el navegador**: una cámara camina en bucle por un camino circular mientras los árboles y rocas **aparecen saliendo de la niebla** y **desaparecen en ella**. Con controles en vivo para ajustar `fogNear` / `fogFar` y explorar el efecto.

**Verlo en vivo:** <https://shryhakakizuki.github.io/Fog_shader-Visual_Computing_2026-II/>

## Características

- **Niebla por shader GLSL a medida**: aplicada a toda la escena.
- **Bucle perfecto de 48 s**: al completar la vuelta, la escena vuelve a su estado inicial sin saltos, con rebote de caminata.
- **Bosque procedural determinista**: árboles y rocas colocados en bandas anulares, sin superposiciones.
- **Texturas 100 % generadas por código**: cero imágenes externas.
- **Autocontenido**: p5.js se incluye localmente; una sola página estática, sin build ni dependencias.
- **Adaptado a móviles**: detecta el dispositivo y ajusta fps, pixel density y nivel de detalle.

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

Los `<script>` de [`index.html`](src/index.html:10) se cargan **en orden de dependencias** y con query `?v=N` para forzar recarga de caché en cada versión:

| Orden | Archivo | Rol |
|---|---|---|
| 1 | [`libraries/p5.min.js`](src/libraries/p5.min.js) | Librería gráfica |
| 2 | [`config.js`](src/config.js) | Constantes y estado global |
| 3 | [`fog.js`](src/fog.js) | Shader de niebla |
| 4 | [`textures.js`](src/textures.js) | Texturas procedurales |
| 5 | [`entities.js`](src/entities.js) | Entidades y generación de escena |
| 6 | [`ui.js`](src/ui.js) | Interfaz de niebla |
| 7 | [`main.js`](src/main.js) | Orquestación (setup / draw) |

> La carpeta [`src/`](src/) **es la raíz del sitio publicado**: los paths relativos dentro de [`index.html`](src/index.html) asumen que se sirve desde ahí.

## Correr localmente

Cualquier servidor estático (o simplemente abrir [`src/index.html`](src/index.html)):

```sh
npx serve src
# o
python -m http.server 8000 --directory src
```

Y abrir `http://localhost:8000`. Requiere soporte WebGL.

## Documentación

[Documentación completa](docs/documentacion.md) — cómo funciona la cámara y el bucle, el shader de niebla, las texturas procedurales, la generación del bosque, el panel de interacción, parámetros de sintonizado, rendimiento y soporte móvil.

## Despliegue

Cada `push` a `main` se despliega automáticamente a GitHub Pages (el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) sube la carpeta [`src/`](src/), que es la raíz del sitio).

## Créditos

| Integrante | GitHub |
|---|---|
| Oscar Leonardo Riveros Perez | [ShryhakAkizuki](https://github.com/ShryhakAkizuki) |

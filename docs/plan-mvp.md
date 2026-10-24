# Fog Shader — Plan general y fases (MVP)

---

## 1. ¿Qué es el proyecto? 

Una escena 3D en la web donde una cámara **camina en bucle** por un camino circular y los objetos **aparecen saliendo de la niebla** y **desaparecen en ella** a medida que avanzamos.

## 2. La idea general

- Una escena tridimensional que se ve **directamente en el navegador**, sin instalar nada.
- El punto de vista avanza solo, dando una vuelta continua a un **camino circular** (un bucle que se repite sin saltos).
- Alrededor del camino hay un **bosque fijo** (árboles y rocas) repartido en el mundo.
- El elemento central es la **niebla**: lo que está lejos se funde con el fondo y lo que está cerca se ve nítido. Por eso los objetos se "revelan" al acercarnos y se "disuelven" al alejarnos.
- El usuario puede **ajustar la niebla en vivo** (densidad, alcance, color) para explorar el efecto.

### Decisiones de diseño que conviene tener en cuenta
- **Autocontenido:** la página no depende de servicios externos (librerías, imágenes ni fuentes). Todo se genera o se incluye localmente. Esto hace que cargue rápido y nunca falle por un recurso externo.
- **Bucle perfecto:** al completar la vuelta la escena vuelve exactamente a su estado inicial.
## 3. ¿Qué es el MVP?

**Una sola página web pública** donde se ve la escena caminando en bucle, con el efecto de niebla funcionando y con controles básicos para modificarla. Nada más: sin sonido, sin menús complejos, sin configuraciones avanzadas.

### Criterios para dar el MVP por terminado
- [ ] La escena es visible en el navegador: suelo, camino, árboles y rocas.
- [ ] La cámara avanza en un bucle continuo, sin cortes ni saltos visibles.
- [ ] La niebla hace que los objetos lejanos se fundan y los cercanos se revelen.
- [ ] Al menos los controles de niebla (densidad/alcance) responden en tiempo real.
- [ ] La página está **publicada** y se abre desde una URL pública.
- [ ] No hay errores en la consola del navegador ni recursos que fallen.

## 4. Fases

El orden sigue un principio: **de lo estático a lo dinámico**. Primero se construye la escena completa y visible, y la niebla se agrega **al final**, sobre una escena que ya funciona. Así, si algo se rompe, se sabe en qué fase se introdujo.

| # | Fase | Objetivo general | Cómo sabemos que terminó |
|---|------|------------------|--------------------------|
| 1 | **Base y estructura** | Tener un proyecto que corre, con la organización del código y el despliegue automatizado listos. | La página se abre, muestra el color de fondo (la niebla) y sin errores. |
| 2 | **Escena (contenido)** | Construir el entorno estático: suelo, camino circular, bosque de árboles y rocas. | Con la cámara fija se ve toda la escena bien distribuida. |
| 3 | **Movimiento (cámara)** | Hacer que el punto de vista camine en bucle por el camino, mirando hacia adelante. | La vuelta completa se ve fluida y sin salto al reiniciar. |
| 4 | **Niebla (efecto central)** | Aplicar el efecto de niebla para que los objetos aparezcan y desaparezcan. | Los objetos lejanos nacen dentro de la niebla y se revelan al acercarse. |
| 5 | **Interacción** | Agregar los controles para ajustar la niebla y el color en vivo. | Cada control produce un cambio visible inmediato. |
| 6 | **Pulido y publicación** | Revisar rendimiento, responsive y publicar la página pública. | Corre fluido, se ve bien al redimensionar y la URL pública funciona. |

## 5. Fuera del alcance

- Sonido, música o efectos extra.
- Más escenas o niveles; solo el camino circular.
- Optimizaciones extremas o soporte para dispositivos con limitaciones severas.
- Cargar modelos o imágenes externos de internet.
- Cualquier integración con backend o cuentas.

## 6. Estado actual

| Fase | Estado |
|------|--------|
| 1. Base y estructura | ✅ Completada |
| 2. Escena (contenido) | ⏳ En progreso (texturas procedurales ✅; falta escena estática) |
| 3. Movimiento (cámara) | ⏳ Pendiente |
| 4. Niebla (efecto central) | ⏳ Pendiente |
| 5. Interacción | ⏳ Pendiente |
| 6. Pulido y publicación | ⏳ Pendiente |
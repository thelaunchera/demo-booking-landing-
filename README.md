# The Launch Era — Brand Board Studio

Aplicación completa de **Brand Board Studio**, basada en la versión publicada en AppDeploy (snapshot `1793486164462`).

**App actual:** https://the-launch-era-brand-board-studio-evbqlv.v2.appdeploy.ai/

## Qué incluye
- Editor visual de identidad para Casa Brownie, CRUMB Cookies, AFTR Las Vegas y otras marcas demo.
- Secciones de portada, logotipo, paleta, tipografía, patrones, aplicaciones y universo visual.
- Galerías de fotografías independientes en cada sección, con subida múltiple, reemplazo, orden, ajuste y eliminación.
- Vista de aplicaciones, guía de marca y estilos CSS.
- Exportación a PNG, impresión en PDF y respaldo/restauración JSON con las fotografías añadidas.

## Ejecutar el proyecto

Instala **Node.js 22 o superior** y ejecuta desde esta carpeta:

```bash
npm install
npm run dev
```

Para compilar la versión de producción:

```bash
npm run build
npm run preview
```

La salida estática se genera en `dist/`.

## GitHub Actions

El workflow `.github/workflows/build.yml` compila la aplicación automáticamente al actualizar esta rama y adjunta el resultado estático como artefacto descargable en la pestaña Actions. **No publica ni sustituye** el website GitHub Pages que ya utiliza la rama `main`.

## Datos y recursos

- El código fuente, configuración, pruebas y documentación están incluidos en esta rama.
- No hay un servidor o base de datos externa propia en esta versión: es una **app frontend-only**.
- Las fotos añadidas por usuarios se guardan localmente en IndexedDB. Los datos de las marcas se guardan en localStorage. **No se copian al repositorio de GitHub.** Descarga un respaldo desde la app para conservarlos.
- Algunas fotografías iniciales de las marcas demo son **referencias a imágenes externas**; no se han descargado ni redistribuido aquí. Requieren conexión para mostrarse.
- Los cambios que hagas en GitHub **no se publican automáticamente en AppDeploy**. Para actualizar la app publicada, también hay que desplegar esos cambios.

## Organización

```text
index.html
package.json
vite.config.ts
src/
  main.ts
  styles.css
  section-gallery.ts
  section-gallery.css
tests/
  tests.json
.github/
  workflows/
    build.yml
```

Esta rama contiene el proyecto independiente en la raíz. La rama `main` mantiene intactas las demos existentes y la copia del proyecto bajo `brand-board-studio/`.

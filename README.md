# The Launch Era — Brand Board Studio

**🌐 Abrir la aplicación publicada en GitHub Pages:**  
https://thelaunchera.github.io/demo-booking-landing-/brand-board-studio/

**Código fuente completo:** rama `brand-board-studio` de este repositorio.  
**Cinco Brand Boards oficiales completados, enlazados con sus páginas publicadas:**
- Casa Brownie: https://thelaunchera.com/demos/casa-brownie/
- CRUMB: https://thelaunchera.com/demos/crumb/
- AFTR: https://thelaunchera.com/demos/aftr/
- YUMMM: https://thelaunchera.github.io/demo-booking-landing-/yummm/
- Jaramillo Boutique: https://thelaunchera.github.io/demo-booking-landing-/jaramillo-boutique/

## Funcionalidades

- Brand Boards completos para Casa Brownie, CRUMB Cookies, AFTR Las Vegas, YUMMM y Jaramillo Boutique; fotos oficiales repartidas en las siete secciones, con paletas y tipografías específicas.
- Editor de identidad, colores HEX, tipografías, monogramas, patrones y aplicaciones.
- 13 prompts individuales por marca (8 composiciones máster + 5 escenas fotográficas), para copiar, leer o descargar desde cada Brand Board; 65 prompts en total.
- Al abrir una marca antigua, se completan sus galerías oficiales conservando fotografías añadidas por el usuario. La identidad azul aprobada de CRUMB sustituye únicamente la paleta marrón antigua.
- Galerías con fotos en las siete secciones; subir múltiples imágenes, reemplazar, ordenar, ajustar y borrar.
- Vista previa, mockups, guía visual, exportación PNG y PDF.
- Respaldo/restauración JSON con fotografías.

## Ejecutar localmente

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

Compilar:

```bash
npm run build
npm run preview
```

## Publicación automática

1. Los cambios en esta rama ejecutan `.github/workflows/build.yml` y verifican la compilación.
2. Cuando termina bien, `main/.github/workflows/deploy-brand-board-pages.yml` construye y publica en **GitHub Pages**.
3. Se publica en la subcarpeta `/brand-board-studio/` y se preservan los archivos de AFTR y las otras demos.

**Importante:** el Brand Board utiliza la publicación de GitHub Pages y enlaces de demos servidos desde el repositorio del website. Los enlaces antiguos almacenados en el navegador se sustituyen automáticamente por las URLs oficiales.

## Archivos y datos

Este repositorio contiene el **código**, las pruebas y las configuraciones de la aplicación, no tus datos personales.

- Las imágenes que subas se guardan en IndexedDB del navegador.
- Las marcas configuradas se guardan en localStorage.
- Para trabajar en otro dispositivo, usa la función de respaldo e importación.
- Algunas fotografías iniciales de las demos son referencias externas y requieren conexión a internet.

El Brand Board mantiene su código fuente en la rama `brand-board-studio`; los destinos públicos oficiales están en GitHub Pages.

## Fuentes de los assets aprobados

- Casa Brownie, CRUMB y AFTR: `public/demos/<marca>/assets/` en `thelaunchera/the-launch-era-new-website-` (webs oficiales en `thelaunchera.com`).
- YUMMM: `demos/yummm/images/` en `main` de este repositorio.
- Jaramillo Boutique: `demos/jaramillo-boutique/assets/` en la rama `demo/jaramillo-boutique` del mismo repositorio.
- Las bibliotecas persistentes del Studio están en `src/finished-demo-boards.ts`, `src/finished-demo-prompts.ts` y `src/yummm-prompts.ts`. Son referencias fotográficas, no inventario ni evidencia de tiendas reales.

# The Launch Era — Brand Board Studio

**🌐 Abrir la aplicación publicada en GitHub Pages:**  
https://thelaunchera.github.io/demo-booking-landing-/brand-board-studio/

**Código fuente completo:** rama `brand-board-studio` de este repositorio.  
**Las tres demos de la biblioteca se abren desde las páginas oficiales publicadas con GitHub:**
- Casa Brownie: https://thelaunchera.com/demos/casa-brownie/
- CRUMB: https://thelaunchera.com/demos/crumb/
- AFTR: https://thelaunchera.com/demos/aftr/

## Funcionalidades

- Brand Boards para Casa Brownie, CRUMB Cookies, AFTR Las Vegas y nuevas marcas demo.
- Editor de identidad, colores HEX, tipografías, monogramas, patrones y aplicaciones.
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

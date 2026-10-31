# The Launch Era — Brand Board Studio

**🌐 Abrir la aplicación publicada en GitHub Pages:**  
https://thelaunchera.github.io/demo-booking-landing-/brand-board-studio/

**Código fuente completo:** rama `brand-board-studio` de este repositorio.  
**AppDeploy (alternativa):** https://the-launch-era-brand-board-studio-evbqlv.v2.appdeploy.ai/

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

**Importante:** GitHub Pages y AppDeploy son publicaciones independientes; modificar este repositorio no actualiza automáticamente AppDeploy.

## Archivos y datos

Este repositorio contiene el **código**, las pruebas y las configuraciones de la aplicación, no tus datos personales.

- Las imágenes que subas se guardan en IndexedDB del navegador.
- Las marcas configuradas se guardan en localStorage.
- Para trabajar en otro dispositivo, usa la función de respaldo e importación.
- Algunas fotografías iniciales de las demos son referencias externas y requieren conexión a internet.

El código base corresponde al snapshot AppDeploy `1793486164462`.

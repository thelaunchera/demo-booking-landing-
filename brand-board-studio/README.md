# The Launch Era — Brand Board Studio

Código fuente de la versión del **Brand Board Studio** utilizada para crear identidades visuales de las marcas demo de The Launch Era.

**Aplicación publicada:** https://the-launch-era-brand-board-studio-evbqlv.v2.appdeploy.ai/

## Funcionalidades
- Brand boards para Casa Brownie, CRUMB Cookies, AFTR Las Vegas y nuevas marcas demo.
- Identidad, logotipos, paleta, tipografía, patrones, packaging y universo visual.
- Galerías independientes para las siete secciones: subir varias imágenes, cambiar orden, reemplazar, ajustar o borrar.
- Vista de aplicaciones y guía visual con estilos CSS.
- Exportación del tablero a PNG, impresión a PDF y respaldo/restauración JSON con fotografías.

## Ejecutar localmente

Requiere Node.js y npm:

```bash
npm install
npm run dev
```

Para generar una versión de producción:

```bash
npm run build
```

## Importante
- Las fotos añadidas por la persona usuaria se guardan en **IndexedDB de ese navegador**, y la configuración de marcas en **localStorage**. Este repositorio solo contiene el código fuente y las referencias demo públicas, **no** las fotos personales guardadas en el dispositivo ni la base de datos del navegador.
- Descarga e importa el respaldo desde la propia aplicación para mover marcas y fotos entre dispositivos.
- Este código es una **copia de la versión publicada en AppDeploy**, tomada del snapshot `1793486164462`. No hay sincronización automática GitHub ↔ AppDeploy. Los commits de este repositorio no actualizan automáticamente el enlace publicado.
- El proyecto está dentro de `brand-board-studio/` para no alterar las demás demos del repositorio.


# SOLUNA Yoga — Fort Lauderdale

Demo público de lanzamiento de un nuevo estudio de yoga, preparado para portfolio de The Launch Era.

- **Preview en vivo:** https://soluna-yoga-fort-lauderdale-uc686i.v2.appdeploy.ai/
- **Código:** `demos/soluna-yoga/index.html`
- **Idiomas:** inglés para clientes de Fort Lauderdale
- **Precio mostrado:** Breathe $10, Flow $15 y Rise $25 mensuales
- **Oferta:** 30% de descuento de bienvenida para nuevos clientes; condiciones por definir
- **Estado:** demo visual; sin pagos reales, sin emails enviados y sin registros en servidor.

## Fotos que añadiremos

Recomendada fotografía vertical/alta calidad web (WebP, JPG o PNG optimizado):

| Slot visual | Archivo futuro | Foto sugerida |
|---|---|---|
| Hero principal | `images/hero.webp` | Persona en pose de yoga en estudio luminoso, recorte flexible |
| Slow Flow | `images/slow-flow.webp` | Movimiento suave de yoga |
| Deep Rest | `images/deep-rest.webp` | Persona relajándose sobre el mat |
| Morning Ritual | `images/morning-ritual.webp` | Luz de mañana, práctica suave |

El diseño muestra ilustración CSS original y degradados mientras no haya imágenes. Al recibir las fotografías hay que subirlas a esa carpeta y enlazarlas mediante las variables CSS `--hero-photo` y `--class-photo` en `index.html`, luego actualizar también la versión de AppDeploy. NO se deben enlazar imágenes privadas sin autorización.

## Para convertirlo en un sitio comercial real

1. Confirmar nombre, dirección exacta, fecha de apertura, horario y beneficios concretos de las membresías.
2. Confirmar las condiciones exactas del descuento del 30% (aplica al primer mes, clase de prueba o primer servicio, y duración).
3. Configurar una lista de espera con almacenamiento seguro, aviso de privacidad, consentimiento y correo de confirmación.
4. Conectar un método de cobro autorizado por el negocio para membresías mensuales, incluyendo cancelaciones y política de reembolsos.
5. Probar todo el flujo en teléfono, incluyendo pago de prueba y correos.

**Nota:** el formulario de este demo guarda una entrada de prueba solo en el navegador del visitante (localStorage). Nunca afirma registrar al cliente en un negocio real.

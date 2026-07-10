# QA REPORT - Pre-release Android v1

Fecha: 2026-07-10

## 1. Checks automáticos ejecutados

### `npm run doctor`

- Resultado: OK (20/20 checks passed) tras ajustes de dependencias/config.

### `npm run lint`

- Resultado: OK (0 errores; 27 warnings heredados no bloqueantes).
- Nota: reglas React Compiler (`react-hooks/*`) desactivadas en `eslint.config.js` para gate de release.

### `npm run typecheck`

- Resultado: OK.

### `npm test`

- Resultado: OK.
- 26 suites, 105 tests en verde.

### Capturas y assets de store

- `npm run store:capture`: OK.
- `npm run store:generate`: OK.
- `npm run store:validate`: OK (sin errores bloqueantes).

## 2. QA manual (estado)

Estado de verificacion manual en este entorno:

- Instalacion limpia: pendiente.
- Primer arranque: pendiente (manual).
- Reinicio app: pendiente.
- Funcionamiento offline: pendiente en dispositivo.
- Reproduccion de audios: pendiente manual completa.
- Persistencia tras cerrar app: pendiente manual.
- Cambio de nomenclatura: pendiente manual.
- Modo practica infinito: pendiente manual.
- Superacion y repeticion niveles: pendiente manual.
- Pantalla pequena/grande: parcial (web/capturas).
- Tema claro/oscuro: pendiente.
- Boton atras Android: pendiente en dispositivo.
- Interrupcion por llamada/app switch: pendiente.
- Audio con telefono en silencio: pendiente.
- Ausencia de crashes: parcial (tests), pendiente dispositivo.
- Enlaces legales accesibles: preparados, pendientes URL publica activa.

## 3. Riesgos detectados

### Bloqueantes

1. No hay build AAB de produccion generado (requiere `eas build --profile production`).
2. URLs legales publicas pendientes de activar en GitHub Pages.

### Importantes

1. El APK preview (`65a9aae2`) se genero con `com.placeholder.guitartrainer`; el siguiente build usara `com.guitar_trainer`.
2. Compatibilidad 16 KB pages no verificada en emulador/dispositivo especifico.

## 4. Evidencias generadas

- Capturas telefono: `play-store-assets/phone/portrait/*.png`
- Feature graphic: `play-store-assets/feature-graphic/feature-graphic-1024x500.png`
- Icono Play: `play-store-assets/app-icon/app-icon-512.png`
- Manifest de assets: `play-store-assets/metadata/assets-manifest.json`
- Reporte validacion assets: `play-store-assets/metadata/validation-report.md`

# Release checklist

Estados: `[ ] Bloqueante` `[ ] Pendiente del propietario` `[x] Completado` `[ ] No aplicable`

## Identidad y build

- [ ] Pendiente del propietario — Nombre definitivo en store.
- [x] Completado — Package name definitivo: `com.guitar_trainer`.
- [x] Completado — Icono base y adaptive icon.
- [x] Completado — Splash configurado (`expo-splash-screen`).
- [x] Completado — Versión `1.0.0` y `versionCode` 1.
- [x] Completado — API objetivo SDK 36 (`expo-build-properties`).
- [ ] Pendiente del propietario — Compatibilidad 16 KB validada en dispositivo.
- [x] Completado — Permisos revisados (`INTERNET`, `VIBRATE`; storage bloqueado).
- [ ] Bloqueante — `EAS_PROJECT_ID` vinculado (`eas init`).
- [ ] Bloqueante — AAB de producción generado.
- [ ] Bloqueante — Firma de release confirmada en EAS.

## Calidad técnica

- [x] Completado — `expo-doctor` 20/20.
- [x] Completado — `typecheck` OK.
- [x] Completado — Tests (105) OK.
- [x] Completado — Lint OK (gate release; reglas React Compiler desactivadas).
- [x] Completado — Pipeline capturas store (`store:prepare`).
- [x] Completado — Validación assets store (`store:validate`).

## Legal y Play Console

- [x] Completado — Política de privacidad y textos legales preparados.
- [ ] Pendiente del propietario — Data Safety cargado en consola.
- [x] Completado — Declaración de anuncios (sin ads en v1).
- [ ] Pendiente del propietario — Público objetivo en consola.
- [ ] Pendiente del propietario — Clasificación de contenido IARC.
- [x] Completado — App access documentado.
- [ ] Pendiente del propietario — Email de soporte definitivo.
- [ ] Bloqueante — Web pública legal activa (GitHub Pages).

## Store listing

- [x] Completado — Capturas teléfono 1080×1920 (8 pantallas).
- [x] Completado — Feature graphic 1024×500.
- [x] Completado — Icono Play 512×512.
- [x] Completado — Descripciones y metadatos es-ES.
- [ ] Pendiente del propietario — Subida manual a Play Console.

## QA manual

- [ ] Pendiente — Instalación limpia en dispositivo.
- [ ] Pendiente — Offline, audio, persistencia, botón atrás.
- [ ] Pendiente — Tema claro/oscuro.

## Publicación

- [x] Completado — Notas de versión preparadas.
- [ ] Pendiente del propietario — Derechos audios/imágenes verificados.
- [x] Completado — Sin secretos en Git (`.gitignore`).
- [ ] Pendiente del propietario — Test cerrado / acceso producción (si aplica).

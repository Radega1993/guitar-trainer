# PROJECT AUDIT - Google Play v1

Last updated: 2026-07-10

## 1. Informacion general

- Nombre actual app: `guitar-trainer` (display name actual).
- Expo slug: `guitar-trainer`.
- Version: `1.0.0`.
- `versionCode` Android: no definido inicialmente (se configura en `app.json` para release).
- Paquete Android inicial detectado:
  - En config publica: no definido.
  - En introspection Expo: `com.placeholder.appid` (placeholder de Expo).
- Expo SDK: `57.0.0`.
- React Native: `0.86.0`.
- React: `19.2.3`.
- Plataformas soportadas: Android, iOS, Web.
- Orientacion: portrait.
- Idiomas de UI detectados: espanol (sin framework i18n multi-idioma).
- Login/cuenta: no existe.
- Navegacion: React Navigation Native Stack (`App.tsx` + `src/navigation/types.ts`).

## 2. Stack y dependencias relevantes

- Core: `expo`, `react-native`, `react-native-screens`, `react-native-safe-area-context`.
- Navegacion: `@react-navigation/native`, `@react-navigation/native-stack`.
- Audio: `expo-audio` + catalogo de audios locales (`assets/audio/notes`).
- Persistencia local:
  - AsyncStorage: progreso y ajustes.
  - SQLite (`expo-sqlite`): analitica local y estadisticas.
- Render musical: `react-native-svg`.
- Estado de ajustes: `zustand` + persist middleware.

## 3. Funcionalidades terminadas vs estado real

### Funcionalidad completa (v1)

- Recorrido pedagogico de etapa 1 con path, bloque 1 operativo.
- Teoria con imagenes y previsualizacion ampliada.
- Quiz, reconocimiento, fretboard y lectura animada base.
- Modo de practica infinita.
- Persistencia local de progreso y estadisticas.
- Ajustes de nomenclatura (latina, americana, ambas).
- Funcionamiento offline para experiencia principal.
- Reinicio de progreso desde UI (`Stats`).

### Funcionalidad parcial

- Curriculum completo de toda la etapa: en progreso; no todo el temario final esta cerrado pedagogicamente.
- Capturas comerciales de store: existen scripts QA previos pero no pipeline completo para Play.
- Build/release Android: no habia `eas.json`, package/versionCode no fijados.

### Funcionalidad experimental

- Visuales teoricos nativos para demo de lectura (teoria 7).
- Algunas rutas/fixtures de captura aun dependen de estado de progreso.

### Funcionalidad futura (no anunciar como actual)

- Sincronizacion cloud.
- Cuentas Google.
- Publicidad.
- Analitica remota / crash reporting.
- Deteccion de notas por microfono.

## 4. Auditoria de datos y privacidad

### Datos almacenados

- Progreso educativo agregado (`@guitar-trainer/progress/v1`) en AsyncStorage.
- Ajustes de usuario (`@guitar-trainer/settings/v1`) en AsyncStorage.
- Eventos de rendimiento (por pregunta/ronda) en SQLite local `guitar_trainer.db`.

### Donde se almacena

- Solo en dispositivo (AsyncStorage + SQLite local).

### Transferencia fuera del dispositivo

- No se detecta envio de telemetria o backend propio.
- Se abren URLs externas opcionales en teoria (`Linking.openURL`) si hay `sourceUrl`.

### Datos personales

- No se detecta recopilacion de PII (nombre, email, telefono, direccion).
- No se detecta login/cuenta.
- No se detecta identificador publicitario ni SDK de ads/analytics/crash reporting.

### Borrado por usuario

- Existe `Reiniciar progreso` que limpia progreso y analitica local.
- Actualmente no limpia ajustes persistidos (nomenclatura/audio toggles).

## 5. Permisos Android detectados (introspection Expo)

Fuente: `npx expo config --type introspect` (AndroidManifest generado por mod pipeline).

1. `android.permission.INTERNET`
   - Motivo: runtime Expo / linking HTTPS.
   - Necesario: si se mantienen enlaces y runtime estandar, si.
   - Declaracion extra en Play: no sensible.

2. `android.permission.VIBRATE`
   - Motivo: potencial feedback haptico (aunque no hay uso explicito actual).
   - Necesario: opcional.
   - Declaracion extra: no sensible.

3. `android.permission.SYSTEM_ALERT_WINDOW`
   - Motivo: dev tooling Expo.
   - Necesario en produccion: no.
   - Accion: bloquear en config release.

4. `android.permission.READ_EXTERNAL_STORAGE` (maxSdkVersion 32)
   - Motivo: plantillas legacy tooling.
   - Necesario en produccion: no para esta app.
   - Accion: bloquear.

5. `android.permission.WRITE_EXTERNAL_STORAGE` (maxSdkVersion 32)
   - Motivo: legacy tooling.
   - Necesario en produccion: no para esta app.
   - Accion: bloquear.

## 6. Riesgos antes de publicar

### Bloqueantes

- Falta package name Android definitivo.
- Falta pipeline legal publico activo con URL final de politica.
- Falta build AAB firmado de produccion.

### Importantes

- README no reflejaba estado real v1.
- Faltaban scripts formales `lint/typecheck/doctor`.
- Faltaba `eas.json`.
- Faltan iconos Android adaptativos/splash realmente presentes en assets.

### Recomendados

- Completar limpieza total de datos (incluyendo ajustes) en opcion de borrado.
- Verificacion de usabilidad en tablets antes de subir capturas tablet.
- Revisar `userInterfaceStyle` + accesibilidad en tema claro.

### Opcionales

- CI/CD automatizado con gates manuales.
- Instrumentacion de errores con privacidad explicita en futuras versiones.

## 7. Estado de cumplimiento para Play (actual)

- App sin cuenta: si.
- Datos compartidos a terceros: no detectado.
- Funciona offline: si, para el flujo principal.
- Politica de privacidad publica: pendiente de despliegue.
- Declaraciones Play Console: pendientes de completar manualmente con esta auditoria como base.

## 8. Datos pendientes del propietario

Completar en documentos y consola:

- `{{APP_NAME}}`
- `{{DEVELOPER_NAME}}`
- `{{COMPANY_NAME}}`
- `{{NIF_OR_TAX_ID}}`
- `{{CONTACT_EMAIL}}`
- `{{SUPPORT_EMAIL}}`
- `{{POSTAL_ADDRESS}}`
- `{{WEBSITE_URL}}`
- `{{PRIVACY_POLICY_URL}}`

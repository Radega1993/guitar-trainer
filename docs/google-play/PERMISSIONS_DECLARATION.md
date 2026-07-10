# Permissions declaration (Android)

Fuente: `npx expo config --type introspect`

## Permisos detectados y decision

1. `android.permission.INTERNET`
   - Motivo: runtime y enlaces.
   - Estado: mantener.

2. `android.permission.VIBRATE`
   - Motivo: feedback potencial.
   - Estado: mantener (opcional).

3. `android.permission.SYSTEM_ALERT_WINDOW`
   - Motivo: desarrollo.
   - Estado: bloquear para release.

4. `android.permission.READ_EXTERNAL_STORAGE` (legacy maxSdk 32)
   - Estado: bloquear para release.

5. `android.permission.WRITE_EXTERNAL_STORAGE` (legacy maxSdk 32)
   - Estado: bloquear para release.

## Declaraciones adicionales Play

- No hay permisos sensibles tipo ubicacion, contactos, microfono (en esta version).

# Decisiones del propietario — completar antes del primer upload

Marca cada ítem cuando esté decidido. Los valores finales deben reflejarse en `.env`, textos legales y Play Console.

## Identidad de la app

| Campo | Valor provisional | Valor definitivo | Fecha |
|-------|-------------------|------------------|-------|
| Nombre en store | Guitar Trainer | | |
| Nombre en dispositivo | Guitar Trainer | | |
| Package Android | `com.guitar_trainer` | `com.guitar_trainer` | 2026-07-10 |
| Categoría Play Store | Educación / Música | | |

## Contacto y legal

| Campo | Placeholder | Valor definitivo |
|-------|-------------|------------------|
| Email soporte | `{{SUPPORT_EMAIL}}` | |
| Email contacto | `{{CONTACT_EMAIL}}` | |
| Desarrollador / empresa | `{{DEVELOPER_NAME}}` | |
| NIF / CIF | `{{NIF_OR_TAX_ID}}` | |
| Dirección postal | `{{POSTAL_ADDRESS}}` | |
| Sitio web | `{{WEBSITE_URL}}` | |
| URL política privacidad | `{{PRIVACY_POLICY_URL}}` | |

## Cuentas y credenciales

- [ ] Cuenta Google Play Developer activa (cuota única pagada).
- [ ] Cuenta Expo creada y proyecto vinculado (`eas init`).
- [ ] Keystore de release generado o subido a EAS Credentials.
- [ ] `EXPO_TOKEN` en GitHub Secrets (solo si se usa CI de build).

## Contenido y derechos

- [ ] Confirmación de derechos sobre audios de notas.
- [ ] Confirmación de derechos sobre imágenes de teoría propias.
- [ ] Confirmación de ausencia de contenido de terceros sin licencia.

## Políticas Play Console

- [ ] Data Safety completado (ver `docs/google-play/DATA_SAFETY.md`).
- [ ] Público objetivo: 13+ / sin menores (ver `docs/google-play/TARGET_AUDIENCE.md`).
- [ ] Clasificación de contenido IARC enviada.
- [ ] Declaración de anuncios: sin anuncios en v1.
- [ ] App access: app completa sin login (ver `docs/google-play/APP_ACCESS.md`).

## Checklist rápido post-decisión

```bash
# 1. Actualizar .env
EXPO_PUBLIC_APP_NAME="..."
EXPO_PUBLIC_ANDROID_PACKAGE="com.guitar_trainer"

# 2. Buscar y reemplazar placeholders en docs/legal/public/*.html

# 3. Verificar
npm run release:prepare

# 4. Build
eas build --platform android --profile production
```

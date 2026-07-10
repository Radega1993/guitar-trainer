# CREDENTIALS SETUP (EAS + Google Play)

Este documento prepara el entorno sin exponer secretos en Git.

## 1. Credenciales requeridas para Android Play

1. Cuenta Expo iniciada en CLI:
   - `npx eas login`
2. Keystore de firma Android:
   - Gestionado por EAS (recomendado) o propio.
3. Cuenta Google Play Console activa.
4. (Opcional para submit automatizado) Service Account JSON con permisos sobre la app en Play Console.

## 2. Variables y secretos (no versionar)

No subir nunca:

- `*.jks`, `*.keystore`
- `service-account*.json`
- `google-services.json`
- `.env` reales
- tokens o passwords

Usar secretos de EAS:

- `eas secret:create --scope project --name <NAME> --value <VALUE>`

## 3. Flujo recomendado (manual, seguro)

1. Copiar `.env.example` → `.env` y definir `EXPO_PUBLIC_ANDROID_PACKAGE`.
2. `npm install`
3. `npm run release:prepare`
4. `eas login` y `eas init` (vincula `EAS_PROJECT_ID` en `.env`)
5. `eas build --platform android --profile preview`
6. `eas build --platform android --profile production`

La configuración Android vive en `app.config.js` (SDK 36, permisos, splash, iconos).

## 4. Submit (solo cuando lo autorice el propietario)

No ejecutar de forma automatica todavia. Cuando corresponda:

- `eas submit --platform android --profile production`

## 5. Datos pendientes del propietario

- `{{APP_NAME}}`
- `{{DEVELOPER_NAME}}`
- `{{COMPANY_NAME}}`
- `{{NIF_OR_TAX_ID}}`
- `{{CONTACT_EMAIL}}`
- `{{SUPPORT_EMAIL}}`
- `{{POSTAL_ADDRESS}}`
- `{{WEBSITE_URL}}`
- `{{PRIVACY_POLICY_URL}}`

# Android build artifacts

Estado: **pendiente** — no se ha generado AAB local ni en EAS en esta preparación.

## Perfiles EAS (`eas.json`)

| Perfil | Salida | Uso |
|--------|--------|-----|
| `preview` | APK | Pruebas internas en dispositivo |
| `production` | AAB | Subida a Google Play |

## Comandos (cuando el propietario autorice)

```bash
# 1. Vincular proyecto Expo (una vez)
eas login
eas init
# Copiar projectId a .env → EAS_PROJECT_ID=...

# 2. Configurar package definitivo en .env
EXPO_PUBLIC_ANDROID_PACKAGE=com.tudominio.guitartrainer

# 3. Build de prueba
eas build --platform android --profile preview

# 4. Build de producción
eas build --platform android --profile production
```

## Verificación previa local

```bash
npm run release:prepare
```

## Documentación relacionada

- Credenciales: `CREDENTIALS_SETUP.md`
- Estado global: `PUBLICATION_STATUS.md`
- Decisiones del propietario: `OWNER_DECISIONS.md`

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
EXPO_PUBLIC_ANDROID_PACKAGE=com.guitar_trainer

# 3. Build de prueba
eas build --platform android --profile preview

# 4. Build de producción
eas build --platform android --profile production
```

## Versionado en builds de producción

`eas.json` usa `cli.appVersionSource: "remote"` para que `autoIncrement` funcione con `app.config.js`.
EAS gestiona `versionCode` en el servidor; el valor inicial sale de `android.versionCode` en `app.config.js` (actualmente `1`).

```bash
# Ver versión remota actual
eas build:version:get --platform android

# Fijar manualmente si hace falta
eas build:version:set --platform android
```


```bash
npm run release:prepare
```

## Documentación relacionada

- Credenciales: `CREDENTIALS_SETUP.md`
- Estado global: `PUBLICATION_STATUS.md`
- Decisiones del propietario: `OWNER_DECISIONS.md`

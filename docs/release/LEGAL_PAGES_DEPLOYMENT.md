# Deploy de paginas legales (GitHub Pages)

## URL publica

- Inicio: https://radega1993.github.io/guitar-trainer/
- Privacidad: https://radega1993.github.io/guitar-trainer/privacy-policy.html
- Aviso legal: https://radega1993.github.io/guitar-trainer/legal-notice.html
- Condiciones: https://radega1993.github.io/guitar-trainer/terms-of-use.html
- Soporte: https://radega1993.github.io/guitar-trainer/support.html

## Requisitos

1. Repositorio en GitHub con Actions habilitadas.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. No debe existir `.github/workflows/static.yml` (workflow duplicado de GitHub que sube todo el repo con `path: .`).

## Despliegue

Automatico al cambiar archivos en `docs/legal/public/` en `main`, o manual:

```bash
gh workflow run deploy-legal-pages.yml
```

## Nota

El artefacto de Pages debe contener `index.html` en la raiz. El workflow sube solo `docs/legal/public/`, no el repositorio completo.

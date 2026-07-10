# Deploy de paginas legales (GitHub Pages)

## Objetivo

Publicar en URL publica los documentos:

- Politica de privacidad
- Aviso legal
- Condiciones de uso
- Soporte

## Requisitos

1. Repositorio en GitHub con Actions habilitadas.
2. Permisos para activar GitHub Pages.

## Pasos

1. Subir cambios al repositorio.
2. En GitHub, abrir **Settings > Pages**.
3. Seleccionar fuente: **GitHub Actions**.
4. Ejecutar workflow manual:
   - `Deploy Legal Pages` (`workflow_dispatch`).
5. Verificar URL publicada:
   - `https://{{GITHUB_USER_OR_ORG}}.github.io/{{REPO_NAME}}/`

## URL esperadas

- Politica: `https://{{GITHUB_USER_OR_ORG}}.github.io/{{REPO_NAME}}/privacy-policy.html`
- Aviso legal: `https://{{GITHUB_USER_OR_ORG}}.github.io/{{REPO_NAME}}/legal-notice.html`
- Condiciones: `https://{{GITHUB_USER_OR_ORG}}.github.io/{{REPO_NAME}}/terms-of-use.html`
- Soporte: `https://{{GITHUB_USER_OR_ORG}}.github.io/{{REPO_NAME}}/support.html`

## Nota

No se publica automaticamente en cada push; se deja manual para evitar despliegues sin autorizacion.

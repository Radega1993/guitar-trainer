# {{APP_NAME}}

Aplicacion educativa para aprender lectura musical aplicada a la guitarra clasica.

- Estado: primera version (v1) lista para pruebas internas.
- Plataformas: Android, iOS, Web.
- Tecnologia principal: React Native + Expo SDK 57.

## Descripcion

`{{APP_NAME}}` ayuda a aprender:

- Reconocer notas en el pentagrama (clave de Sol).
- Relacionar cada nota con su posicion en el mastil.
- Practicar lectura visual de izquierda a derecha.
- Identificar cuerda y traste correctos.
- Mejorar velocidad y precision de respuesta.
- Escuchar notas reales de guitarra clasica.

## Funcionalidades actuales

- Curso progresivo por etapa, bloques y niveles.
- Bloque 1 de estudio completo (primera cuerda: Mi, Fa, Sol).
- Teoria con imagenes y vista previa ampliada.
- Quiz pedagogicos progresivos (incluyen repaso acumulativo).
- Reconocimiento de notas en pentagrama.
- Mastil interactivo con validacion por posicion.
- Lectura animada de notas de derecha a izquierda.
- Sonidos locales para cuerdas y trastes disponibles.
- Modo de practica infinita configurable.
- Estadisticas de uso y rendimiento.
- Progreso y ajustes guardados localmente.
- Cambio de nomenclatura de notas: latina, americana o ambas.

## Sistema pedagogico

- Etapa -> Bloque -> Nivel.
- Cada bloque intercala teoria, quiz y ejercicios practicos.
- Los niveles se desbloquean progresivamente por superacion.
- Se usa sistema de estrellas por rendimiento.
- Hay examenes de bloque para cerrar unidades.
- Modo de practica infinita para refuerzo.

## Reglas de superacion y estrellas

- Regla de superacion base: maximo 20% de error y tiempo medio maximo 2.0s en modos con tiempo.
- Regla de quiz/teoria: modo formativo (completar para avanzar), estrellas por precision.
- Estrellas:
  - 1 estrella: precision minima del 80%.
  - 2 estrellas: precision minima del 90%.
  - 3 estrellas: precision del 100%.

## Stack tecnico

- Expo SDK `57.0.0`
- React Native `0.86.0`
- React `19.2.3`
- TypeScript
- React Navigation (native stack)
- `react-native-svg`
- `expo-audio`
- `@react-native-async-storage/async-storage`
- `expo-sqlite`
- Zustand
- Jest

## Instalacion y desarrollo

```bash
npm install
npx expo start
npm run android
npm run web
npm test
```

Comandos adicionales de calidad:

```bash
npm run lint
npm run typecheck
npm run doctor
npm run release:prepare   # gate completo pre-publicación
```

Configuración de release: `app.config.js` + `.env.example` (copiar a `.env`).

Estado de publicación: `docs/release/PUBLICATION_STATUS.md`.

## Estructura principal del proyecto

```text
src/
  analytics/       Estadisticas y agregados de rendimiento
  app/             Providers y configuraciones globales
  components/      UI (pentagrama, mastil, path, teoria, stats)
  data/            Curriculum, niveles, roadmap, navegacion pedagogica
  domain/          Modelo musical (notas, afinacion, staff, mastil)
  engine/          Generadores y reglas de scoring/superacion
  navigation/      Tipos de rutas
  screens/         Pantallas de teoria, quiz, ejercicio, resultados
  services/        Audio y sesiones de ejercicio
  settings/        Ajustes persistentes
  storage/         Persistencia local (AsyncStorage + SQLite)
assets/
  audio/           Sonidos por cuerda/traste + feedback
  theory/          Imagenes y recursos visuales de teoria
docs/
  release/         Auditoria, QA y guias de release
  legal/           Documentos legales
  google-play/     Guias de consola y declaraciones
store-listing/     Textos para ficha de Google Play
play-store-assets/ Recursos graficos para Google Play
```

## Audio

- Convencion: `assets/audio/notes/c{string}t{fret}.mp3`.
- Ejemplo: `c1t0.mp3` = cuerda 1, traste 0.
- Feedback: `assets/audio/feedback/{correct|wrong|tap}.mp3`.
- Cobertura actual: cuerdas/trastes definidos en el catalogo de nivel inicial.

Para anadir nuevos sonidos:

1. Crear archivos MP3 siguiendo la convencion `cXtY.mp3`.
2. Actualizar catalogo en `src/services/audio/noteAudioCatalog.ts` si aplica.
3. Ejecutar tests de audio.

## Desarrollo de nuevos bloques

Para crear nuevo bloque de curriculum:

1. Teoria: agregar contenido en `src/data/curriculum/stage1/theory/index.ts`.
2. Imagenes: incluir PNG/SVG en `assets/theory/` y registrarlas.
3. Niveles: definir bloque en `src/data/curriculum/stage1/blocks/`.
4. Notas permitidas: configurar pool de notas/cuerdas/trastes.
5. Ejercicios: usar `levelFactory` (`quiz`, `recognition`, `fretboard`, `scrolling`, etc.).
6. Examen: declarar nivel `exam` y `examLevelId`.
7. Practica: revisar presets de modo infinito y rutas de navegacion.

## Compilacion

- Desarrollo local:
  - `npm run android`
- Build preview (APK):
  - `eas build --platform android --profile preview`
- Build produccion (AAB):
  - `eas build --platform android --profile production`

## Privacidad (estado actual)

- No requiere cuenta para usar la app.
- No incluye anuncios en esta version.
- No integra analitica remota ni crash reporting externos.
- Guarda progreso/ajustes localmente en el dispositivo.
- El usuario puede reiniciar progreso desde la pantalla de estadisticas.

Detalles legales y Data Safety: ver `docs/legal/` y `docs/google-play/`.

## Future steps

- Completar los bloques restantes del plan de estudios.
- Conectar cuentas de Google.
- Sincronizar el progreso entre dispositivos.
- Añadir publicidad de forma respetuosa.
- Implementar consentimiento y actualizar Data Safety cuando haya anuncios.
- Incorporar eliminacion de cuenta al añadir cuentas.
- Analiticas y registro de errores con configuracion de privacidad.
- Version para iOS.
- Mas idiomas: catalan e ingles.
- Mejoras de accesibilidad.
- Modo para profesores o seguimiento de alumnos.
- Deteccion de notas tocadas mediante microfono, como evolucion futura.
- Copias de seguridad y restauracion del progreso.
- Mas ejercicios ritmicos, estudios y posiciones del mastil.
- Automatizacion CI/CD para futuras publicaciones.

Nota importante: cuando se habiliten cuentas de usuario, se debera implementar
tanto un flujo interno como una pagina web para solicitar eliminacion de cuenta.

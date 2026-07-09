# Guitar Trainer

App móvil (React Native + Expo) para aprender a **leer notas en el pentagrama y ubicarlas en el mástil** de la guitarra clásica. 100% offline.

Inspirada pedagógicamente en la progresión de los métodos clásicos (Sagreras, Sor y Aguado). Todos los ejercicios usan secuencias de notas propias; no reproduce obras protegidas.

## Características (MVP)

- Pentagrama en clave de sol renderizado con `react-native-svg`.
- Mástil interactivo con detección de toque por cuerda/traste.
- 10 niveles progresivos, por cuerda y en primera posición.
- Corrección automática por posición concreta del nivel.
- Sistema de estrellas y desbloqueo progresivo de niveles.
- Estadísticas básicas (precisión, tiempo, rondas) persistidas con AsyncStorage.

## Requisitos

- Node 18+ (probado con Node 22).
- Expo SDK 57.

## Puesta en marcha

```bash
npm install
npm start          # abre Expo (elige iOS / Android / web)
npm run android    # atajo para Android
npm run ios        # atajo para iOS
npm run web        # versión web
```

## Tests

La lógica de dominio y el motor de ejercicios están cubiertos por tests unitarios:

```bash
npm test
```

## Arquitectura

```
src/
  domain/       Modelo musical: notas, afinación EADGBE, mapeo nota<->(cuerda,traste), pentagrama
  data/         Curriculum: definición de niveles progresivos
  engine/       Generación de ejercicios, validación y puntuación (estrellas)
  components/   Fretboard (SVG), Staff (SVG), StarRating, PrimaryButton
  screens/      Home, LevelSelect, Exercise, Results, Stats
  storage/      Persistencia offline (AsyncStorage) + ProgressContext
  navigation/   Tipos de navegación
  theme/        Colores y espaciado
```

## Notas pedagógicas

- La guitarra es un instrumento **transpositor**: se escribe en clave de sol pero suena
  una octava más grave de lo que se lee. Las notas del pentagrama corresponden a la
  altura escrita.
- Cada nivel entrena una **posición concreta** por cuerda. En fase 2 se añadirán las
  posiciones equivalentes de una misma nota.

## Roadmap (fase 2+)

- Posiciones equivalentes de una misma nota.
- Lectura rítmica y compases.
- Detección de audio (afinación por micrófono).
- Modo profesor y sincronización en la nube.

## Créditos

- Icono de clave de sol basado en "g-clef" de Delapouite (game-icons.net), CC BY 3.0.

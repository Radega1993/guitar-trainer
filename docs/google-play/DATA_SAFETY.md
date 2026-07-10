# Data Safety (borrador basado en auditoria tecnica)

## Matriz principal

| Tipo de dato | Recopilado | Compartido | Finalidad | Obligatorio | Eliminable |
| --- | --- | --- | --- | --- | --- |
| Progreso de aprendizaje (local) | No (servidor) / Si (en dispositivo) | No | Continuidad pedagogica | Si (funcional) | Si (reset) |
| Ajustes de usuario (local) | No (servidor) / Si (en dispositivo) | No | Preferencias | No | Parcial (no desde reset actual) |
| Eventos de rendimiento (local SQLite) | No (servidor) / Si (en dispositivo) | No | Estadisticas locales | No | Si (reset) |
| Identificadores personales (email, telefono, etc.) | No | No | N/A | N/A | N/A |
| ID publicitario | No | No | N/A | N/A | N/A |
| Ubicacion | No | No | N/A | N/A | N/A |

## Hechos verificados en codigo

- Sin login/cuenta.
- Sin SDK de anuncios.
- Sin SDK de analitica remota.
- Sin crash reporting externo.
- Persistencia local en AsyncStorage + SQLite.

## Cifrado y transporte

- No hay transporte remoto de datos de usuario en version actual.
- Datos locales: almacenamiento en dispositivo sin capa de cifrado app-level dedicada.

## Borrado de datos

- Disponible `Reiniciar progreso` (borra progreso y analitica local).
- Pendiente opcional: borrar tambien ajustes persistidos para borrado total.

## Declaracion Play esperada para v1

- Data collected: No (en sentido de recopilacion remota por titular/terceros).
- Data shared: No.
- Ads: No.

## Cambio futuro obligatorio

Si se incorporan cuentas, anuncios, analitica o crash reporting, actualizar:

1. Data Safety.
2. Politica de privacidad.
3. Declaracion de anuncios y acceso.

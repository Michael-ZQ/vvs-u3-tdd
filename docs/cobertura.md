# Análisis de cobertura

Herramienta: Vitest con `@vitest/coverage-v8` (`npm run coverage`). Mínimo exigido en `vitest.config.js` y en CI: 90 % en líneas, ramas, funciones y sentencias.

## Resultados

| Momento | Pruebas | Sentencias | Ramas | Funciones | Líneas | Evidencia |
|---|---|---|---|---|---|---|
| Al terminar los 4 ciclos TDD | 28 | 100 % (45/45) | 100 % (22/22) | 100 % (19/19) | 100 % (43/43) | `evidencias/cobertura-1-inicial.txt` |
| Después de la Fase C | 37 | 100 % (50/50) | 100 % (30/30) | 100 % (21/21) | 100 % (48/48) | `evidencias/cobertura-2-final.txt` |

## Ramas sin cobertura

**Ninguna.** Al escribir siempre la prueba antes del código, cada `if` nació para hacer pasar una prueba que ya existía, así que no quedaron ramas sin ejecutar.

## Lo que la cobertura no mostró

Con el 100 % de ramas ya cubierto se probaron entradas inusuales a mano y aparecieron **tres defectos**:

| Caso | Defecto | Por qué la cobertura no lo detectó |
|---|---|---|
| C-27 | `agregarProducto(null)` lanzaba «Cannot destructure property 'id'…», un error interno de JavaScript, no un mensaje claro | La falla ocurría **antes** de la primera línea de la función (en la desestructuración del parámetro): no había una rama que cubrir |
| C-28 | El mismo id con otro precio se aceptaba y conservaba el precio viejo | La rama «id repetido» sí se ejecutaba (C-04), pero solo con datos iguales; la cobertura cuenta líneas, no combinaciones de datos |
| C-29 | `1.005` se redondeaba a `1` | La línea de redondeo se ejecutaba en cada prueba; el error depende del **valor**, no del camino |

## Limitaciones de la cobertura

- Mide qué código se ejecutó, no si el resultado es correcto: una prueba sin `expect` también suma cobertura.
- No mide combinaciones de datos (C-28) ni valores especiales (C-29).
- No detecta lo que falta en el código: si un requisito no tiene `if`, no hay rama que quede en rojo (C-27).

## Mejora priorizada

Agregar **pruebas basadas en propiedades** (por ejemplo, con `fast-check`) para el redondeo y los totales: generan cientos de precios y cantidades al azar y comprueban reglas generales como «el total nunca es negativo» o «el total nunca supera el subtotal». Atacan justo el tipo de defecto que la cobertura no ve (C-28, C-29).

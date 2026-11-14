# Requisitos y casos de prueba

Antes de escribir código, cada requisito se convierte en casos **normales (N)**, **de borde (B)** e **inválidos (I)** con su resultado esperado.
Estos casos guían los ciclos TDD: cada prueba se escribe primero, se ve fallar y luego se implementa.

## Requisitos

| ID | Requisito |
|---|---|
| RF-01 | Agregar productos con ID, nombre, precio y cantidad positiva |
| RF-02 | Calcular subtotal y total |
| RF-03 | Descuento válido de 0 a 100 % sin totales negativos |
| RF-04 | Actualizar cantidades y eliminar productos |
| RF-05 | Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros |

## Decisiones tomadas al escribir los casos

Los requisitos no dicen todo. Estas decisiones salieron al intentar escribir el resultado esperado de una prueba:

| ID | Pregunta que apareció | Decisión |
|---|---|---|
| D-01 | ¿Qué pasa si se agrega dos veces el mismo ID? | Se suman las cantidades; no se duplica la línea. |
| D-02 | ¿«Cantidad positiva» admite 1.5? | No: la cantidad debe ser un **entero** mayor que 0. |
| D-03 | ¿Un precio 0 es válido? | Sí (producto de regalo). Solo se rechazan precios negativos. |
| D-04 | ¿Cuántos decimales tiene el resultado? | Subtotal y total se redondean a 2 decimales. |
| D-05 | ¿Qué es un «error claro»? | Tipo de error según la causa (`TypeError` tipo de dato, `RangeError` fuera de rango, `Error` producto inexistente) y un mensaje en español que dice qué dato falló y qué valor llegó. |
| D-06 | (Fase C) ¿Qué pasa si llega el mismo id con otro precio o nombre? | Se rechaza con `Error`: son datos inconsistentes y no se debe adivinar cuál vale. |
| D-07 | (Fase C) ¿Cómo se redondea medio centavo (1.005)? | Hacia arriba (1.01), corrigiendo el error de coma flotante con `Number.EPSILON`. |

## Casos

| ID | RF | Tipo | Entrada / acción | Resultado esperado |
|---|---|---|---|---|
| C-01 | RF-01 | N | Agregar `{ id: "P1", nombre: "Teclado", precio: 25.5, cantidad: 2 }` | El carrito lista 1 producto con esos datos |
| C-02 | RF-01 | B | Agregar con `cantidad: 1` | Se acepta |
| C-03 | RF-01 | B | Agregar con `precio: 0` | Se acepta (D-03) |
| C-04 | RF-01 | B | Agregar `P1` dos veces (2 + 3 unidades) | Una sola línea con cantidad 5 (D-01) |
| C-05 | RF-01 | I | `id: ""` | `TypeError` «El id debe ser un texto no vacío» |
| C-06 | RF-01 | I | `nombre: "   "` | `TypeError` «El nombre debe ser un texto no vacío» |
| C-07 | RF-02 | N | P1 (25.5 × 2) + P2 (10 × 3) | Subtotal `81` |
| C-08 | RF-02 | B | Carrito vacío | Subtotal `0` y total `0` |
| C-09 | RF-02 | B | 0.1 × 3 | Subtotal `0.3` (no `0.30000000000000004`) |
| C-10 | RF-02 | N | Sin descuento aplicado | Total igual al subtotal |
| C-11 | RF-03 | N | Subtotal 81, descuento 10 % | Total `72.9` |
| C-12 | RF-03 | B | Descuento 0 % | Total `81` |
| C-13 | RF-03 | B | Descuento 100 % | Total `0` (nunca negativo) |
| C-14 | RF-03 | I | Descuento `100.01` | `RangeError` «El descuento debe estar entre 0 y 100» |
| C-15 | RF-03 | I | Descuento `-1` | `RangeError` |
| C-16 | RF-03 | I | Descuento `"10"` | `TypeError` |
| C-17 | RF-04 | N | Actualizar P1 a cantidad 5 | Subtotal recalculado |
| C-18 | RF-04 | N | Eliminar P1 | P1 ya no aparece en la lista |
| C-19 | RF-04 | I | Actualizar un ID que no existe | `Error` «No existe el producto con id X» |
| C-20 | RF-04 | I | Actualizar P1 a cantidad 0 | `RangeError` |
| C-21 | RF-04 | I | Eliminar un ID que no existe | `Error` |
| C-22 | RF-05 | I | `precio: -1` | `RangeError` «El precio no puede ser negativo (recibido: -1)» |
| C-23 | RF-05 | I | `cantidad: 0` | `RangeError` |
| C-24 | RF-05 | I | `cantidad: 1.5` | `RangeError` (D-02) |
| C-25 | RF-05 | I | `cantidad: "2"` | `TypeError` |
| C-26 | RF-05 | I | `precio: NaN` | `TypeError` |

| C-27 | RF-05 | I | `agregarProducto(null)` o sin argumento | `TypeError` «El producto debe ser un objeto…» (Fase C) |
| C-28 | RF-01 | I | Mismo id con otro precio | `Error` y el carrito no cambia (D-06, Fase C) |
| C-29 | RF-02 | B | Precio 1.005 × 1 | Subtotal `1.01` (D-07, Fase C) |
| C-30 | RF-05 | I | id numérico, precio `Infinity`, cantidad `-3` | `TypeError` / `TypeError` / `RangeError` (Fase C) |
| C-31 | RF-03 | I | Descuento `NaN` | `TypeError` (Fase C) |
| C-32 | RF-04 | I | Actualizar con cantidad `"3"` | `TypeError` (Fase C) |
| C-33 | RF-01 | B | Modificar el objeto original o la lista devuelta | El carrito no cambia (Fase C) |

**Resumen:** 33 casos · 6 normales · 9 de borde · 18 inválidos. Los casos C-27 a C-33 se agregaron en la Fase C, después de llegar al 100 % de cobertura.

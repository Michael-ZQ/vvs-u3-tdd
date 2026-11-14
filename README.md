# VVS · Unidad 3 — Desarrollo dirigido por pruebas (TDD)

Carrito de compras en JavaScript desarrollado con TDD (ciclo rojo–verde–refactor), Vitest y GitHub Actions.

> Asignatura: Verificación y Validación de Software · Universidad Politécnica Salesiana
> Estudiante: Michael Zaquinaula · Actividad individual

![CI](https://github.com/Michael-ZQ/vvs-u3-tdd/actions/workflows/ci.yml/badge.svg)

## Requisitos

| ID | Requisito |
|---|---|
| RF-01 | Agregar productos con ID, nombre, precio y cantidad positiva |
| RF-02 | Calcular subtotal y total |
| RF-03 | Descuento válido de 0 a 100 % sin totales negativos |
| RF-04 | Actualizar cantidades y eliminar productos |
| RF-05 | Rechazar precios negativos, cantidades inválidas y descuentos fuera de rango con errores claros |

Casos de prueba y decisiones de diseño: [`docs/casos.md`](docs/casos.md).

## Instalación y uso desde cero

Requisitos: Node.js 20 o superior y npm.

```bash
git clone https://github.com/Michael-ZQ/vvs-u3-tdd.git
cd vvs-u3-tdd
npm ci
npm test            # 37 pruebas
npm run coverage    # cobertura (falla si baja del 90 %)
```

Ejemplo:

```js
import { Carrito } from "./src/carrito.js";

const carrito = new Carrito();
carrito.agregarProducto({ id: "P1", nombre: "Teclado", precio: 25.5, cantidad: 2 });
carrito.agregarProducto({ id: "P2", nombre: "Mouse", precio: 10, cantidad: 3 });
carrito.aplicarDescuento(10);
carrito.subtotal(); // 81
carrito.total();    // 72.9
```

## Estructura

```
src/carrito.js        Clase Carrito (agregar, listar, actualizar, eliminar, descuento, subtotal, total)
src/validaciones.js   Validaciones con errores claros (TypeError / RangeError)
src/dinero.js         Redondeo a 2 decimales y aplicación de porcentajes
tests/carrito.test.js 37 pruebas Vitest (normales, de borde e inválidas)
docs/casos.md         Requisitos → 33 casos y decisiones D-01..D-07
docs/cobertura.md     Análisis de cobertura y sus límites
evidencias/           Salida de Vitest en cada fase RED / GREEN / REFACTOR
.github/workflows/ci.yml  Pruebas y cobertura en push y pull request (Node 20 y 22)
```

## Ciclos TDD (historial de commits)

| Ciclo | Requisito | RED | GREEN | REFACTOR |
|---|---|---|---|---|
| 1 | RF-01, RF-02 | 2 pruebas fallan (no existe el módulo) | Arreglo + bucle | Map por id, copias, `reduce` |
| 2 | RF-01, RF-05 | 9 de 13 fallan | Validaciones con `if` | Módulo `validaciones.js` |
| 3 | RF-02, RF-03 | 10 de 23 fallan | Descuento y total | Módulo `dinero.js` |
| 4 | RF-04 | 5 de 28 fallan | Actualizar y eliminar | Método `#exigirLinea` |
| Fase C | RF-01, RF-02, RF-05 | 3 de 37 fallan con 100 % de cobertura | Producto nulo, id en conflicto, redondeo | `sumarCantidad` y `#todas` |

Cada fase tiene su commit (`test(red)`, `feat(green)`, `refactor`) y su archivo en `evidencias/`.

## Integración continua

`.github/workflows/ci.yml` se ejecuta en cada `push` y en cada `pull_request` hacia `main`, en Node 20 y 22: instala con `npm ci`, ejecuta `npm test` y `npm run coverage`, y guarda el reporte de cobertura como artefacto.

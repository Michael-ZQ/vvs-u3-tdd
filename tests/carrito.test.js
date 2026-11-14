import { describe, test, expect, beforeEach } from "vitest";
import { Carrito } from "../src/carrito.js";

// Cada prueba lleva el ID del caso en docs/casos.md.

const teclado = { id: "P1", nombre: "Teclado", precio: 25.5, cantidad: 2 };
const mouse = { id: "P2", nombre: "Mouse", precio: 10, cantidad: 3 };

let carrito;
beforeEach(() => {
  carrito = new Carrito();
});

describe("RF-01 agregar productos", () => {
  test("C-01 agrega un producto y lo lista con sus datos", () => {
    carrito.agregarProducto(teclado);
    expect(carrito.listarProductos()).toEqual([teclado]);
  });

  test("C-02 borde: acepta cantidad 1", () => {
    carrito.agregarProducto({ ...teclado, cantidad: 1 });
    expect(carrito.listarProductos()[0].cantidad).toBe(1);
  });

  test("C-03 borde: acepta precio 0 (producto de regalo)", () => {
    carrito.agregarProducto({ ...teclado, precio: 0 });
    expect(carrito.subtotal()).toBe(0);
  });

  test("C-04 borde: el mismo id dos veces suma cantidades en una sola línea", () => {
    carrito.agregarProducto({ ...teclado, cantidad: 2 });
    carrito.agregarProducto({ ...teclado, cantidad: 3 });
    expect(carrito.listarProductos()).toEqual([{ ...teclado, cantidad: 5 }]);
  });

  test("C-05 inválido: id vacío lanza TypeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, id: "" })).toThrow(TypeError);
    expect(() => carrito.agregarProducto({ ...teclado, id: "" })).toThrow("El id debe ser un texto no vacío");
  });

  test("C-06 inválido: nombre en blanco lanza TypeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, nombre: "   " })).toThrow(
      new TypeError("El nombre debe ser un texto no vacío"),
    );
  });
});

describe("RF-05 rechazar datos inválidos con errores claros", () => {
  test("C-22 precio negativo lanza RangeError con el valor recibido", () => {
    expect(() => carrito.agregarProducto({ ...teclado, precio: -1 })).toThrow(
      new RangeError("El precio no puede ser negativo (recibido: -1)"),
    );
  });

  test("C-23 cantidad 0 lanza RangeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, cantidad: 0 })).toThrow(RangeError);
  });

  test("C-24 cantidad decimal 1.5 lanza RangeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, cantidad: 1.5 })).toThrow(
      new RangeError("La cantidad debe ser un entero mayor que 0 (recibido: 1.5)"),
    );
  });

  test("C-25 cantidad como texto lanza TypeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, cantidad: "2" })).toThrow(TypeError);
  });

  test("C-26 precio NaN lanza TypeError", () => {
    expect(() => carrito.agregarProducto({ ...teclado, precio: NaN })).toThrow(
      new TypeError("El precio debe ser un número finito"),
    );
  });

  test("un dato inválido no deja el carrito a medias", () => {
    expect(() => carrito.agregarProducto({ ...teclado, precio: -1 })).toThrow();
    expect(carrito.listarProductos()).toEqual([]);
  });
});

describe("RF-02 subtotal y total", () => {
  test("C-07 subtotal de dos productos: 25.5 x 2 + 10 x 3 = 81", () => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
    expect(carrito.subtotal()).toBe(81);
  });
});

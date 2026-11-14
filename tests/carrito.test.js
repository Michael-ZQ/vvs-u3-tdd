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
});

describe("RF-02 subtotal y total", () => {
  test("C-07 subtotal de dos productos: 25.5 x 2 + 10 x 3 = 81", () => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
    expect(carrito.subtotal()).toBe(81);
  });
});

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

describe("RF-04 actualizar cantidades y eliminar productos", () => {
  beforeEach(() => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
  });

  test("C-17 actualizar la cantidad recalcula el subtotal: 25.5 x 5 + 10 x 3 = 157.5", () => {
    carrito.actualizarCantidad("P1", 5);
    expect(carrito.subtotal()).toBe(157.5);
  });

  test("C-18 eliminar un producto lo quita de la lista", () => {
    carrito.eliminarProducto("P1");
    expect(carrito.listarProductos()).toEqual([mouse]);
    expect(carrito.subtotal()).toBe(30);
  });

  test("C-19 actualizar un id que no existe lanza Error", () => {
    expect(() => carrito.actualizarCantidad("X9", 2)).toThrow(new Error("No existe el producto con id X9"));
  });

  test("C-20 actualizar a cantidad 0 lanza RangeError y no cambia la cantidad", () => {
    expect(() => carrito.actualizarCantidad("P1", 0)).toThrow(RangeError);
    expect(carrito.listarProductos()[0].cantidad).toBe(2);
  });

  test("C-21 eliminar un id que no existe lanza Error", () => {
    expect(() => carrito.eliminarProducto("X9")).toThrow(new Error("No existe el producto con id X9"));
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

// Fase C: casos negativos adicionales, buscados después de llegar al 100 % de cobertura.
describe("Fase C: casos negativos adicionales", () => {
  test("C-27 agregar null o sin argumento lanza un TypeError claro", () => {
    const esperado = new TypeError("El producto debe ser un objeto con id, nombre, precio y cantidad");
    expect(() => carrito.agregarProducto(null)).toThrow(esperado);
    expect(() => carrito.agregarProducto()).toThrow(esperado);
  });

  test("C-28 el mismo id con otro precio o nombre se rechaza", () => {
    carrito.agregarProducto(teclado);
    expect(() => carrito.agregarProducto({ ...teclado, precio: 99 })).toThrow(
      new Error("El producto P1 ya está en el carrito con otro nombre o precio"),
    );
    expect(carrito.listarProductos()).toEqual([teclado]);
  });

  test("C-29 redondea medio centavo hacia arriba: 1.005 -> 1.01", () => {
    carrito.agregarProducto({ id: "P4", nombre: "Chicle", precio: 1.005, cantidad: 1 });
    expect(carrito.subtotal()).toBe(1.01);
  });

  test.each([
    ["id numérico", { ...teclado, id: 123 }, TypeError],
    ["precio Infinity", { ...teclado, precio: Infinity }, TypeError],
    ["cantidad negativa", { ...teclado, cantidad: -3 }, RangeError],
  ])("C-30 %s se rechaza", (_nombre, producto, tipo) => {
    expect(() => carrito.agregarProducto(producto)).toThrow(tipo);
  });

  test("C-31 descuento NaN lanza TypeError", () => {
    expect(() => carrito.aplicarDescuento(NaN)).toThrow(new TypeError("El descuento debe ser un número finito"));
  });

  test("C-32 actualizar con cantidad como texto lanza TypeError", () => {
    carrito.agregarProducto(teclado);
    expect(() => carrito.actualizarCantidad("P1", "3")).toThrow(TypeError);
  });

  test("C-33 modificar la lista devuelta o el objeto original no cambia el carrito", () => {
    const original = { ...teclado };
    carrito.agregarProducto(original);
    original.precio = 0;
    carrito.listarProductos()[0].cantidad = 100;
    expect(carrito.subtotal()).toBe(51);
  });
});

describe("RF-02 subtotal y total", () => {
  test("C-07 subtotal de dos productos: 25.5 x 2 + 10 x 3 = 81", () => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
    expect(carrito.subtotal()).toBe(81);
  });

  test("C-08 borde: carrito vacío tiene subtotal y total 0", () => {
    expect(carrito.subtotal()).toBe(0);
    expect(carrito.total()).toBe(0);
  });

  test("C-09 borde: redondea a 2 decimales (0.1 x 3 = 0.3)", () => {
    carrito.agregarProducto({ id: "P3", nombre: "Caramelo", precio: 0.1, cantidad: 3 });
    expect(carrito.subtotal()).toBe(0.3);
  });

  test("C-10 sin descuento el total es igual al subtotal", () => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
    expect(carrito.total()).toBe(81);
  });
});

describe("RF-03 descuento de 0 a 100 % sin totales negativos", () => {
  beforeEach(() => {
    carrito.agregarProducto(teclado);
    carrito.agregarProducto(mouse);
  });

  test("C-11 descuento de 10 %: 81 - 10 % = 72.9", () => {
    carrito.aplicarDescuento(10);
    expect(carrito.total()).toBe(72.9);
  });

  test("C-12 borde: descuento 0 % deja el total igual", () => {
    carrito.aplicarDescuento(0);
    expect(carrito.total()).toBe(81);
  });

  test("C-13 borde: descuento 100 % da total 0, nunca negativo", () => {
    carrito.aplicarDescuento(100);
    expect(carrito.total()).toBe(0);
  });

  test("C-14 inválido: descuento 100.01 lanza RangeError", () => {
    expect(() => carrito.aplicarDescuento(100.01)).toThrow(
      new RangeError("El descuento debe estar entre 0 y 100 (recibido: 100.01)"),
    );
  });

  test("C-15 inválido: descuento -1 lanza RangeError", () => {
    expect(() => carrito.aplicarDescuento(-1)).toThrow(RangeError);
  });

  // Se valida también el mensaje: solo con TypeError la prueba pasaba aunque
  // aplicarDescuento no existiera ("is not a function" también es TypeError).
  test("C-16 inválido: descuento como texto lanza TypeError", () => {
    expect(() => carrito.aplicarDescuento("10")).toThrow(
      new TypeError("El descuento debe ser un número finito"),
    );
  });

  test("un descuento inválido no cambia el descuento anterior", () => {
    carrito.aplicarDescuento(10);
    expect(() => carrito.aplicarDescuento(150)).toThrow();
    expect(carrito.total()).toBe(72.9);
  });
});

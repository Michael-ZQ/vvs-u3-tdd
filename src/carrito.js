import { validarProducto } from "./validaciones.js";

export class Carrito {
  // Map indexado por id: buscar, actualizar o eliminar una línea no recorre todo el carrito.
  #lineas = new Map();

  agregarProducto(producto) {
    validarProducto(producto);

    const existente = this.#lineas.get(producto.id);
    if (existente) {
      existente.cantidad += producto.cantidad;
      return;
    }
    this.#lineas.set(producto.id, { ...producto });
  }

  // Devuelve copias para que nadie modifique el carrito desde afuera.
  listarProductos() {
    return [...this.#lineas.values()].map((linea) => ({ ...linea }));
  }

  subtotal() {
    return [...this.#lineas.values()].reduce((suma, linea) => suma + importe(linea), 0);
  }
}

function importe({ precio, cantidad }) {
  return precio * cantidad;
}

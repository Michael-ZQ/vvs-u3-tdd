import { validarProducto, validarDescuento, validarCantidad } from "./validaciones.js";
import { redondear2, aplicarPorcentaje } from "./dinero.js";

export class Carrito {
  // Map indexado por id: buscar, actualizar o eliminar una línea no recorre todo el carrito.
  #lineas = new Map();
  #descuento = 0;

  agregarProducto(producto) {
    validarProducto(producto);

    const existente = this.#lineas.get(producto.id);
    if (existente) {
      if (existente.nombre !== producto.nombre || existente.precio !== producto.precio) {
        throw new Error(`El producto ${producto.id} ya está en el carrito con otro nombre o precio`);
      }
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
    const suma = [...this.#lineas.values()].reduce((acc, linea) => acc + importe(linea), 0);
    return redondear2(suma);
  }

  actualizarCantidad(id, cantidad) {
    const linea = this.#exigirLinea(id);
    validarCantidad(cantidad);
    linea.cantidad = cantidad;
  }

  eliminarProducto(id) {
    this.#exigirLinea(id);
    this.#lineas.delete(id);
  }

  // Devuelve la línea del producto o lanza un error claro si no existe.
  #exigirLinea(id) {
    const linea = this.#lineas.get(id);
    if (!linea) {
      throw new Error(`No existe el producto con id ${id}`);
    }
    return linea;
  }

  aplicarDescuento(porcentaje) {
    validarDescuento(porcentaje);
    this.#descuento = porcentaje;
  }

  // El descuento ya está validado entre 0 y 100, así que el total no puede ser negativo;
  // Math.max queda como protección explícita de RF-03.
  total() {
    return Math.max(0, redondear2(aplicarPorcentaje(this.subtotal(), this.#descuento)));
  }
}

function importe({ precio, cantidad }) {
  return precio * cantidad;
}

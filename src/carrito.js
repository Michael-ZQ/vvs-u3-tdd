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
      sumarCantidad(existente, producto);
    } else {
      this.#lineas.set(producto.id, { ...producto });
    }
  }

  // Devuelve copias para que nadie modifique el carrito desde afuera.
  listarProductos() {
    return this.#todas().map((linea) => ({ ...linea }));
  }

  subtotal() {
    return redondear2(this.#todas().reduce((acc, linea) => acc + importe(linea), 0));
  }

  #todas() {
    return [...this.#lineas.values()];
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

// Un id repetido solo suma cantidad si es el mismo producto (D-01, D-06).
function sumarCantidad(existente, nuevo) {
  if (existente.nombre !== nuevo.nombre || existente.precio !== nuevo.precio) {
    throw new Error(`El producto ${nuevo.id} ya está en el carrito con otro nombre o precio`);
  }
  existente.cantidad += nuevo.cantidad;
}

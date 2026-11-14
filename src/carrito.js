import { validarProducto, validarNumero } from "./validaciones.js";

export class Carrito {
  // Map indexado por id: buscar, actualizar o eliminar una línea no recorre todo el carrito.
  #lineas = new Map();
  #descuento = 0;

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
    const suma = [...this.#lineas.values()].reduce((acc, linea) => acc + importe(linea), 0);
    return Math.round(suma * 100) / 100;
  }

  aplicarDescuento(porcentaje) {
    validarNumero(porcentaje, "El descuento");
    if (porcentaje < 0 || porcentaje > 100) {
      throw new RangeError(`El descuento debe estar entre 0 y 100 (recibido: ${porcentaje})`);
    }
    this.#descuento = porcentaje;
  }

  total() {
    const total = this.subtotal() - (this.subtotal() * this.#descuento) / 100;
    return Math.max(0, Math.round(total * 100) / 100);
  }
}

function importe({ precio, cantidad }) {
  return precio * cantidad;
}

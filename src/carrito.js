export class Carrito {
  // Map indexado por id: buscar, actualizar o eliminar una línea no recorre todo el carrito.
  #lineas = new Map();

  agregarProducto(producto) {
    if (typeof producto.id !== "string" || producto.id.trim() === "") {
      throw new TypeError("El id debe ser un texto no vacío");
    }
    if (typeof producto.nombre !== "string" || producto.nombre.trim() === "") {
      throw new TypeError("El nombre debe ser un texto no vacío");
    }
    if (typeof producto.precio !== "number" || !Number.isFinite(producto.precio)) {
      throw new TypeError("El precio debe ser un número finito");
    }
    if (producto.precio < 0) {
      throw new RangeError(`El precio no puede ser negativo (recibido: ${producto.precio})`);
    }
    if (typeof producto.cantidad !== "number" || !Number.isFinite(producto.cantidad)) {
      throw new TypeError("La cantidad debe ser un número finito");
    }
    if (!Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
      throw new RangeError(`La cantidad debe ser un entero mayor que 0 (recibido: ${producto.cantidad})`);
    }

    const existente = this.#lineas.get(producto.id);
    if (existente) {
      existente.cantidad = existente.cantidad + producto.cantidad;
    } else {
      this.#lineas.set(producto.id, { ...producto });
    }
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

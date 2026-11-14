export class Carrito {
  constructor() {
    this.productos = [];
  }

  agregarProducto(producto) {
    this.productos.push(producto);
  }

  listarProductos() {
    return this.productos;
  }

  subtotal() {
    let suma = 0;
    for (const p of this.productos) {
      suma = suma + p.precio * p.cantidad;
    }
    return suma;
  }
}

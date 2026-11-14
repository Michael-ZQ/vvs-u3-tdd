// Validaciones reutilizables. Cada una lanza un error claro:
// TypeError si el tipo de dato es incorrecto, RangeError si el valor está fuera de rango.

export function validarTexto(valor, campo) {
  if (typeof valor !== "string" || valor.trim() === "") {
    throw new TypeError(`${campo} debe ser un texto no vacío`);
  }
}

export function validarNumero(valor, campo) {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new TypeError(`${campo} debe ser un número finito`);
  }
}

export function validarPrecio(precio) {
  validarNumero(precio, "El precio");
  if (precio < 0) {
    throw new RangeError(`El precio no puede ser negativo (recibido: ${precio})`);
  }
}

export function validarCantidad(cantidad) {
  validarNumero(cantidad, "La cantidad");
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError(`La cantidad debe ser un entero mayor que 0 (recibido: ${cantidad})`);
  }
}

export function validarDescuento(porcentaje) {
  validarNumero(porcentaje, "El descuento");
  if (porcentaje < 0 || porcentaje > 100) {
    throw new RangeError(`El descuento debe estar entre 0 y 100 (recibido: ${porcentaje})`);
  }
}

export function validarProducto(producto) {
  if (typeof producto !== "object" || producto === null) {
    throw new TypeError("El producto debe ser un objeto con id, nombre, precio y cantidad");
  }
  const { id, nombre, precio, cantidad } = producto;
  validarTexto(id, "El id");
  validarTexto(nombre, "El nombre");
  validarPrecio(precio);
  validarCantidad(cantidad);
}

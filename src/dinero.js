// Operaciones con montos de dinero.

export function redondear2(valor) {
  return Math.round(valor * 100) / 100;
}

export function aplicarPorcentaje(monto, porcentaje) {
  return monto - (monto * porcentaje) / 100;
}

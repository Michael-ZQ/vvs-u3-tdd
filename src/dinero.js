// Operaciones con montos de dinero.

// Number.EPSILON corrige casos como 1.005, que en binario vale 1.00499999…
export function redondear2(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function aplicarPorcentaje(monto, porcentaje) {
  return monto - (monto * porcentaje) / 100;
}

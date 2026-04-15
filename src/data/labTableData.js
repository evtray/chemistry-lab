// Tabla densidad etanol-agua a 20°C (Perry's Chemical Engineers' Handbook)
// GE = ρ/ρ_agua. ρ_agua(20°C) ≈ 0.99823 kg/L
// Nota: La práctica usa 15,56°C; los valores son de referencia. A 15,56°C las densidades son ligeramente mayores.
const RHO_AGUA_20 = 0.99823

// % v/v etanol → densidad (kg/L) - muestreado de tabla Perry
const DENSITY_TABLE = [
  [0, 0.99823], [5, 0.99106], [10, 0.98476], [15, 0.97897], [20, 0.97359],
  [25, 0.96812], [30, 0.96224], [35, 0.95563], [40, 0.94805], [45, 0.93957],
  [50, 0.93017], [55, 0.91999], [60, 0.90916], [65, 0.89767], [70, 0.88559],
  [75, 0.87282], [80, 0.85929], [85, 0.84489], [90, 0.82925], [95, 0.81145],
  [100, 0.78934]
]

export const alcoholimetricTable = DENSITY_TABLE.map(([pct, rho]) => ({
  pctEthanol: pct,
  density: rho,
  ge: Number((rho / RHO_AGUA_20).toFixed(4))
}))

export function geToPercentEthanol(ge) {
  if (!Number.isFinite(ge) || ge <= 0) return null
  const table = alcoholimetricTable
  if (ge >= table[0].ge) return 0
  if (ge <= table[table.length - 1].ge) return 100
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i]
    const b = table[i + 1]
    if (ge <= a.ge && ge >= b.ge) {
      const t = (a.ge - ge) / (a.ge - b.ge)
      return Number((a.pctEthanol + t * (b.pctEthanol - a.pctEthanol)).toFixed(1))
    }
  }
  return null
}

export function percentEthanolToGe(pct) {
  if (!Number.isFinite(pct) || pct < 0 || pct > 100) return null
  const table = alcoholimetricTable
  if (pct <= 0) return table[0].ge
  if (pct >= 100) return table[table.length - 1].ge
  const i = Math.floor(pct / 5)
  const j = Math.min(i + 1, table.length - 1)
  const a = table[i]
  const b = table[j]
  const t = (pct - a.pctEthanol) / (b.pctEthanol - a.pctEthanol)
  return Number((a.ge + t * (b.ge - a.ge)).toFixed(4))
}

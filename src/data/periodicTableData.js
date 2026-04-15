// Datos de la tabla periódica (Bowserinator/Periodic-Table-JSON)
// Carga y transforma el JSON para uso en la app

let elementsCache = null

const CATEGORY_LABELS = {
  'alkali metal': 'Metal alcalino',
  'alkaline earth metal': 'Metal alcalinotérreo',
  'transition metal': 'Metal de transición',
  'post-transition metal': 'Metal del bloque p',
  'metalloid': 'Metaloide',
  'diatomic nonmetal': 'No metal diatómico',
  'polyatomic nonmetal': 'No metal poliatómico',
  'noble gas': 'Gas noble',
  'lanthanide': 'Lantánido',
  'actinide': 'Actínido',
  'unknown, probably transition metal': 'Desconocido (prob. metal transición)',
  'unknown, probably post-transition metal': 'Desconocido (prob. metal del bloque p)',
  'unknown, probably metalloid': 'Desconocido (prob. metaloide)',
  'unknown, predicted to be noble gas': 'Desconocido (prob. gas noble)',
  'unknown': 'Desconocido'
}

const CATEGORY_COLORS = {
  'alkali metal': '#f87171',
  'alkaline earth metal': '#fb923c',
  'transition metal': '#fbbf24',
  'post-transition metal': '#a3e635',
  'metalloid': '#34d399',
  'diatomic nonmetal': '#22d3ee',
  'polyatomic nonmetal': '#60a5fa',
  'noble gas': '#a78bfa',
  'lanthanide': '#f472b6',
  'actinide': '#e879f9',
  'unknown, probably transition metal': '#9ca3af',
  'unknown, probably post-transition metal': '#9ca3af',
  'unknown, probably metalloid': '#9ca3af',
  'unknown, predicted to be noble gas': '#9ca3af',
  'unknown': '#9ca3af'
}

const PHASE_LABELS = {
  'Gas': 'Gas',
  'Liquid': 'Líquido',
  'Solid': 'Sólido'
}

export { CATEGORY_COLORS, PHASE_LABELS }

export async function loadPeriodicTable() {
  if (elementsCache) return elementsCache
  const res = await fetch('/periodic-table.json')
  const { elements } = await res.json()
  elementsCache = elements.map((el) => ({
    z: el.number,
    symbol: el.symbol,
    name: el.name,
    nameEs: el.name,
    mass: el.atomic_mass != null ? Number(el.atomic_mass) : null,
    category: el.category || 'unknown',
    categoryEs: CATEGORY_LABELS[el.category] || el.category,
    categoryColor: CATEGORY_COLORS[el.category] || '#9ca3af',
    period: el.period,
    group: el.group,
    block: el.block || '',
    phase: el.phase,
    phaseEs: PHASE_LABELS[el.phase] || el.phase,
    x: el.xpos,
    y: el.ypos,
    wx: el.wxpos,
    wy: el.wypos,
    color: el['cpk-hex'] || '#cccccc',
    electronConfig: el.electron_configuration || '',
    electronConfigSemantic: el.electron_configuration_semantic || '',
    electronegativity: el.electronegativity_pauling,
    melt: el.melt,
    boil: el.boil,
    density: el.density,
    molarHeat: el.molar_heat,
    shells: el.shells || [],
    appearance: el.appearance,
    discoveredBy: el.discovered_by,
    namedBy: el.named_by,
    summary: el.summary,
    source: el.source,
    electronAffinity: el.electron_affinity,
    ionizationEnergies: el.ionization_energies || [],
    bohrModelImage: el.bohr_model_image,
    spectralImg: el.spectral_img,
    image: el.image
  }))
  return elementsCache
}

export function getMainTableElements(elements) {
  return elements.filter((el) => el.y <= 7 && el.wy <= 7)
}

export function getLanthanides(elements) {
  return elements.filter((el) => el.z >= 57 && el.z <= 71)
}

export function getActinides(elements) {
  return elements.filter((el) => el.z >= 89 && el.z <= 103)
}

// Determina la fase a una temperatura dada (en K)
export function getPhaseAtTemp(el, tempK) {
  if (el.melt == null && el.boil == null) return null
  if (el.melt != null && tempK < el.melt) return 'Sólido'
  if (el.boil != null && tempK > el.boil) return 'Gas'
  if (el.melt != null && el.boil != null && tempK >= el.melt && tempK <= el.boil) return 'Líquido'
  if (el.melt != null && el.boil == null && tempK >= el.melt) return 'Líquido/Gas'
  if (el.melt == null && el.boil != null && tempK <= el.boil) return 'Sólido/Líquido'
  return null
}

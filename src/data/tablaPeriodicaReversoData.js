// Información típica del reverso de la tabla periódica

export const particulasSubatomicas = {
  headers: ['Propiedad', 'Neutrón', 'Protón', 'Electrón'],
  rows: [
    { prop: 'Símbolo', n: 'n⁰', p: 'p⁺', e: 'e⁻' },
    { prop: 'Masa en reposo (kg)', n: '1.6749×10⁻²⁷', p: '1.6726×10⁻²⁷', e: '9.109×10⁻³¹' },
    { prop: 'Masa atómica relativa (¹²C=1)', n: '1.008665', p: '1.007276', e: '0.000549' },
    { prop: 'Carga (C)', n: '0', p: '+1.602×10⁻¹⁹', e: '−1.602×10⁻¹⁹' },
    { prop: 'Radio (m)', n: '~8×10⁻¹⁶', p: '~8×10⁻¹⁶', e: '< 10⁻¹⁸' },
    { prop: 'Spin', n: '½', p: '½', e: '½' },
    { prop: 'Momento magnético (µN)', n: '−1.913', p: '+2.793', e: '—' }
  ]
}

export const caracterIonico = [
  { deltaEN: '0.0', pct: '0% (covalente puro)' },
  { deltaEN: '0.1', pct: '0.5%' },
  { deltaEN: '0.2', pct: '1%' },
  { deltaEN: '0.3', pct: '2.5%' },
  { deltaEN: '0.4', pct: '4%' },
  { deltaEN: '0.5', pct: '6%' },
  { deltaEN: '0.6', pct: '9%' },
  { deltaEN: '0.7', pct: '12%' },
  { deltaEN: '0.8', pct: '15%' },
  { deltaEN: '0.9', pct: '19%' },
  { deltaEN: '1.0', pct: '22%' },
  { deltaEN: '1.2', pct: '30%' },
  { deltaEN: '1.4', pct: '39%' },
  { deltaEN: '1.6', pct: '47%' },
  { deltaEN: '1.8', pct: '55%' },
  { deltaEN: '2.0', pct: '63%' },
  { deltaEN: '2.2', pct: '70%' },
  { deltaEN: '2.4', pct: '76%' },
  { deltaEN: '2.6', pct: '82%' },
  { deltaEN: '2.8', pct: '86%' },
  { deltaEN: '3.0', pct: '89%' },
  { deltaEN: '3.2', pct: '92%' },
  { deltaEN: '≥3.3', pct: '≥95% (iónico)' }
]

export const leyendaElementos = [
  { prop: 'Radio covalente', unidad: 'Å', desc: 'Mitad de la distancia entre núcleos en enlace covalente' },
  { prop: 'Radio atómico', unidad: 'Å', desc: 'Radio del átomo en estado metálico o covalente' },
  { prop: 'Volumen atómico', unidad: 'cm³/mol', desc: 'Volumen molar del elemento sólido' },
  { prop: 'Potencial de 1ª ionización', unidad: 'V', desc: 'Energía para arrancar el primer electrón (eV → V)' },
  { prop: 'Capacidad específica de calor', unidad: 'J·g⁻¹·K⁻¹', desc: 'Calor para elevar 1 g en 1 K' },
  { prop: 'Electronegatividad (Pauling)', unidad: '—', desc: 'Escala 0–4; F=3.98, Cs=0.79' },
  { prop: 'Calor de vaporización', unidad: 'kJ/mol', desc: 'Energía para vaporizar 1 mol' },
  { prop: 'Calor de fusión', unidad: 'kJ/mol', desc: 'Energía para fundir 1 mol' },
  { prop: 'Conductividad térmica', unidad: 'W·m⁻¹·K⁻¹', desc: 'Transmisión de calor' },
  { prop: 'Conductividad eléctrica', unidad: '10⁶ Ω⁻¹·m⁻¹', desc: 'Capacidad de conducir corriente' },
  { prop: 'Estructura cristalina', unidad: '—', desc: 'Cúbico, hexagonal, etc. (color: ácido-base del óxido)' }
]

export const reglasSolubilidad = [
  { regla: 'Nitratos (NO₃⁻), acetatos (CH₃COO⁻), cloratos (ClO₃⁻), percloratos (ClO₄⁻)', resultado: 'Siempre solubles' },
  { regla: 'Sales de Li⁺, Na⁺, K⁺, Rb⁺, Cs⁺, NH₄⁺', resultado: 'Siempre solubles' },
  { regla: 'Cloruros (Cl⁻), bromuros (Br⁻), yoduros (I⁻)', resultado: 'Solubles, excepto con Ag⁺, Pb²⁺, Hg₂²⁺' },
  { regla: 'Sulfatos (SO₄²⁻)', resultado: 'Solubles, excepto Ca²⁺, Sr²⁺, Ba²⁺, Pb²⁺' },
  { regla: 'Hidróxidos (OH⁻)', resultado: 'Insolubles, excepto alcalinos y NH₄⁺ (Ba²⁺, Sr²⁺ ligeramente)' },
  { regla: 'Sulfuros (S²⁻), carbonatos (CO₃²⁻), fosfatos (PO₄³⁻), cromatos (CrO₄²⁻)', resultado: 'Insolubles, excepto con alcalinos y NH₄⁺' }
]

export const ionesPoliatomicos = [
  { nombre: 'Amonio', formula: 'NH₄⁺', carga: '+1' },
  { nombre: 'Hidronio', formula: 'H₃O⁺', carga: '+1' },
  { nombre: 'Hidróxido', formula: 'OH⁻', carga: '−1' },
  { nombre: 'Nitrato', formula: 'NO₃⁻', carga: '−1' },
  { nombre: 'Nitrito', formula: 'NO₂⁻', carga: '−1' },
  { nombre: 'Acetato', formula: 'CH₃COO⁻', carga: '−1' },
  { nombre: 'Permanganato', formula: 'MnO₄⁻', carga: '−1' },
  { nombre: 'Clorato', formula: 'ClO₃⁻', carga: '−1' },
  { nombre: 'Perclorato', formula: 'ClO₄⁻', carga: '−1' },
  { nombre: 'Hipoclorito', formula: 'ClO⁻', carga: '−1' },
  { nombre: 'Clorito', formula: 'ClO₂⁻', carga: '−1' },
  { nombre: 'Bicarbonato', formula: 'HCO₃⁻', carga: '−1' },
  { nombre: 'Bisulfato', formula: 'HSO₄⁻', carga: '−1' },
  { nombre: 'Cianuro', formula: 'CN⁻', carga: '−1' },
  { nombre: 'Tiocianato', formula: 'SCN⁻', carga: '−1' },
  { nombre: 'Carbonato', formula: 'CO₃²⁻', carga: '−2' },
  { nombre: 'Sulfato', formula: 'SO₄²⁻', carga: '−2' },
  { nombre: 'Sulfito', formula: 'SO₃²⁻', carga: '−2' },
  { nombre: 'Cromato', formula: 'CrO₄²⁻', carga: '−2' },
  { nombre: 'Dicromato', formula: 'Cr₂O₇²⁻', carga: '−2' },
  { nombre: 'Oxalato', formula: 'C₂O₄²⁻', carga: '−2' },
  { nombre: 'Peróxido', formula: 'O₂²⁻', carga: '−2' },
  { nombre: 'Tiosulfato', formula: 'S₂O₃²⁻', carga: '−2' },
  { nombre: 'Fosfato', formula: 'PO₄³⁻', carga: '−3' },
  { nombre: 'Fosfito', formula: 'PO₃³⁻', carga: '−3' },
  { nombre: 'Arsenato', formula: 'AsO₄³⁻', carga: '−3' }
]

export const serieActividad = [
  { metal: 'Li', ion: 'Li⁺', E0: '−3.04' },
  { metal: 'K', ion: 'K⁺', E0: '−2.93' },
  { metal: 'Ba', ion: 'Ba²⁺', E0: '−2.90' },
  { metal: 'Ca', ion: 'Ca²⁺', E0: '−2.87' },
  { metal: 'Na', ion: 'Na⁺', E0: '−2.71' },
  { metal: 'Mg', ion: 'Mg²⁺', E0: '−2.37' },
  { metal: 'Al', ion: 'Al³⁺', E0: '−1.66' },
  { metal: 'Zn', ion: 'Zn²⁺', E0: '−0.76' },
  { metal: 'Fe', ion: 'Fe²⁺', E0: '−0.44' },
  { metal: 'Ni', ion: 'Ni²⁺', E0: '−0.25' },
  { metal: 'Sn', ion: 'Sn²⁺', E0: '−0.14' },
  { metal: 'Pb', ion: 'Pb²⁺', E0: '−0.13' },
  { metal: 'H₂', ion: '2H⁺', E0: '0.00' },
  { metal: 'Cu', ion: 'Cu²⁺', E0: '+0.34' },
  { metal: 'Ag', ion: 'Ag⁺', E0: '+0.80' },
  { metal: 'Au', ion: 'Au³⁺', E0: '+1.50' }
]

export const ordenLlenado = [
  '1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → 5d → 6p → 7s → 5f → 6d → 7p'
]

export const constantes = [
  { simbolo: 'c', nombre: 'Velocidad de la luz', valor: '3.00 × 10⁸ m/s' },
  { simbolo: 'h', nombre: 'Constante de Planck', valor: '6.626 × 10⁻³⁴ J·s' },
  { simbolo: 'e', nombre: 'Carga del electrón', valor: '1.602 × 10⁻¹⁹ C' },
  { simbolo: '1 eV', nombre: 'Electronvoltio', valor: '1.602 × 10⁻¹⁹ J' },
  { simbolo: 'N_A', nombre: 'Número de Avogadro', valor: '6.022 × 10²³ mol⁻¹' },
  { simbolo: 'R', nombre: 'Constante de los gases', valor: '8.314 J/(mol·K)' },
  { simbolo: 'F', nombre: 'Constante de Faraday', valor: '96 485 C/mol' },
  { simbolo: 'a₀', nombre: 'Radio de Bohr', valor: '5.292 × 10⁻¹¹ m' },
  { simbolo: 'k_B', nombre: 'Constante de Boltzmann', valor: '1.381 × 10⁻²³ J/K' },
  { simbolo: 'σ', nombre: 'Constante de Stefan-Boltzmann', valor: '5.670 × 10⁻⁸ W·m⁻²·K⁻⁴' },
  { simbolo: 'G', nombre: 'Constante gravitacional', valor: '6.674 × 10⁻¹¹ N·m²·kg⁻²' },
  { simbolo: 'K_w', nombre: 'Producto iónico del agua (25°C)', valor: '1.0 × 10⁻¹⁴' },
  { simbolo: 'atm', nombre: '1 atmósfera', valor: '101 325 Pa = 760 mmHg' },
  { simbolo: '0 °C', nombre: 'Cero Celsius', valor: '273.15 K' }
]

export const prefijosNumericos = [
  { prefijo: 'mono-', n: 1 },
  { prefijo: 'di-', n: 2 },
  { prefijo: 'tri-', n: 3 },
  { prefijo: 'tetra-', n: 4 },
  { prefijo: 'penta-', n: 5 },
  { prefijo: 'hexa-', n: 6 },
  { prefijo: 'hepta-', n: 7 },
  { prefijo: 'octa-', n: 8 },
  { prefijo: 'nona-', n: 9 },
  { prefijo: 'deca-', n: 10 }
]

export const tendenciasPeriodicas = [
  {
    propiedad: 'Radio atómico',
    grupo: '↓ Aumenta',
    periodo: '→ Disminuye',
    explicacion: 'Más capas = mayor tamaño. Más protones en mismo nivel = mayor atracción nuclear, menor radio.',
    color: '#60a5fa'
  },
  {
    propiedad: 'Energía de ionización',
    grupo: '↓ Disminuye',
    periodo: '→ Aumenta',
    explicacion: 'Electrones más lejanos del núcleo son más fáciles de remover. Mayor carga nuclear efectiva = más difícil ionizar.',
    color: '#f87171'
  },
  {
    propiedad: 'Electronegatividad',
    grupo: '↓ Disminuye',
    periodo: '→ Aumenta',
    explicacion: 'Átomos más pequeños atraen electrones con más fuerza. F es el más electronegativo (3.98).',
    color: '#fbbf24'
  },
  {
    propiedad: 'Afinidad electrónica',
    grupo: '↓ Disminuye (general)',
    periodo: '→ Aumenta (general)',
    explicacion: 'Los halógenos tienen la mayor afinidad electrónica. Los gases nobles tienen afinidad ~0 o negativa.',
    color: '#34d399'
  },
  {
    propiedad: 'Carácter metálico',
    grupo: '↓ Aumenta',
    periodo: '→ Disminuye',
    explicacion: 'Los metales tienden a perder electrones; los no metales a ganarlos. Fr es el más metálico.',
    color: '#a78bfa'
  },
  {
    propiedad: 'Reactividad (metales)',
    grupo: '↓ Aumenta',
    periodo: '→ Disminuye',
    explicacion: 'Metales más grandes pierden electrones más fácilmente. Cs y Fr son extremadamente reactivos.',
    color: '#fb923c'
  }
]

export const estadosOxidacion = [
  { elemento: 'H', estados: ['+1', '−1'] },
  { elemento: 'C', estados: ['−4', '+2', '+4'] },
  { elemento: 'N', estados: ['−3', '+3', '+5'] },
  { elemento: 'O', estados: ['−2', '−1'] },
  { elemento: 'F', estados: ['−1'] },
  { elemento: 'S', estados: ['−2', '+4', '+6'] },
  { elemento: 'Cl', estados: ['−1', '+1', '+3', '+5', '+7'] },
  { elemento: 'Fe', estados: ['+2', '+3'] },
  { elemento: 'Cu', estados: ['+1', '+2'] },
  { elemento: 'Mn', estados: ['+2', '+4', '+7'] },
  { elemento: 'Cr', estados: ['+2', '+3', '+6'] },
  { elemento: 'Zn', estados: ['+2'] },
  { elemento: 'Ag', estados: ['+1'] },
  { elemento: 'Sn', estados: ['+2', '+4'] },
  { elemento: 'Pb', estados: ['+2', '+4'] },
  { elemento: 'Al', estados: ['+3'] },
  { elemento: 'Na', estados: ['+1'] },
  { elemento: 'K', estados: ['+1'] },
  { elemento: 'Ca', estados: ['+2'] },
  { elemento: 'Mg', estados: ['+2'] },
  { elemento: 'P', estados: ['−3', '+3', '+5'] },
  { elemento: 'Br', estados: ['−1', '+1', '+5'] },
  { elemento: 'I', estados: ['−1', '+1', '+5', '+7'] }
]

export const acidosComunes = [
  { nombre: 'Ácido clorhídrico', formula: 'HCl', tipo: 'Fuerte', descripcion: 'Ácido mineral. Disociación completa.' },
  { nombre: 'Ácido sulfúrico', formula: 'H₂SO₄', tipo: 'Fuerte', descripcion: 'Diprotónico. Agente deshidratante.' },
  { nombre: 'Ácido nítrico', formula: 'HNO₃', tipo: 'Fuerte', descripcion: 'Oxidante fuerte. Disociación completa.' },
  { nombre: 'Ácido perclórico', formula: 'HClO₄', tipo: 'Fuerte', descripcion: 'El ácido más fuerte común.' },
  { nombre: 'Ácido bromhídrico', formula: 'HBr', tipo: 'Fuerte', descripcion: 'Similar al HCl.' },
  { nombre: 'Ácido yodhídrico', formula: 'HI', tipo: 'Fuerte', descripcion: 'Fuerte reductor.' },
  { nombre: 'Ácido acético', formula: 'CH₃COOH', tipo: 'Débil', descripcion: 'Ka = 1.8×10⁻⁵. Vinagre.' },
  { nombre: 'Ácido carbónico', formula: 'H₂CO₃', tipo: 'Débil', descripcion: 'Ka₁ = 4.3×10⁻⁷. CO₂ disuelto.' },
  { nombre: 'Ácido fosfórico', formula: 'H₃PO₄', tipo: 'Débil', descripcion: 'Triprotónico. Ka₁ = 7.5×10⁻³.' },
  { nombre: 'Ácido fluorhídrico', formula: 'HF', tipo: 'Débil', descripcion: 'Ka = 6.8×10⁻⁴. Ataca vidrio.' },
  { nombre: 'Ácido sulfhídrico', formula: 'H₂S', tipo: 'Débil', descripcion: 'Ka₁ = 1.0×10⁻⁷. Huevo podrido.' },
  { nombre: 'Ácido cianhídrico', formula: 'HCN', tipo: 'Débil', descripcion: 'Ka = 6.2×10⁻¹⁰. Muy tóxico.' }
]

export const basesComunes = [
  { nombre: 'Hidróxido de sodio', formula: 'NaOH', tipo: 'Fuerte', descripcion: 'Sosa cáustica. Muy soluble.' },
  { nombre: 'Hidróxido de potasio', formula: 'KOH', tipo: 'Fuerte', descripcion: 'Potasa cáustica.' },
  { nombre: 'Hidróxido de calcio', formula: 'Ca(OH)₂', tipo: 'Fuerte', descripcion: 'Cal apagada. Poco soluble.' },
  { nombre: 'Hidróxido de bario', formula: 'Ba(OH)₂', tipo: 'Fuerte', descripcion: 'Soluble. Reactivo analítico.' },
  { nombre: 'Amoníaco', formula: 'NH₃', tipo: 'Débil', descripcion: 'Kb = 1.8×10⁻⁵. Gas soluble en agua.' },
  { nombre: 'Hidróxido de magnesio', formula: 'Mg(OH)₂', tipo: 'Débil', descripcion: 'Leche de magnesia. Poco soluble.' },
  { nombre: 'Hidróxido de aluminio', formula: 'Al(OH)₃', tipo: 'Débil', descripcion: 'Anfótero. Antiácido.' }
]

export const conversionesUnidades = [
  { magnitud: 'Longitud', conversiones: ['1 Å = 10⁻¹⁰ m = 100 pm', '1 nm = 10⁻⁹ m', '1 pm = 10⁻¹² m'] },
  { magnitud: 'Energía', conversiones: ['1 eV = 1.602×10⁻¹⁹ J', '1 cal = 4.184 J', '1 kJ/mol = 0.01036 eV/partícula'] },
  { magnitud: 'Presión', conversiones: ['1 atm = 101 325 Pa', '1 atm = 760 mmHg = 760 torr', '1 bar = 10⁵ Pa'] },
  { magnitud: 'Temperatura', conversiones: ['K = °C + 273.15', '°F = °C × 9/5 + 32'] },
  { magnitud: 'Volumen', conversiones: ['1 L = 10⁻³ m³ = 1 dm³', '1 mL = 1 cm³'] },
  { magnitud: 'Masa', conversiones: ['1 uma = 1.661 × 10⁻²⁷ kg', '1 uma ≈ 1 g/mol (numérico)'] }
]

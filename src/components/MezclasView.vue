<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  alcoholimetricTable,
  geToPercentEthanol,
  percentEthanolToGe
} from '@/data/labTableData.js'
import { problemasMezclas } from '@/data/problemasMezclasData.js'

const activeSection = ref('simulador')

const sections = [
  { id: 'simulador', label: 'Simulador de destilación', icon: '🔥' },
  { id: 'mezclador', label: 'Mezclador interactivo', icon: '🧪' },
  { id: 'factorUnitario', label: 'Factor unitario', icon: '📐' },
  { id: 'problemas', label: 'Calculadoras', icon: '🧮' },
  { id: 'separacion', label: 'Métodos de separación', icon: '🔬' },
  { id: 'conceptos', label: 'Conceptos clave', icon: '📖' }
]

// ─── SIMULADOR DE DESTILACIÓN ───
const heating = ref(false)
const simTime = ref(0)
const simTemp = ref(25)
const simCollected = ref(0)
const simPhase = ref('idle') // idle, heating, boiling, cooling, done
const bubbles = ref([])
const drops = ref([])
const vapors = ref([])
let simInterval = null

const simTempDisplay = computed(() => simTemp.value.toFixed(1))
const simCollectedDisplay = computed(() => simCollected.value.toFixed(1))

const simEthanolPct = computed(() => {
  if (simCollected.value < 1) return 0
  // Simulación: el destilado inicial es más rico en etanol
  const progress = Math.min(1, simCollected.value / 40)
  // Empieza ~80% y baja hacia ~40% a medida que se destila
  return Math.max(30, 80 - progress * 50).toFixed(1)
})

const simGE = computed(() => {
  return percentEthanolToGe(parseFloat(simEthanolPct.value)) || '—'
})

function startSim() {
  if (simInterval) return
  heating.value = true
  simPhase.value = 'heating'
  simInterval = setInterval(() => {
    simTime.value += 0.1

    if (simPhase.value === 'heating') {
      simTemp.value = Math.min(78.2, simTemp.value + 0.8)
      // Burbujas antes de hervir
      if (simTemp.value > 60 && Math.random() > 0.7) {
        bubbles.value.push({
          id: Date.now() + Math.random(),
          x: 25 + Math.random() * 30,
          startY: 75,
          size: 2 + Math.random() * 3
        })
      }
      if (simTemp.value >= 78.2) {
        simPhase.value = 'boiling'
      }
    } else if (simPhase.value === 'boiling') {
      // Temperatura se mantiene ~78°C durante la destilación del etanol
      simTemp.value = 78.2 + Math.random() * 0.5
      simCollected.value = Math.min(40, simCollected.value + 0.15)

      // Muchas burbujas
      if (Math.random() > 0.3) {
        bubbles.value.push({
          id: Date.now() + Math.random(),
          x: 20 + Math.random() * 35,
          startY: 75,
          size: 3 + Math.random() * 4
        })
      }
      // Vapor
      if (Math.random() > 0.4) {
        vapors.value.push({
          id: Date.now() + Math.random(),
          x: 55 + Math.random() * 5,
          startY: 35
        })
      }
      // Gotas de destilado
      if (Math.random() > 0.6) {
        drops.value.push({
          id: Date.now() + Math.random(),
          x: 78 + Math.random() * 3,
          startY: 55
        })
      }

      if (simCollected.value >= 40) {
        simPhase.value = 'done'
        stopSim()
      }
    }

    // Limpiar partículas viejas
    const now = Date.now()
    bubbles.value = bubbles.value.slice(-15)
    vapors.value = vapors.value.slice(-8)
    drops.value = drops.value.slice(-6)
  }, 100)
}

function stopSim() {
  heating.value = false
  if (simInterval) {
    clearInterval(simInterval)
    simInterval = null
  }
}

function resetSim() {
  stopSim()
  simTime.value = 0
  simTemp.value = 25
  simCollected.value = 0
  simPhase.value = 'idle'
  bubbles.value = []
  drops.value = []
  vapors.value = []
}

onUnmounted(() => stopSim())

// ─── MEZCLADOR INTERACTIVO ───
const mixEthanol = ref(40) // % v/v
const mixVolume = ref(100) // mL total

const mixDensity = computed(() => {
  const pct = mixEthanol.value
  // Interpolar de la tabla
  const i = Math.floor(pct / 5)
  const j = Math.min(i + 1, alcoholimetricTable.length - 1)
  const a = alcoholimetricTable[i]
  const b = alcoholimetricTable[j]
  const t = (pct - a.pctEthanol) / ((b.pctEthanol - a.pctEthanol) || 1)
  return (a.density + t * (b.density - a.density)).toFixed(4)
})

const mixGE = computed(() => percentEthanolToGe(mixEthanol.value))
const mixGL = computed(() => mixEthanol.value) // °GL = % v/v a 15.56°C
const mixVolEthanol = computed(() => (mixVolume.value * mixEthanol.value / 100).toFixed(1))
const mixVolWater = computed(() => (mixVolume.value * (100 - mixEthanol.value) / 100).toFixed(1))
const mixMass = computed(() => (mixVolume.value * parseFloat(mixDensity.value)).toFixed(2))

// Color de la mezcla (agua azul → etanol transparente)
const mixColor = computed(() => {
  const pct = mixEthanol.value / 100
  const r = Math.round(200 + pct * 55)
  const g = Math.round(220 + pct * 35)
  const b = Math.round(255 - pct * 15)
  const a = 1 - pct * 0.4
  return `rgba(${r}, ${g}, ${b}, ${a})`
})

// ─── MÉTODOS DE SEPARACIÓN ───
const activeSepMethod = ref(null)
const separationMethods = [
  {
    id: 'destilacion-simple',
    name: 'Destilación simple',
    icon: '🔥',
    applies: 'Líquidos miscibles con ΔP.E. > 25°C',
    principle: 'Diferencia de puntos de ebullición',
    example: 'Etanol (78°C) de agua (100°C)',
    steps: [
      'Calentar la mezcla en el balón',
      'El componente más volátil hierve primero',
      'El vapor sube y entra al condensador',
      'El condensador (con agua en contracorriente) enfría el vapor',
      'El líquido puro se recolecta como destilado'
    ],
    pros: ['Equipo sencillo', 'Económica', 'Buena para ΔT grande'],
    cons: ['No supera azeótropos', 'No separa P.E. cercanos'],
    usedInP3: true
  },
  {
    id: 'destilacion-fraccionada',
    name: 'Destilación fraccionada',
    icon: '🏭',
    applies: 'Líquidos miscibles con ΔP.E. < 25°C',
    principle: 'Múltiples equilibrios líquido-vapor en columna',
    example: 'Separación de petróleo, aceites esenciales',
    steps: [
      'Similar a la simple pero con columna de fraccionamiento',
      'La columna tiene platos o relleno que crean múltiples etapas',
      'El vapor se condensa y re-evapora en cada plato',
      'Cada etapa enriquece el vapor en el componente más volátil',
      'Se obtiene mejor separación'
    ],
    pros: ['Separa P.E. cercanos', 'Mayor pureza'],
    cons: ['Equipo más complejo', 'Más lenta', 'No supera azeótropos'],
    usedInP3: false
  },
  {
    id: 'destilacion-vacio',
    name: 'Destilación al vacío',
    icon: '🌀',
    applies: 'Sustancias que se descomponen al calentar',
    principle: 'Reducir presión → reduce punto de ebullición',
    example: 'Glicerina, vitaminas, compuestos termosensibles',
    steps: [
      'Conectar el sistema a una bomba de vacío',
      'Reducir la presión del sistema',
      'El líquido hierve a temperatura menor',
      'Destilar a temperatura baja',
      'La sustancia no se descompone'
    ],
    pros: ['Evita descomposición térmica', 'Preserva compuestos sensibles'],
    cons: ['Requiere bomba de vacío', 'Equipo costoso'],
    usedInP3: false
  },
  {
    id: 'arrastre-vapor',
    name: 'Destilación por arrastre de vapor',
    icon: '💨',
    applies: 'Sustancias inmiscibles con agua',
    principle: 'El vapor de agua arrastra el compuesto volátil',
    example: 'Aceites esenciales de plantas',
    steps: [
      'Pasar vapor de agua a través de la muestra',
      'El vapor arrastra las sustancias volátiles',
      'La mezcla de vapores se condensa',
      'Los líquidos inmiscibles se separan por decantación',
      'Se obtiene el producto puro'
    ],
    pros: ['Temperatura menor al P.E. normal', 'Buena para productos naturales'],
    cons: ['Solo sustancias inmiscibles con agua', 'Requiere generador de vapor'],
    usedInP3: false
  },
  {
    id: 'filtracion',
    name: 'Filtración',
    icon: '🧫',
    applies: 'Sólido insoluble en líquido',
    principle: 'Tamaño de partícula vs. poro del filtro',
    example: 'Arena de agua, precipitados',
    steps: [
      'Colocar papel filtro en embudo',
      'Verter la mezcla sobre el filtro',
      'El líquido (filtrado) pasa a través',
      'El sólido (residuo) queda retenido'
    ],
    pros: ['Muy sencilla', 'Rápida', 'Económica'],
    cons: ['Solo sólido-líquido', 'No separa sustancias disueltas'],
    usedInP3: false
  },
  {
    id: 'decantacion',
    name: 'Decantación',
    icon: '🫗',
    applies: 'Líquidos inmiscibles o sólido sedimentado',
    principle: 'Diferencia de densidad y gravedad',
    example: 'Agua y aceite, arena sedimentada',
    steps: [
      'Dejar reposar la mezcla',
      'Las fases se separan por densidad',
      'El más denso queda abajo',
      'Verter o drenar cuidadosamente la fase deseada'
    ],
    pros: ['Sin equipo especial', 'Sin energía'],
    cons: ['Solo inmiscibles', 'Separación imperfecta en la interfase'],
    usedInP3: false
  }
]

// ─── CONCEPTOS ───
const activeConceptIndex = ref(0)
const concepts = [
  {
    title: 'Mezcla homogénea vs heterogénea',
    content: 'Una mezcla homogénea (solución) tiene composición uniforme en toda su extensión — no puedes distinguir sus componentes a simple vista. Ejemplo: agua con etanol, aire. Una mezcla heterogénea tiene fases visibles. Ejemplo: agua con aceite, arena con sal.',
    visual: 'homogenea'
  },
  {
    title: 'Propiedad intensiva vs extensiva',
    content: 'La concentración es una propiedad intensiva: no depende de la cantidad de muestra. 10 mL de vodka al 40% tiene la misma concentración que 1 L. La masa y el volumen son extensivas: dependen de cuánta muestra hay.',
    visual: 'intensiva'
  },
  {
    title: 'Porcentaje v/v y Grados Gay-Lussac',
    content: '% v/v = (volumen soluto / volumen solución) × 100. Grados Gay-Lussac (°GL) equivalen al % v/v medido a 15,56°C. Una bebida de 40°GL contiene 40 mL de etanol por cada 100 mL de bebida.',
    visual: 'vv'
  },
  {
    title: 'Gravedad específica (GE)',
    content: 'GE = ρ_destilado / ρ_agua. Ambas medidas a 15,56°C. Es adimensional. Se usa para determinar la concentración de etanol consultando tablas de referencia. GE < 1 indica que la mezcla es menos densa que el agua.',
    visual: 'ge'
  },
  {
    title: 'Azeótropo etanol-agua',
    content: 'A 95,6% de etanol y 78,2°C, el vapor tiene la misma composición que el líquido. La destilación simple NO puede superar este punto. Para obtener etanol absoluto (100%) se necesitan métodos especiales: destilación azeotrópica con benceno, tamices moleculares o desecantes.',
    visual: 'azeotropo'
  },
  {
    title: 'Contracorriente en el condensador',
    content: 'El agua fría de refrigeración entra por abajo y sale por arriba del condensador, mientras el vapor caliente entra por arriba. Esto mantiene el máximo gradiente de temperatura en todo el tubo: el vapor siempre encuentra agua más fría, condensando eficientemente.',
    visual: 'contracorriente'
  },
  {
    title: 'Velocidad de destilación',
    content: 'Muy rápida: poco contacto vapor-líquido, menor pureza, arrastre de gotas. Muy lenta: pérdida de tiempo, evaporación del destilado. Óptima: 1-2 gotas por segundo, buen equilibrio termodinámico, destilado más puro.',
    visual: 'velocidad'
  },
  {
    title: '¿Por qué 15,56°C (60°F)?',
    content: 'La densidad de los líquidos cambia con la temperatura. Las tablas de referencia están calibradas a 15,56°C. Si mides a otra temperatura, los valores de GE y concentración no coincidirán con las tablas. Por eso se enfría el destilado en baño de hielo antes de medir.',
    visual: 'temperatura'
  }
]

// ─── RESOLVER PROBLEMAS ───
const activeProblem = ref('dilucion')

const problemTypes = [
  { id: 'dilucion', label: 'Dilución', formula: 'C₁V₁ = C₂V₂' },
  { id: 'mezcla2', label: 'Mezcla de 2 soluciones', formula: 'C₁V₁ + C₂V₂ = C_f·V_f' },
  { id: 'pctMasa', label: '% masa (m/m)', formula: '%m/m = (m_soluto/m_solución)×100' },
  { id: 'pctVol', label: '% volumen (v/v)', formula: '%v/v = (V_soluto/V_solución)×100' },
  { id: 'pctMasaVol', label: '% masa/vol (m/v)', formula: '%m/v = (m_soluto/V_solución)×100' },
  { id: 'molaridad', label: 'Molaridad', formula: 'M = mol/L' },
  { id: 'densidadConc', label: 'Densidad → Concentración', formula: 'ρ, %m/m → M' },
  { id: 'ppm', label: 'ppm', formula: 'ppm = mg/L ó mg/kg' }
]

// --- Dilución C1V1=C2V2 ---
const dil = ref({ c1: '', v1: '', c2: '', v2: '' })
const dilTarget = ref('v2') // qué incógnita resolver
const dilResult = computed(() => {
  const c1 = parseFloat(dil.value.c1)
  const v1 = parseFloat(dil.value.v1)
  const c2 = parseFloat(dil.value.c2)
  const v2 = parseFloat(dil.value.v2)
  const t = dilTarget.value
  if (t === 'v2' && isF(c1) && isF(v1) && isF(c2) && c2 > 0) return { val: (c1 * v1 / c2), unit: 'mL', variable: 'V₂' }
  if (t === 'c2' && isF(c1) && isF(v1) && isF(v2) && v2 > 0) return { val: (c1 * v1 / v2), unit: '', variable: 'C₂' }
  if (t === 'v1' && isF(c1) && isF(c2) && isF(v2) && c1 > 0) return { val: (c2 * v2 / c1), unit: 'mL', variable: 'V₁' }
  if (t === 'c1' && isF(v1) && isF(c2) && isF(v2) && v1 > 0) return { val: (c2 * v2 / v1), unit: '', variable: 'C₁' }
  return null
})
const dilSteps = computed(() => {
  if (!dilResult.value) return []
  const c1 = parseFloat(dil.value.c1), v1 = parseFloat(dil.value.v1)
  const c2 = parseFloat(dil.value.c2), v2 = parseFloat(dil.value.v2)
  const r = dilResult.value
  const t = dilTarget.value
  const steps = ['Fórmula: C₁ × V₁ = C₂ × V₂']
  if (t === 'v2') {
    steps.push(`Sustituir: ${c1} × ${v1} = ${c2} × V₂`)
    steps.push(`${(c1 * v1).toFixed(4)} = ${c2} × V₂`)
    steps.push(`V₂ = ${(c1 * v1).toFixed(4)} / ${c2}`)
  } else if (t === 'c2') {
    steps.push(`Sustituir: ${c1} × ${v1} = C₂ × ${v2}`)
    steps.push(`${(c1 * v1).toFixed(4)} = C₂ × ${v2}`)
    steps.push(`C₂ = ${(c1 * v1).toFixed(4)} / ${v2}`)
  } else if (t === 'v1') {
    steps.push(`Sustituir: ${c1} × V₁ = ${c2} × ${v2}`)
    steps.push(`${c1} × V₁ = ${(c2 * v2).toFixed(4)}`)
    steps.push(`V₁ = ${(c2 * v2).toFixed(4)} / ${c1}`)
  } else {
    steps.push(`Sustituir: C₁ × ${v1} = ${c2} × ${v2}`)
    steps.push(`C₁ × ${v1} = ${(c2 * v2).toFixed(4)}`)
    steps.push(`C₁ = ${(c2 * v2).toFixed(4)} / ${v1}`)
  }
  steps.push(`${r.variable} = ${r.val.toFixed(4)} ${r.unit}`)
  return steps
})

// --- Mezcla de 2 soluciones ---
const mix2 = ref({ c1: '', v1: '', c2: '', v2: '' })
const mix2Target = ref('cf') // cf o vf
const mix2Result = computed(() => {
  const c1 = parseFloat(mix2.value.c1), v1 = parseFloat(mix2.value.v1)
  const c2 = parseFloat(mix2.value.c2), v2 = parseFloat(mix2.value.v2)
  if (!isF(c1) || !isF(v1) || !isF(c2) || !isF(v2)) return null
  const vf = v1 + v2
  if (vf <= 0) return null
  const cf = (c1 * v1 + c2 * v2) / vf
  return { cf: cf, vf: vf }
})
const mix2Steps = computed(() => {
  if (!mix2Result.value) return []
  const c1 = parseFloat(mix2.value.c1), v1 = parseFloat(mix2.value.v1)
  const c2 = parseFloat(mix2.value.c2), v2 = parseFloat(mix2.value.v2)
  const r = mix2Result.value
  return [
    'Fórmula: C₁V₁ + C₂V₂ = C_f × V_f',
    `V_f = V₁ + V₂ = ${v1} + ${v2} = ${r.vf.toFixed(2)} mL`,
    `C₁V₁ = ${c1} × ${v1} = ${(c1 * v1).toFixed(4)}`,
    `C₂V₂ = ${c2} × ${v2} = ${(c2 * v2).toFixed(4)}`,
    `C_f = (${(c1 * v1).toFixed(4)} + ${(c2 * v2).toFixed(4)}) / ${r.vf.toFixed(2)}`,
    `C_f = ${r.cf.toFixed(4)}`
  ]
})

// --- % masa (m/m) ---
const pctM = ref({ mSoluto: '', mSolucion: '', pct: '' })
const pctMTarget = ref('pct')
const pctMResult = computed(() => {
  const ms = parseFloat(pctM.value.mSoluto)
  const msol = parseFloat(pctM.value.mSolucion)
  const p = parseFloat(pctM.value.pct)
  const t = pctMTarget.value
  if (t === 'pct' && isF(ms) && isF(msol) && msol > 0) return { val: (ms / msol) * 100, variable: '% m/m', unit: '%' }
  if (t === 'mSoluto' && isF(p) && isF(msol)) return { val: (p / 100) * msol, variable: 'm_soluto', unit: 'g' }
  if (t === 'mSolucion' && isF(p) && isF(ms) && p > 0) return { val: ms / (p / 100), variable: 'm_solución', unit: 'g' }
  return null
})
const pctMSteps = computed(() => {
  if (!pctMResult.value) return []
  const r = pctMResult.value, t = pctMTarget.value
  const ms = parseFloat(pctM.value.mSoluto), msol = parseFloat(pctM.value.mSolucion), p = parseFloat(pctM.value.pct)
  const steps = ['Fórmula: %m/m = (m_soluto / m_solución) × 100']
  if (t === 'pct') {
    steps.push(`%m/m = (${ms} / ${msol}) × 100`)
    steps.push(`%m/m = ${r.val.toFixed(4)}%`)
  } else if (t === 'mSoluto') {
    steps.push(`Despejando: m_soluto = (%m/m / 100) × m_solución`)
    steps.push(`m_soluto = (${p} / 100) × ${msol}`)
    steps.push(`m_soluto = ${r.val.toFixed(4)} g`)
  } else {
    steps.push(`Despejando: m_solución = m_soluto / (%m/m / 100)`)
    steps.push(`m_solución = ${ms} / (${p} / 100)`)
    steps.push(`m_solución = ${r.val.toFixed(4)} g`)
  }
  return steps
})

// --- % volumen (v/v) ---
const pctV = ref({ vSoluto: '', vSolucion: '', pct: '' })
const pctVTarget = ref('pct')
const pctVResult = computed(() => {
  const vs = parseFloat(pctV.value.vSoluto)
  const vsol = parseFloat(pctV.value.vSolucion)
  const p = parseFloat(pctV.value.pct)
  const t = pctVTarget.value
  if (t === 'pct' && isF(vs) && isF(vsol) && vsol > 0) return { val: (vs / vsol) * 100, variable: '% v/v', unit: '%' }
  if (t === 'vSoluto' && isF(p) && isF(vsol)) return { val: (p / 100) * vsol, variable: 'V_soluto', unit: 'mL' }
  if (t === 'vSolucion' && isF(p) && isF(vs) && p > 0) return { val: vs / (p / 100), variable: 'V_solución', unit: 'mL' }
  return null
})
const pctVSteps = computed(() => {
  if (!pctVResult.value) return []
  const r = pctVResult.value, t = pctVTarget.value
  const vs = parseFloat(pctV.value.vSoluto), vsol = parseFloat(pctV.value.vSolucion), p = parseFloat(pctV.value.pct)
  const steps = ['Fórmula: %v/v = (V_soluto / V_solución) × 100']
  if (t === 'pct') {
    steps.push(`%v/v = (${vs} / ${vsol}) × 100`)
    steps.push(`%v/v = ${r.val.toFixed(4)}%`)
  } else if (t === 'vSoluto') {
    steps.push(`V_soluto = (%v/v / 100) × V_solución`)
    steps.push(`V_soluto = (${p} / 100) × ${vsol} = ${r.val.toFixed(4)} mL`)
  } else {
    steps.push(`V_solución = V_soluto / (%v/v / 100)`)
    steps.push(`V_solución = ${vs} / (${p} / 100) = ${r.val.toFixed(4)} mL`)
  }
  return steps
})

// --- % m/v ---
const pctMV = ref({ mSoluto: '', vSolucion: '', pct: '' })
const pctMVTarget = ref('pct')
const pctMVResult = computed(() => {
  const ms = parseFloat(pctMV.value.mSoluto)
  const vsol = parseFloat(pctMV.value.vSolucion)
  const p = parseFloat(pctMV.value.pct)
  const t = pctMVTarget.value
  if (t === 'pct' && isF(ms) && isF(vsol) && vsol > 0) return { val: (ms / vsol) * 100, variable: '% m/v', unit: '%' }
  if (t === 'mSoluto' && isF(p) && isF(vsol)) return { val: (p / 100) * vsol, variable: 'm_soluto', unit: 'g' }
  if (t === 'vSolucion' && isF(p) && isF(ms) && p > 0) return { val: ms / (p / 100), variable: 'V_solución', unit: 'mL' }
  return null
})
const pctMVSteps = computed(() => {
  if (!pctMVResult.value) return []
  const r = pctMVResult.value, t = pctMVTarget.value
  const ms = parseFloat(pctMV.value.mSoluto), vsol = parseFloat(pctMV.value.vSolucion), p = parseFloat(pctMV.value.pct)
  const steps = ['Fórmula: %m/v = (m_soluto [g] / V_solución [mL]) × 100']
  if (t === 'pct') {
    steps.push(`%m/v = (${ms} / ${vsol}) × 100 = ${r.val.toFixed(4)}%`)
  } else if (t === 'mSoluto') {
    steps.push(`m_soluto = (%m/v / 100) × V_solución = (${p}/100) × ${vsol} = ${r.val.toFixed(4)} g`)
  } else {
    steps.push(`V_solución = m_soluto / (%m/v / 100) = ${ms} / (${p}/100) = ${r.val.toFixed(4)} mL`)
  }
  return steps
})

// --- Molaridad ---
const mol = ref({ masaSoluto: '', mmSoluto: '', volLitros: '' })
const molTarget = ref('M')
const molResult = computed(() => {
  const m = parseFloat(mol.value.masaSoluto)
  const mm = parseFloat(mol.value.mmSoluto)
  const v = parseFloat(mol.value.volLitros)
  const t = molTarget.value
  if (t === 'M' && isF(m) && isF(mm) && isF(v) && mm > 0 && v > 0) {
    const moles = m / mm
    return { val: moles / v, moles, variable: 'M', unit: 'mol/L' }
  }
  if (t === 'masa' && isF(mm) && isF(v)) {
    const M = parseFloat(mol.value.masaSoluto) // reusar campo como M input
    // Necesitamos M como input... mejor usar un campo extra
    return null
  }
  return null
})
const molSteps = computed(() => {
  if (!molResult.value) return []
  const m = parseFloat(mol.value.masaSoluto), mm = parseFloat(mol.value.mmSoluto), v = parseFloat(mol.value.volLitros)
  const r = molResult.value
  return [
    'Fórmula: M = n / V   donde   n = m / MM',
    `n = m / MM = ${m} g / ${mm} g/mol = ${r.moles.toFixed(6)} mol`,
    `M = n / V = ${r.moles.toFixed(6)} / ${v} L`,
    `M = ${r.val.toFixed(4)} mol/L`
  ]
})

// --- Densidad → Concentración (ρ, %m/m → M) ---
const denConc = ref({ densidad: '', pctMM: '', mm: '' })
const denConcResult = computed(() => {
  const rho = parseFloat(denConc.value.densidad) // g/mL
  const pct = parseFloat(denConc.value.pctMM)
  const mm = parseFloat(denConc.value.mm) // g/mol
  if (!isF(rho) || !isF(pct) || !isF(mm) || mm <= 0) return null
  const M = (rho * pct * 10) / mm
  return { M, rho, pct, mm }
})
const denConcSteps = computed(() => {
  if (!denConcResult.value) return []
  const { M, rho, pct, mm } = denConcResult.value
  return [
    'Fórmula: M = (ρ × %m/m × 10) / MM',
    `Donde: ρ = ${rho} g/mL, %m/m = ${pct}%, MM = ${mm} g/mol`,
    `M = (${rho} × ${pct} × 10) / ${mm}`,
    `M = ${(rho * pct * 10).toFixed(4)} / ${mm}`,
    `M = ${M.toFixed(4)} mol/L`
  ]
})

// --- ppm ---
const ppmCalc = ref({ masa: '', masaTotal: '', volLitros: '' })
const ppmMode = ref('masaMasa') // masaMasa o masaVol
const ppmResult = computed(() => {
  if (ppmMode.value === 'masaMasa') {
    const ms = parseFloat(ppmCalc.value.masa) // mg
    const mt = parseFloat(ppmCalc.value.masaTotal) // kg
    if (!isF(ms) || !isF(mt) || mt <= 0) return null
    return { val: ms / mt, unit: 'mg/kg' }
  } else {
    const ms = parseFloat(ppmCalc.value.masa) // mg
    const v = parseFloat(ppmCalc.value.volLitros) // L
    if (!isF(ms) || !isF(v) || v <= 0) return null
    return { val: ms / v, unit: 'mg/L' }
  }
})
const ppmSteps = computed(() => {
  if (!ppmResult.value) return []
  const r = ppmResult.value
  if (ppmMode.value === 'masaMasa') {
    const ms = parseFloat(ppmCalc.value.masa), mt = parseFloat(ppmCalc.value.masaTotal)
    return [
      'ppm (masa/masa) = mg de soluto / kg de solución',
      `ppm = ${ms} mg / ${mt} kg`,
      `ppm = ${r.val.toFixed(4)} mg/kg`
    ]
  } else {
    const ms = parseFloat(ppmCalc.value.masa), v = parseFloat(ppmCalc.value.volLitros)
    return [
      'ppm (masa/vol) = mg de soluto / L de solución',
      `ppm = ${ms} mg / ${v} L`,
      `ppm = ${r.val.toFixed(4)} mg/L`
    ]
  }
})

// ─── FACTOR UNITARIO ───
const activeProblemaId = ref(1)
const revealedSteps = ref(0)
const showRespuesta = ref(false)
const filtroCategoria = ref('todas')

const categorias = [
  { id: 'todas', label: 'Todos' },
  { id: 'molaridad', label: 'Molaridad' },
  { id: 'densidad', label: 'Densidad' },
  { id: 'dilucion', label: 'Dilución' },
  { id: 'porcentaje', label: 'Porcentaje' },
  { id: 'ppm', label: 'ppm' },
  { id: 'conversion', label: 'Conversión' },
  { id: 'integrador', label: 'Integrador' }
]

const problemasFiltrados = computed(() => {
  if (filtroCategoria.value === 'todas') return problemasMezclas
  return problemasMezclas.filter(p => p.categoria === filtroCategoria.value)
})

const problemaActual = computed(() => problemasMezclas.find(p => p.id === activeProblemaId.value))

function seleccionarProblema(id) {
  activeProblemaId.value = id
  revealedSteps.value = 0
  showRespuesta.value = false
}

function revelarSiguientePaso() {
  if (!problemaActual.value) return
  if (revealedSteps.value < problemaActual.value.cadena.length) {
    revealedSteps.value++
  } else {
    showRespuesta.value = true
  }
}

function revelarTodo() {
  if (!problemaActual.value) return
  revealedSteps.value = problemaActual.value.cadena.length
  showRespuesta.value = true
}

function isF(v) { return Number.isFinite(v) }
</script>

<template>
  <div class="space-y-4">
    <!-- Navegación -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
        :class="activeSection === sec.id
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'"
        @click="activeSection = sec.id"
      >
        <span class="text-sm">{{ sec.icon }}</span>
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════ SIMULADOR DE DESTILACIÓN ═══════════════ -->
    <div v-if="activeSection === 'simulador'" class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Simulador de destilación simple</CardTitle>
          <p class="text-sm text-muted-foreground">
            Observa cómo funciona la destilación simple de una mezcla etanol-agua. Controla el mechero y observa el proceso.
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            <!-- SVG del equipo -->
            <div class="relative bg-muted/10 rounded-xl border p-4 overflow-hidden" style="min-height: 380px">
              <svg viewBox="0 0 100 85" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
                <!-- Soporte universal -->
                <rect x="8" y="2" width="1.5" height="80" fill="currentColor" opacity="0.3" rx="0.5" />
                <rect x="4" y="80" width="10" height="2" fill="currentColor" opacity="0.3" rx="0.5" />

                <!-- Pinza/aro -->
                <line x1="9.5" y1="30" x2="22" y2="30" stroke="currentColor" stroke-width="0.8" opacity="0.3" />

                <!-- Balón de destilación -->
                <ellipse cx="35" cy="65" rx="16" ry="14" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
                <line x1="35" y1="51" x2="35" y2="38" stroke="currentColor" stroke-width="1" opacity="0.4" />
                <!-- Cuello del balón -->
                <rect x="33" y="35" width="4" height="5" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4" rx="0.5" />

                <!-- Líquido en balón -->
                <ellipse
                  cx="35" cy="68"
                  :rx="14 - simCollected * 0.15"
                  :ry="10 - simCollected * 0.1"
                  :fill="simPhase === 'idle' ? 'rgba(147, 197, 253, 0.5)' : 'rgba(147, 197, 253, 0.3)'"
                  stroke="none"
                />

                <!-- Burbujas -->
                <circle
                  v-for="b in bubbles"
                  :key="b.id"
                  :cx="b.x"
                  :cy="b.startY"
                  :r="b.size * 0.4"
                  fill="rgba(255,255,255,0.6)"
                  class="animate-bubble"
                />

                <!-- Termómetro en boca del balón -->
                <line x1="36" y1="36" x2="38" y2="25" stroke="#ef4444" stroke-width="0.6" />
                <circle cx="38" cy="24" r="1.5" fill="none" stroke="#ef4444" stroke-width="0.5" />
                <text x="40" y="22" font-size="3" fill="#ef4444" font-weight="bold">{{ simTempDisplay }}°C</text>

                <!-- Tubo de salida (al condensador) -->
                <path d="M 37 36 Q 45 30 55 32" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />

                <!-- Condensador -->
                <rect x="55" y="28" width="22" height="5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" rx="1" transform="rotate(15, 66, 30)" />
                <!-- Tubo interno -->
                <line x1="56" y1="31" x2="76" y2="35" stroke="currentColor" stroke-width="0.4" opacity="0.3" />

                <!-- Flujo de agua (contracorriente) -->
                <text x="58" y="27" font-size="2.5" fill="#3b82f6" opacity="0.7">agua fría ↑</text>
                <text x="70" y="40" font-size="2.5" fill="#ef4444" opacity="0.7">agua caliente ↓</text>

                <!-- Flechas de contracorriente -->
                <path d="M 60 36 L 60 27" fill="none" stroke="#3b82f6" stroke-width="0.4" marker-end="url(#arrowBlue)" opacity="0.5" />
                <path d="M 73 28 L 73 37" fill="none" stroke="#ef4444" stroke-width="0.4" opacity="0.5" />

                <!-- Vapores -->
                <g v-for="v in vapors" :key="v.id" class="animate-vapor" opacity="0.3">
                  <circle :cx="v.x" :cy="v.startY" r="1.5" fill="#94a3b8" />
                </g>

                <!-- Gotas de destilado -->
                <g v-for="d in drops" :key="d.id" class="animate-drop">
                  <circle :cx="d.x" :cy="d.startY" r="0.8" fill="#93c5fd" />
                </g>

                <!-- Matraz receptor -->
                <path d="M 75 42 L 72 55 Q 72 62 78 62 Q 84 62 84 55 L 81 42" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.4" />
                <!-- Destilado recolectado -->
                <rect
                  v-if="simCollected > 0"
                  x="73" :y="62 - simCollected * 0.4"
                  width="10" :height="simCollected * 0.4"
                  fill="rgba(147, 197, 253, 0.4)"
                  rx="1"
                />

                <!-- Mechero -->
                <rect x="28" y="80" width="14" height="3" fill="currentColor" opacity="0.3" rx="1" />
                <!-- Llama -->
                <g v-if="heating" class="animate-flame">
                  <ellipse cx="35" cy="78" rx="3" ry="4" fill="#f59e0b" opacity="0.7" />
                  <ellipse cx="35" cy="77" rx="1.5" ry="2.5" fill="#3b82f6" opacity="0.8" />
                </g>

                <!-- Labels -->
                <text x="35" y="84" font-size="2.5" text-anchor="middle" fill="currentColor" opacity="0.5">Mechero</text>
                <text x="35" y="50" font-size="2.5" text-anchor="middle" fill="currentColor" opacity="0.5">Balón</text>
                <text x="66" y="25" font-size="2.5" text-anchor="middle" fill="currentColor" opacity="0.5">Condensador</text>
                <text x="78" y="66" font-size="2.5" text-anchor="middle" fill="currentColor" opacity="0.5">Receptor</text>
              </svg>
            </div>

            <!-- Controles y datos -->
            <div class="space-y-3">
              <!-- Botones -->
              <div class="flex gap-2">
                <button
                  class="flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
                  :class="heating
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'"
                  :disabled="simPhase === 'done'"
                  @click="heating ? stopSim() : startSim()"
                >
                  {{ heating ? 'Apagar mechero' : simPhase === 'done' ? 'Completado' : 'Encender mechero' }}
                </button>
                <button
                  class="rounded-lg px-3 py-2.5 text-sm font-medium bg-muted hover:bg-muted/80 transition-colors"
                  @click="resetSim"
                >
                  Reiniciar
                </button>
              </div>

              <!-- Estado -->
              <div class="rounded-lg border p-3 space-y-2">
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-gray-400': simPhase === 'idle',
                      'bg-amber-500 animate-pulse': simPhase === 'heating',
                      'bg-red-500 animate-pulse': simPhase === 'boiling',
                      'bg-green-500': simPhase === 'done'
                    }"
                  ></div>
                  <span class="text-xs font-medium">
                    {{ simPhase === 'idle' ? 'Listo para iniciar' :
                       simPhase === 'heating' ? 'Calentando...' :
                       simPhase === 'boiling' ? 'Destilando (ebullición)' :
                       'Destilación completa' }}
                  </span>
                </div>
              </div>

              <!-- Métricas -->
              <div class="grid grid-cols-2 gap-2">
                <div class="rounded-lg border p-2.5 text-center">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Temperatura</span>
                  <span class="font-mono font-bold text-lg" :class="simTemp > 70 ? 'text-red-500' : ''">
                    {{ simTempDisplay }}°C
                  </span>
                </div>
                <div class="rounded-lg border p-2.5 text-center">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Recolectado</span>
                  <span class="font-mono font-bold text-lg text-blue-500">
                    {{ simCollectedDisplay }} mL
                  </span>
                </div>
                <div class="rounded-lg border p-2.5 text-center">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">% Etanol dest.</span>
                  <span class="font-mono font-bold text-lg text-primary">
                    {{ simEthanolPct }}%
                  </span>
                </div>
                <div class="rounded-lg border p-2.5 text-center">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">GE destilado</span>
                  <span class="font-mono font-bold text-lg">
                    {{ simGE }}
                  </span>
                </div>
              </div>

              <!-- Barra de progreso temperatura -->
              <div>
                <div class="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>25°C</span>
                  <span>78.2°C (P.E. etanol)</span>
                  <span>100°C</span>
                </div>
                <div class="h-3 bg-muted rounded-full overflow-hidden relative">
                  <div
                    class="h-full rounded-full transition-all duration-200"
                    :style="{
                      width: Math.min(100, ((simTemp - 25) / 75) * 100) + '%',
                      background: simTemp < 78 ? 'linear-gradient(90deg, #3b82f6, #f59e0b)' : 'linear-gradient(90deg, #f59e0b, #ef4444)'
                    }"
                  ></div>
                  <!-- Marcador del P.E. -->
                  <div class="absolute top-0 h-full w-px bg-foreground/30" style="left: 70.9%"></div>
                </div>
              </div>

              <!-- Notas del proceso -->
              <div class="text-xs text-muted-foreground space-y-1 p-2 rounded-lg bg-muted/30">
                <p v-if="simPhase === 'idle'">Presiona "Encender mechero" para iniciar la destilación de 50 mL de una mezcla etanol-agua.</p>
                <p v-if="simPhase === 'heating'">La temperatura sube. El etanol hierve a 78.2°C — observa las burbujas formándose.</p>
                <p v-if="simPhase === 'boiling'">La temperatura se estabiliza ~78°C. El vapor sube, se condensa en contracorriente y gotea al matraz receptor.</p>
                <p v-if="simPhase === 'done'">Destilación completa. El destilado tiene ~{{ simEthanolPct }}% etanol (GE ≈ {{ simGE }}). Recuerda: nunca supera 95.6% (azeótropo).</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════ MEZCLADOR INTERACTIVO ═══════════════ -->
    <div v-if="activeSection === 'mezclador'" class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Mezclador etanol-agua interactivo</CardTitle>
          <p class="text-sm text-muted-foreground">
            Ajusta la concentración y volumen para ver cómo cambian las propiedades de la mezcla.
          </p>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Controles -->
            <div class="space-y-5">
              <!-- Slider % etanol -->
              <div class="space-y-2">
                <div class="flex justify-between items-baseline">
                  <Label class="text-sm font-medium">Concentración de etanol</Label>
                  <span class="font-mono font-bold text-lg text-primary">{{ mixEthanol }}% v/v</span>
                </div>
                <input
                  v-model.number="mixEthanol"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div class="flex justify-between text-[10px] text-muted-foreground">
                  <span>0% (agua pura)</span>
                  <span>50%</span>
                  <span>100% (etanol puro)</span>
                </div>
              </div>

              <!-- Slider volumen -->
              <div class="space-y-2">
                <div class="flex justify-between items-baseline">
                  <Label class="text-sm font-medium">Volumen total</Label>
                  <span class="font-mono font-bold text-lg">{{ mixVolume }} mL</span>
                </div>
                <input
                  v-model.number="mixVolume"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  class="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div class="flex justify-between text-[10px] text-muted-foreground">
                  <span>10 mL</span>
                  <span>250 mL</span>
                  <span>500 mL</span>
                </div>
              </div>

              <!-- Propiedades calculadas -->
              <div class="grid grid-cols-2 gap-2">
                <div class="rounded-lg border p-3">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Densidad</span>
                  <span class="font-mono font-bold text-base">{{ mixDensity }}</span>
                  <span class="text-xs text-muted-foreground"> g/mL</span>
                </div>
                <div class="rounded-lg border p-3">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Gravedad esp.</span>
                  <span class="font-mono font-bold text-base">{{ mixGE }}</span>
                </div>
                <div class="rounded-lg border p-3">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Grados °GL</span>
                  <span class="font-mono font-bold text-base">{{ mixGL }}°</span>
                </div>
                <div class="rounded-lg border p-3">
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide block">Masa total</span>
                  <span class="font-mono font-bold text-base">{{ mixMass }}</span>
                  <span class="text-xs text-muted-foreground"> g</span>
                </div>
              </div>
            </div>

            <!-- Visualización del recipiente -->
            <div class="flex flex-col items-center gap-4">
              <!-- Probeta visual -->
              <div class="relative w-24 rounded-lg border-2 border-foreground/20 overflow-hidden" style="height: 240px">
                <!-- Agua -->
                <div
                  class="absolute bottom-0 left-0 right-0 transition-all duration-300 flex items-center justify-center"
                  :style="{
                    height: ((100 - mixEthanol) / 100) * 100 + '%',
                    backgroundColor: 'rgba(96, 165, 250, 0.35)'
                  }"
                >
                  <span v-if="mixEthanol < 90" class="text-[10px] font-mono font-medium text-blue-600">
                    {{ mixVolWater }} mL
                  </span>
                </div>
                <!-- Etanol (arriba, menos denso) -->
                <div
                  class="absolute left-0 right-0 transition-all duration-300 flex items-center justify-center"
                  :style="{
                    height: (mixEthanol / 100) * 100 + '%',
                    top: 0,
                    backgroundColor: 'rgba(251, 191, 36, 0.2)'
                  }"
                >
                  <span v-if="mixEthanol > 10" class="text-[10px] font-mono font-medium text-amber-600">
                    {{ mixVolEthanol }} mL
                  </span>
                </div>
                <!-- Nota: en realidad son miscibles, esto es didáctico -->

                <!-- Marcas de volumen -->
                <div class="absolute right-1 top-0 bottom-0 flex flex-col justify-between py-2">
                  <span class="text-[8px] text-muted-foreground font-mono">{{ mixVolume }}</span>
                  <span class="text-[8px] text-muted-foreground font-mono">{{ (mixVolume/2).toFixed(0) }}</span>
                  <span class="text-[8px] text-muted-foreground font-mono">0</span>
                </div>
              </div>

              <!-- Leyenda -->
              <div class="flex gap-4 text-xs">
                <span class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-sm bg-amber-400/30 border border-amber-400/50"></span>
                  Etanol
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-sm bg-blue-400/40 border border-blue-400/50"></span>
                  Agua
                </span>
              </div>

              <p class="text-[10px] text-muted-foreground text-center max-w-xs">
                Nota: El etanol y el agua son miscibles (se mezclan en cualquier proporción). La separación visual es solo didáctica.
              </p>

              <!-- Bebidas comunes -->
              <div class="w-full">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide block mb-2">Presets de bebidas comunes</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="b in [
                      { name: 'Cerveza', pct: 5 },
                      { name: 'Vino', pct: 12 },
                      { name: 'Ron', pct: 40 },
                      { name: 'Vodka', pct: 40 },
                      { name: 'Whisky', pct: 43 },
                      { name: 'Tequila', pct: 38 },
                      { name: 'Absenta', pct: 70 },
                      { name: 'Everclear', pct: 95 }
                    ]"
                    :key="b.name"
                    class="rounded-md border px-2 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                    @click="mixEthanol = b.pct"
                  >
                    {{ b.name }} ({{ b.pct }}°)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════ FACTOR UNITARIO ═══════════════ -->
    <div v-if="activeSection === 'factorUnitario'" class="space-y-4">
      <!-- Filtro por categoría -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="cat in categorias"
          :key="cat.id"
          class="rounded-md border px-2.5 py-1 text-[11px] font-medium transition-all"
          :class="filtroCategoria === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'"
          @click="filtroCategoria = cat.id"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        <!-- Lista de problemas -->
        <div class="space-y-1.5 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2">
          <button
            v-for="p in problemasFiltrados"
            :key="p.id"
            class="w-full text-left rounded-lg border p-3 transition-all"
            :class="activeProblemaId === p.id ? 'ring-2 ring-primary bg-primary/5 border-primary/30' : 'hover:bg-muted/30'"
            @click="seleccionarProblema(p.id)"
          >
            <div class="flex items-start gap-2">
              <span class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold mt-0.5">{{ p.id }}</span>
              <div class="min-w-0">
                <p class="text-xs font-medium leading-snug">{{ p.titulo }}</p>
                <Badge variant="outline" class="text-[9px] mt-1">{{ p.categoria }}</Badge>
              </div>
            </div>
          </button>
        </div>

        <!-- Detalle del problema -->
        <Card v-if="problemaActual">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" class="text-[10px]">Problema {{ problemaActual.id }}</Badge>
              <Badge variant="outline" class="text-[10px]">{{ problemaActual.categoria }}</Badge>
            </div>
            <CardTitle class="text-base mt-1">{{ problemaActual.titulo }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Enunciado -->
            <div class="rounded-lg bg-muted/30 p-4">
              <p class="text-sm leading-relaxed font-medium">{{ problemaActual.enunciado }}</p>
            </div>

            <!-- Datos e incógnita -->
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-lg border p-3">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">Datos</span>
                <ul class="space-y-0.5">
                  <li v-for="(d, i) in problemaActual.datos" :key="i" class="text-xs font-mono flex items-start gap-1.5">
                    <span class="text-primary mt-0.5">-</span> {{ d }}
                  </li>
                </ul>
              </div>
              <div class="rounded-lg border p-3">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1.5">Incógnita</span>
                <p class="text-sm font-mono font-bold text-primary">{{ problemaActual.incognita }}</p>
              </div>
            </div>

            <!-- Cadena de factores unitarios -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Cadena de factores unitarios</span>
                <div class="flex gap-1.5">
                  <button
                    class="rounded-md border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                    :disabled="revealedSteps >= problemaActual.cadena.length && showRespuesta"
                    @click="revelarSiguientePaso"
                  >
                    {{ revealedSteps >= problemaActual.cadena.length ? (showRespuesta ? 'Completo' : 'Ver resultado') : 'Siguiente paso' }}
                  </button>
                  <button
                    class="rounded-md border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                    @click="revelarTodo"
                  >
                    Ver todo
                  </button>
                </div>
              </div>

              <!-- Visualización de la cadena -->
              <div class="rounded-xl border bg-muted/5 p-4 overflow-x-auto">
                <div class="flex items-center gap-1 min-w-max">
                  <template v-for="(paso, i) in problemaActual.cadena" :key="i">
                    <!-- Valor inicial o multiplicador -->
                    <div v-if="i <= revealedSteps - 1" class="shrink-0 transition-all duration-300">
                      <!-- Primer paso: valor de inicio -->
                      <template v-if="i === 0 && paso.factor === null">
                        <div class="rounded-lg bg-primary/10 border border-primary/30 px-3 py-2 text-center">
                          <span class="font-mono font-bold text-sm text-primary">{{ paso.valor }}</span>
                        </div>
                      </template>
                      <!-- Factor unitario como fracción -->
                      <template v-else-if="paso.factor">
                        <div class="flex items-center gap-1">
                          <span class="text-lg font-bold text-muted-foreground mx-1">×</span>
                          <div class="rounded-lg border bg-card px-3 py-1 text-center min-w-[80px]">
                            <div class="font-mono text-xs font-semibold border-b border-foreground/20 pb-0.5 mb-0.5">
                              {{ paso.factor.num }}
                            </div>
                            <div class="font-mono text-xs text-muted-foreground">
                              {{ paso.factor.den }}
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>

                <!-- Unidades que se cancelan -->
                <div v-if="revealedSteps > 1" class="mt-3 flex flex-wrap gap-1.5">
                  <span class="text-[10px] text-muted-foreground mr-1">Se cancelan:</span>
                  <template v-for="(paso, i) in problemaActual.cadena.slice(0, revealedSteps)" :key="'cancel-'+i">
                    <span
                      v-if="paso.cancelaAnterior"
                      class="inline-flex items-center rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-mono text-red-500 line-through"
                    >
                      {{ paso.cancelaAnterior }}
                    </span>
                  </template>
                </div>
              </div>

              <!-- Explicación de cada paso revelado -->
              <div class="mt-3 space-y-2">
                <div
                  v-for="(paso, i) in problemaActual.cadena.slice(0, revealedSteps)"
                  :key="'exp-'+i"
                  class="flex gap-2.5 items-start"
                >
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    :class="i === 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'"
                  >{{ i + 1 }}</div>
                  <div class="min-w-0">
                    <p class="text-xs text-muted-foreground leading-relaxed">{{ paso.descripcion }}</p>
                    <p v-if="paso.cancelaAnterior" class="text-[10px] text-red-500 mt-0.5">
                      Se cancela: <span class="line-through font-mono">{{ paso.cancelaAnterior }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resultado final -->
            <div v-if="showRespuesta" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
              <div>
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Cálculo</span>
                <p class="font-mono text-xs text-muted-foreground mt-1">{{ problemaActual.resultado }}</p>
              </div>
              <div class="border-t pt-2">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Respuesta</span>
                <p class="font-mono font-bold text-lg text-primary mt-0.5">{{ problemaActual.respuesta }}</p>
              </div>
            </div>

            <!-- Tip didáctico -->
            <div v-if="!showRespuesta && revealedSteps === 0" class="rounded-lg border border-dashed p-3 text-xs text-muted-foreground space-y-1">
              <p class="font-medium text-foreground">Tip: ¿Cómo armar la cadena?</p>
              <ol class="list-decimal pl-4 space-y-0.5">
                <li>Identifica las unidades de lo que buscas (la incógnita).</li>
                <li>Empieza con un dato que tenga alguna de las unidades necesarias.</li>
                <li>Agrega factores de conversión donde las unidades del denominador cancelen las del numerador anterior.</li>
                <li>Repite hasta que solo queden las unidades de la respuesta.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- ═══════════════ RESOLVER PROBLEMAS ═══════════════ -->
    <div v-if="activeSection === 'problemas'" class="space-y-4">
      <!-- Selector de tipo de problema -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="pt in problemTypes"
          :key="pt.id"
          class="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all"
          :class="activeProblem === pt.id
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-muted'"
          @click="activeProblem = pt.id"
        >
          {{ pt.label }}
        </button>
      </div>

      <!-- ── Dilución C₁V₁ = C₂V₂ ── -->
      <Card v-if="activeProblem === 'dilucion'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Dilución: C₁V₁ = C₂V₂</CardTitle>
          <p class="text-sm text-muted-foreground">
            Calcula cualquier variable de la ecuación de dilución. Selecciona la incógnita y llena los otros 3 valores.
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            C₁ × V₁ = C₂ × V₂
          </div>
          <!-- Selector incógnita -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-muted-foreground">Resolver para:</span>
            <button v-for="opt in [{id:'c1',l:'C₁'},{id:'v1',l:'V₁'},{id:'c2',l:'C₂'},{id:'v2',l:'V₂'}]" :key="opt.id"
              class="rounded-md border px-2.5 py-1 text-xs font-mono font-bold transition-all"
              :class="dilTarget === opt.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="dilTarget = opt.id"
            >{{ opt.l }}</button>
          </div>
          <!-- Inputs -->
          <div class="grid grid-cols-2 gap-3">
            <div v-if="dilTarget !== 'c1'" class="space-y-1">
              <Label class="text-xs">C₁ (concentración inicial)</Label>
              <Input v-model="dil.c1" type="number" step="any" placeholder="ej: 6" class="h-9 font-mono" />
            </div>
            <div v-if="dilTarget !== 'v1'" class="space-y-1">
              <Label class="text-xs">V₁ (volumen inicial, mL)</Label>
              <Input v-model="dil.v1" type="number" step="any" placeholder="ej: 25" class="h-9 font-mono" />
            </div>
            <div v-if="dilTarget !== 'c2'" class="space-y-1">
              <Label class="text-xs">C₂ (concentración final)</Label>
              <Input v-model="dil.c2" type="number" step="any" placeholder="ej: 0.5" class="h-9 font-mono" />
            </div>
            <div v-if="dilTarget !== 'v2'" class="space-y-1">
              <Label class="text-xs">V₂ (volumen final, mL)</Label>
              <Input v-model="dil.v2" type="number" step="any" placeholder="ej: 100" class="h-9 font-mono" />
            </div>
          </div>
          <!-- Resultado -->
          <div v-if="dilResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <div class="text-center">
              <span class="text-xs text-muted-foreground uppercase tracking-wide">Resultado</span>
              <p class="font-mono font-bold text-2xl text-primary">{{ dilResult.variable }} = {{ dilResult.val.toFixed(4) }} {{ dilResult.unit }}</p>
            </div>
            <div class="border-t pt-3">
              <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Paso a paso</span>
              <div class="mt-1.5 space-y-1">
                <p v-for="(s, i) in dilSteps" :key="i" class="text-sm font-mono" :class="i === dilSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">
                  {{ s }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── Mezcla de 2 soluciones ── -->
      <Card v-if="activeProblem === 'mezcla2'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Mezcla de dos soluciones</CardTitle>
          <p class="text-sm text-muted-foreground">
            Al mezclar dos soluciones de distinta concentración, calcula la concentración final.
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            C₁V₁ + C₂V₂ = C_f × V_f
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <Label class="text-xs">C₁ (concentración sol. 1)</Label>
              <Input v-model="mix2.c1" type="number" step="any" placeholder="ej: 2" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">V₁ (volumen sol. 1, mL)</Label>
              <Input v-model="mix2.v1" type="number" step="any" placeholder="ej: 50" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">C₂ (concentración sol. 2)</Label>
              <Input v-model="mix2.c2" type="number" step="any" placeholder="ej: 0.5" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">V₂ (volumen sol. 2, mL)</Label>
              <Input v-model="mix2.v2" type="number" step="any" placeholder="ej: 150" class="h-9 font-mono" />
            </div>
          </div>
          <!-- Visual de la mezcla -->
          <div v-if="mix2Result" class="flex items-center justify-center gap-3 flex-wrap">
            <div class="text-center">
              <div class="w-10 rounded border-2 bg-blue-400/30" :style="{ height: Math.max(20, parseFloat(mix2.v1) / 3) + 'px' }"></div>
              <p class="text-[10px] font-mono mt-1">{{ mix2.v1 }} mL</p>
              <p class="text-[10px] font-mono text-muted-foreground">C={{ mix2.c1 }}</p>
            </div>
            <span class="text-lg font-bold text-muted-foreground">+</span>
            <div class="text-center">
              <div class="w-10 rounded border-2 bg-amber-400/30" :style="{ height: Math.max(20, parseFloat(mix2.v2) / 3) + 'px' }"></div>
              <p class="text-[10px] font-mono mt-1">{{ mix2.v2 }} mL</p>
              <p class="text-[10px] font-mono text-muted-foreground">C={{ mix2.c2 }}</p>
            </div>
            <span class="text-lg font-bold text-muted-foreground">=</span>
            <div class="text-center">
              <div class="w-12 rounded border-2 bg-green-400/30" :style="{ height: Math.max(20, mix2Result.vf / 3) + 'px' }"></div>
              <p class="text-[10px] font-mono mt-1">{{ mix2Result.vf.toFixed(1) }} mL</p>
              <p class="text-[10px] font-mono font-bold text-primary">C={{ mix2Result.cf.toFixed(4) }}</p>
            </div>
          </div>
          <!-- Resultado -->
          <div v-if="mix2Result" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3 text-center">
              <div>
                <span class="text-[10px] text-muted-foreground">Volumen final</span>
                <p class="font-mono font-bold text-lg">{{ mix2Result.vf.toFixed(2) }} mL</p>
              </div>
              <div>
                <span class="text-[10px] text-muted-foreground">Concentración final</span>
                <p class="font-mono font-bold text-lg text-primary">{{ mix2Result.cf.toFixed(4) }}</p>
              </div>
            </div>
            <div class="border-t pt-3">
              <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Paso a paso</span>
              <div class="mt-1.5 space-y-1">
                <p v-for="(s, i) in mix2Steps" :key="i" class="text-sm font-mono" :class="i === mix2Steps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── % masa (m/m) ── -->
      <Card v-if="activeProblem === 'pctMasa'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Porcentaje masa/masa (%m/m)</CardTitle>
          <p class="text-sm text-muted-foreground">Gramos de soluto por cada 100 g de solución.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            %m/m = (m<sub>soluto</sub> / m<sub>solución</sub>) × 100
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-muted-foreground">Resolver para:</span>
            <button v-for="opt in [{id:'pct',l:'%m/m'},{id:'mSoluto',l:'m_soluto'},{id:'mSolucion',l:'m_solución'}]" :key="opt.id"
              class="rounded-md border px-2.5 py-1 text-xs font-mono font-bold transition-all"
              :class="pctMTarget === opt.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="pctMTarget = opt.id"
            >{{ opt.l }}</button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-if="pctMTarget !== 'mSoluto'" class="space-y-1">
              <Label class="text-xs">Masa del soluto (g)</Label>
              <Input v-model="pctM.mSoluto" type="number" step="any" placeholder="ej: 20" class="h-9 font-mono" />
            </div>
            <div v-if="pctMTarget !== 'mSolucion'" class="space-y-1">
              <Label class="text-xs">Masa de la solución (g)</Label>
              <Input v-model="pctM.mSolucion" type="number" step="any" placeholder="ej: 200" class="h-9 font-mono" />
            </div>
            <div v-if="pctMTarget !== 'pct'" class="space-y-1">
              <Label class="text-xs">% m/m</Label>
              <Input v-model="pctM.pct" type="number" step="any" placeholder="ej: 10" class="h-9 font-mono" />
            </div>
          </div>
          <div v-if="pctMResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">{{ pctMResult.variable }} = {{ pctMResult.val.toFixed(4) }} {{ pctMResult.unit }}</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in pctMSteps" :key="i" class="text-sm font-mono" :class="i === pctMSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── % volumen (v/v) ── -->
      <Card v-if="activeProblem === 'pctVol'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Porcentaje volumen/volumen (%v/v)</CardTitle>
          <p class="text-sm text-muted-foreground">mL de soluto por cada 100 mL de solución. Equivale a °GL a 15,56°C.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            %v/v = (V<sub>soluto</sub> / V<sub>solución</sub>) × 100
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-muted-foreground">Resolver para:</span>
            <button v-for="opt in [{id:'pct',l:'%v/v'},{id:'vSoluto',l:'V_soluto'},{id:'vSolucion',l:'V_solución'}]" :key="opt.id"
              class="rounded-md border px-2.5 py-1 text-xs font-mono font-bold transition-all"
              :class="pctVTarget === opt.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="pctVTarget = opt.id"
            >{{ opt.l }}</button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-if="pctVTarget !== 'vSoluto'" class="space-y-1">
              <Label class="text-xs">Volumen del soluto (mL)</Label>
              <Input v-model="pctV.vSoluto" type="number" step="any" placeholder="ej: 40" class="h-9 font-mono" />
            </div>
            <div v-if="pctVTarget !== 'vSolucion'" class="space-y-1">
              <Label class="text-xs">Volumen de la solución (mL)</Label>
              <Input v-model="pctV.vSolucion" type="number" step="any" placeholder="ej: 100" class="h-9 font-mono" />
            </div>
            <div v-if="pctVTarget !== 'pct'" class="space-y-1">
              <Label class="text-xs">% v/v</Label>
              <Input v-model="pctV.pct" type="number" step="any" placeholder="ej: 40" class="h-9 font-mono" />
            </div>
          </div>
          <div v-if="pctVResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">{{ pctVResult.variable }} = {{ pctVResult.val.toFixed(4) }} {{ pctVResult.unit }}</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in pctVSteps" :key="i" class="text-sm font-mono" :class="i === pctVSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── % m/v ── -->
      <Card v-if="activeProblem === 'pctMasaVol'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Porcentaje masa/volumen (%m/v)</CardTitle>
          <p class="text-sm text-muted-foreground">Gramos de soluto por cada 100 mL de solución.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            %m/v = (m<sub>soluto</sub> [g] / V<sub>solución</sub> [mL]) × 100
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-muted-foreground">Resolver para:</span>
            <button v-for="opt in [{id:'pct',l:'%m/v'},{id:'mSoluto',l:'m_soluto'},{id:'vSolucion',l:'V_solución'}]" :key="opt.id"
              class="rounded-md border px-2.5 py-1 text-xs font-mono font-bold transition-all"
              :class="pctMVTarget === opt.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="pctMVTarget = opt.id"
            >{{ opt.l }}</button>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-if="pctMVTarget !== 'mSoluto'" class="space-y-1">
              <Label class="text-xs">Masa del soluto (g)</Label>
              <Input v-model="pctMV.mSoluto" type="number" step="any" placeholder="ej: 5" class="h-9 font-mono" />
            </div>
            <div v-if="pctMVTarget !== 'vSolucion'" class="space-y-1">
              <Label class="text-xs">Volumen de la solución (mL)</Label>
              <Input v-model="pctMV.vSolucion" type="number" step="any" placeholder="ej: 250" class="h-9 font-mono" />
            </div>
            <div v-if="pctMVTarget !== 'pct'" class="space-y-1">
              <Label class="text-xs">% m/v</Label>
              <Input v-model="pctMV.pct" type="number" step="any" placeholder="ej: 2" class="h-9 font-mono" />
            </div>
          </div>
          <div v-if="pctMVResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">{{ pctMVResult.variable }} = {{ pctMVResult.val.toFixed(4) }} {{ pctMVResult.unit }}</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in pctMVSteps" :key="i" class="text-sm font-mono" :class="i === pctMVSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── Molaridad ── -->
      <Card v-if="activeProblem === 'molaridad'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Molaridad (M = mol/L)</CardTitle>
          <p class="text-sm text-muted-foreground">Moles de soluto por litro de solución.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            M = n / V = (m / MM) / V
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1">
              <Label class="text-xs">Masa del soluto (g)</Label>
              <Input v-model="mol.masaSoluto" type="number" step="any" placeholder="ej: 58.44" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Masa molar (g/mol)</Label>
              <Input v-model="mol.mmSoluto" type="number" step="any" placeholder="ej: 58.44" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Volumen solución (L)</Label>
              <Input v-model="mol.volLitros" type="number" step="any" placeholder="ej: 0.5" class="h-9 font-mono" />
            </div>
          </div>
          <div v-if="molResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">M = {{ molResult.val.toFixed(4) }} mol/L</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in molSteps" :key="i" class="text-sm font-mono" :class="i === molSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── Densidad → Molaridad ── -->
      <Card v-if="activeProblem === 'densidadConc'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">De densidad y %m/m a Molaridad</CardTitle>
          <p class="text-sm text-muted-foreground">
            Útil para soluciones comerciales concentradas (HCl, H₂SO₄, HNO₃) donde se conoce ρ y %m/m.
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            M = (ρ × %m/m × 10) / MM
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="space-y-1">
              <Label class="text-xs">Densidad ρ (g/mL)</Label>
              <Input v-model="denConc.densidad" type="number" step="any" placeholder="ej: 1.19" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">% m/m</Label>
              <Input v-model="denConc.pctMM" type="number" step="any" placeholder="ej: 37" class="h-9 font-mono" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">Masa molar (g/mol)</Label>
              <Input v-model="denConc.mm" type="number" step="any" placeholder="ej: 36.46" class="h-9 font-mono" />
            </div>
          </div>
          <!-- Presets de ácidos comunes -->
          <div>
            <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Presets de reactivos comunes</span>
            <div class="flex flex-wrap gap-1.5 mt-1.5">
              <button v-for="preset in [
                { name: 'HCl conc.', rho: '1.19', pct: '37', mm: '36.46' },
                { name: 'H₂SO₄ conc.', rho: '1.84', pct: '96', mm: '98.08' },
                { name: 'HNO₃ conc.', rho: '1.42', pct: '70', mm: '63.01' },
                { name: 'H₃PO₄ conc.', rho: '1.69', pct: '85', mm: '98.00' },
                { name: 'CH₃COOH glac.', rho: '1.05', pct: '99.7', mm: '60.05' },
                { name: 'NH₃ conc.', rho: '0.90', pct: '28', mm: '17.03' }
              ]" :key="preset.name"
                class="rounded-md border px-2 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                @click="denConc.densidad = preset.rho; denConc.pctMM = preset.pct; denConc.mm = preset.mm"
              >{{ preset.name }}</button>
            </div>
          </div>
          <div v-if="denConcResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">M = {{ denConcResult.M.toFixed(4) }} mol/L</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in denConcSteps" :key="i" class="text-sm font-mono" :class="i === denConcSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- ── ppm ── -->
      <Card v-if="activeProblem === 'ppm'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Partes por millón (ppm)</CardTitle>
          <p class="text-sm text-muted-foreground">
            Equivalente a mg/kg (sólidos) o mg/L (soluciones acuosas diluidas donde ρ ≈ 1).
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs text-muted-foreground">Modo:</span>
            <button
              class="rounded-md border px-2.5 py-1 text-xs font-medium transition-all"
              :class="ppmMode === 'masaMasa' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="ppmMode = 'masaMasa'"
            >mg/kg (masa/masa)</button>
            <button
              class="rounded-md border px-2.5 py-1 text-xs font-medium transition-all"
              :class="ppmMode === 'masaVol' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
              @click="ppmMode = 'masaVol'"
            >mg/L (masa/vol)</button>
          </div>
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-base">
            ppm = mg<sub>soluto</sub> / {{ ppmMode === 'masaMasa' ? 'kg' : 'L' }}<sub>solución</sub>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <Label class="text-xs">Masa del soluto (mg)</Label>
              <Input v-model="ppmCalc.masa" type="number" step="any" placeholder="ej: 5" class="h-9 font-mono" />
            </div>
            <div v-if="ppmMode === 'masaMasa'" class="space-y-1">
              <Label class="text-xs">Masa de la solución (kg)</Label>
              <Input v-model="ppmCalc.masaTotal" type="number" step="any" placeholder="ej: 1" class="h-9 font-mono" />
            </div>
            <div v-else class="space-y-1">
              <Label class="text-xs">Volumen de la solución (L)</Label>
              <Input v-model="ppmCalc.volLitros" type="number" step="any" placeholder="ej: 1" class="h-9 font-mono" />
            </div>
          </div>
          <div v-if="ppmResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">{{ ppmResult.val.toFixed(4) }} ppm ({{ ppmResult.unit }})</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in ppmSteps" :key="i" class="text-sm font-mono" :class="i === ppmSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Referencia rápida de fórmulas -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm">Referencia rápida de fórmulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div v-for="pt in problemTypes" :key="pt.id"
              class="rounded-lg border p-2.5 cursor-pointer hover:bg-muted/30 transition-colors"
              @click="activeProblem = pt.id"
            >
              <p class="text-xs font-medium">{{ pt.label }}</p>
              <code class="text-[10px] text-muted-foreground font-mono">{{ pt.formula }}</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════ MÉTODOS DE SEPARACIÓN ═══════════════ -->
    <div v-if="activeSection === 'separacion'" class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Métodos de separación de mezclas</CardTitle>
          <p class="text-sm text-muted-foreground">
            Selecciona un método para ver su principio, pasos y cuándo se usa.
          </p>
        </CardHeader>
        <CardContent>
          <!-- Grid de métodos -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            <button
              v-for="m in separationMethods"
              :key="m.id"
              class="rounded-lg border p-3 text-left transition-all hover:bg-muted/30"
              :class="activeSepMethod === m.id ? 'ring-2 ring-primary bg-primary/5 border-primary/30' : ''"
              @click="activeSepMethod = activeSepMethod === m.id ? null : m.id"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">{{ m.icon }}</span>
                <span class="font-medium text-sm leading-tight">{{ m.name }}</span>
              </div>
              <p class="text-[10px] text-muted-foreground leading-snug">{{ m.applies }}</p>
              <Badge v-if="m.usedInP3" variant="secondary" class="mt-1.5 text-[9px]">Usada en P3</Badge>
            </button>
          </div>

          <!-- Detalle del método -->
          <div v-if="activeSepMethod" class="rounded-xl border p-4 space-y-4 bg-muted/5">
            <template v-for="m in separationMethods.filter(x => x.id === activeSepMethod)" :key="m.id">
              <div class="flex items-start gap-3">
                <span class="text-2xl">{{ m.icon }}</span>
                <div>
                  <h3 class="font-bold text-base">{{ m.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ m.principle }}</p>
                </div>
              </div>

              <div>
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Ejemplo</span>
                <p class="text-sm font-medium mt-0.5">{{ m.example }}</p>
              </div>

              <!-- Pasos -->
              <div>
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Pasos del proceso</span>
                <div class="mt-2 space-y-1.5">
                  <div
                    v-for="(step, i) in m.steps"
                    :key="i"
                    class="flex gap-2.5 items-start"
                  >
                    <div
                      class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    >
                      {{ i + 1 }}
                    </div>
                    <p class="text-sm">{{ step }}</p>
                  </div>
                </div>
              </div>

              <!-- Pros/Cons -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Ventajas</span>
                  <ul class="mt-1 space-y-0.5">
                    <li v-for="(p, i) in m.pros" :key="i" class="text-xs flex gap-1.5 items-start">
                      <span class="text-green-500 mt-0.5">+</span> {{ p }}
                    </li>
                  </ul>
                </div>
                <div>
                  <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Limitaciones</span>
                  <ul class="mt-1 space-y-0.5">
                    <li v-for="(c, i) in m.cons" :key="i" class="text-xs flex gap-1.5 items-start">
                      <span class="text-red-400 mt-0.5">−</span> {{ c }}
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════ CONCEPTOS CLAVE ═══════════════ -->
    <div v-if="activeSection === 'conceptos'" class="space-y-4">
      <!-- Navegación de conceptos -->
      <div class="flex gap-1.5 overflow-x-auto pb-1">
        <button
          v-for="(c, i) in concepts"
          :key="i"
          class="rounded-lg border px-3 py-2 text-[11px] font-medium transition-all whitespace-nowrap shrink-0"
          :class="activeConceptIndex === i
            ? 'bg-primary text-primary-foreground border-primary'
            : 'hover:bg-muted'"
          @click="activeConceptIndex = i"
        >
          {{ c.title }}
        </button>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <div class="flex items-center gap-2">
            <Badge variant="outline" class="text-[10px]">{{ activeConceptIndex + 1 }} / {{ concepts.length }}</Badge>
            <CardTitle class="text-base">{{ concepts[activeConceptIndex].title }}</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm leading-relaxed">{{ concepts[activeConceptIndex].content }}</p>

          <!-- Visualizaciones específicas por concepto -->

          <!-- Homogénea vs heterogénea -->
          <div v-if="concepts[activeConceptIndex].visual === 'homogenea'" class="grid grid-cols-2 gap-4">
            <div class="rounded-xl border p-4 text-center space-y-2">
              <div class="mx-auto w-16 h-20 rounded-lg border-2 overflow-hidden">
                <div class="w-full h-full bg-blue-300/40"></div>
              </div>
              <Badge variant="secondary">Homogénea</Badge>
              <p class="text-[10px] text-muted-foreground">Una sola fase visible. Ej: agua + etanol, aire</p>
            </div>
            <div class="rounded-xl border p-4 text-center space-y-2">
              <div class="mx-auto w-16 h-20 rounded-lg border-2 overflow-hidden">
                <div class="w-full h-1/2 bg-amber-300/40"></div>
                <div class="w-full h-1/2 bg-blue-300/50 border-t-2 border-dashed border-foreground/20"></div>
              </div>
              <Badge variant="secondary">Heterogénea</Badge>
              <p class="text-[10px] text-muted-foreground">Fases visibles. Ej: agua + aceite, arena + agua</p>
            </div>
          </div>

          <!-- Propiedad intensiva -->
          <div v-if="concepts[activeConceptIndex].visual === 'intensiva'" class="flex items-end justify-center gap-6">
            <div class="text-center space-y-1">
              <div class="mx-auto w-8 h-12 rounded border-2 bg-blue-300/30"></div>
              <p class="text-xs font-mono">10 mL</p>
              <p class="text-xs font-bold text-primary">40% v/v</p>
            </div>
            <span class="text-xl font-bold text-muted-foreground mb-4">=</span>
            <div class="text-center space-y-1">
              <div class="mx-auto w-12 h-16 rounded border-2 bg-blue-300/30"></div>
              <p class="text-xs font-mono">100 mL</p>
              <p class="text-xs font-bold text-primary">40% v/v</p>
            </div>
            <span class="text-xl font-bold text-muted-foreground mb-4">=</span>
            <div class="text-center space-y-1">
              <div class="mx-auto w-16 h-20 rounded border-2 bg-blue-300/30"></div>
              <p class="text-xs font-mono">1000 mL</p>
              <p class="text-xs font-bold text-primary">40% v/v</p>
            </div>
          </div>

          <!-- % v/v -->
          <div v-if="concepts[activeConceptIndex].visual === 'vv'" class="space-y-3">
            <div class="flex items-center gap-3 justify-center">
              <div class="text-center">
                <div class="mx-auto w-12 h-16 rounded border-2 overflow-hidden">
                  <div class="w-full bg-amber-300/40" style="height: 40%"></div>
                  <div class="w-full bg-blue-300/40" style="height: 60%"></div>
                </div>
                <p class="text-xs font-mono mt-1">100 mL</p>
              </div>
              <div class="text-center space-y-1">
                <p class="text-sm font-mono">= <span class="font-bold text-amber-600">40 mL etanol</span></p>
                <p class="text-sm font-mono">+ <span class="font-bold text-blue-600">60 mL agua</span></p>
                <p class="text-xs text-muted-foreground mt-2">→ 40% v/v = 40°GL</p>
              </div>
            </div>
          </div>

          <!-- GE -->
          <div v-if="concepts[activeConceptIndex].visual === 'ge'" class="space-y-2">
            <div class="rounded-lg bg-muted/30 p-4 font-mono text-center space-y-1">
              <p class="text-base">GE = <span class="font-bold">ρ<sub>destilado</sub></span> / <span class="font-bold">ρ<sub>agua</sub></span></p>
              <p class="text-xs text-muted-foreground">Ambas a 15,56°C</p>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div class="rounded-lg border p-2">
                <p class="font-mono font-bold text-base">1.0000</p>
                <p class="text-muted-foreground">Agua pura</p>
              </div>
              <div class="rounded-lg border p-2">
                <p class="font-mono font-bold text-base">0.9481</p>
                <p class="text-muted-foreground">40% etanol</p>
              </div>
              <div class="rounded-lg border p-2">
                <p class="font-mono font-bold text-base">0.7908</p>
                <p class="text-muted-foreground">100% etanol</p>
              </div>
            </div>
          </div>

          <!-- Azeótropo -->
          <div v-if="concepts[activeConceptIndex].visual === 'azeotropo'" class="space-y-3">
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <div class="text-center p-3 rounded-lg bg-muted/30 min-w-[70px]">
                <p class="text-2xl font-bold text-blue-500">0%</p>
                <p class="text-[10px] text-muted-foreground">Agua pura</p>
                <p class="text-[10px]">100°C</p>
              </div>
              <div class="text-muted-foreground text-xs">→ destilación →</div>
              <div class="text-center p-3 rounded-lg border-2 border-red-400/50 bg-red-50/50 dark:bg-red-950/20 min-w-[90px]">
                <Badge variant="destructive" class="text-[9px] mb-1">Azeótropo</Badge>
                <p class="text-2xl font-bold text-red-500">95.6%</p>
                <p class="text-[10px]">78.2°C</p>
                <p class="text-[10px] text-muted-foreground">LÍMITE</p>
              </div>
              <div class="text-muted-foreground text-xs">✗ no pasa ✗</div>
              <div class="text-center p-3 rounded-lg bg-muted/30 opacity-40 min-w-[70px]">
                <p class="text-2xl font-bold">100%</p>
                <p class="text-[10px] text-muted-foreground">Etanol abs.</p>
                <p class="text-[10px]">78.4°C</p>
              </div>
            </div>
          </div>

          <!-- Contracorriente -->
          <div v-if="concepts[activeConceptIndex].visual === 'contracorriente'" class="space-y-2">
            <div class="mx-auto max-w-xs rounded-xl border p-4 bg-muted/10">
              <div class="flex items-stretch gap-4 justify-center">
                <!-- Tubo condensador vertical -->
                <div class="w-12 h-40 rounded-lg border-2 relative overflow-hidden">
                  <!-- Vapor caliente baja -->
                  <div class="absolute left-0 w-1/2 h-full flex flex-col items-center justify-start pt-2">
                    <span class="text-[8px] text-red-500 font-bold">VAPOR</span>
                    <span class="text-red-400 text-sm">↓</span>
                    <span class="text-red-400 text-sm">↓</span>
                    <span class="text-amber-400 text-sm">↓</span>
                    <span class="text-blue-400 text-sm">↓</span>
                  </div>
                  <!-- Agua fría sube -->
                  <div class="absolute right-0 w-1/2 h-full flex flex-col items-center justify-end pb-2">
                    <span class="text-blue-400 text-sm">↑</span>
                    <span class="text-blue-400 text-sm">↑</span>
                    <span class="text-cyan-400 text-sm">↑</span>
                    <span class="text-cyan-300 text-sm">↑</span>
                    <span class="text-[8px] text-blue-500 font-bold">AGUA</span>
                  </div>
                </div>
                <!-- Labels -->
                <div class="flex flex-col justify-between text-[10px] py-1">
                  <div>
                    <p class="font-medium text-red-500">Entrada vapor</p>
                    <p class="text-muted-foreground">~78°C (caliente)</p>
                  </div>
                  <div>
                    <p class="font-medium text-primary">Máx. gradiente</p>
                    <p class="text-muted-foreground">ΔT grande siempre</p>
                  </div>
                  <div>
                    <p class="font-medium text-blue-500">Entrada agua</p>
                    <p class="text-muted-foreground">~5°C (fría)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Velocidad -->
          <div v-if="concepts[activeConceptIndex].visual === 'velocidad'" class="grid grid-cols-3 gap-3">
            <div class="rounded-lg border p-3 text-center space-y-1 border-red-300/50">
              <span class="text-lg">💨</span>
              <p class="text-xs font-bold text-red-500">Muy rápida</p>
              <p class="text-[10px] text-muted-foreground">Arrastre de gotas. Baja pureza.</p>
            </div>
            <div class="rounded-lg border-2 border-green-400/50 p-3 text-center space-y-1 bg-green-50/30 dark:bg-green-950/10">
              <span class="text-lg">💧</span>
              <p class="text-xs font-bold text-green-600">Óptima</p>
              <p class="text-[10px] text-muted-foreground">1-2 gotas/s. Buen equilibrio.</p>
            </div>
            <div class="rounded-lg border p-3 text-center space-y-1 border-amber-300/50">
              <span class="text-lg">🐌</span>
              <p class="text-xs font-bold text-amber-500">Muy lenta</p>
              <p class="text-[10px] text-muted-foreground">Pérdida de tiempo. Evaporación.</p>
            </div>
          </div>

          <!-- Temperatura 15.56°C -->
          <div v-if="concepts[activeConceptIndex].visual === 'temperatura'" class="space-y-2">
            <div class="flex items-center justify-center gap-4 flex-wrap">
              <div class="rounded-lg border p-3 text-center">
                <p class="text-[10px] text-muted-foreground uppercase">Temperatura estándar</p>
                <p class="font-mono font-bold text-2xl text-primary">15.56°C</p>
                <p class="text-xs text-muted-foreground">= 60°F</p>
              </div>
              <div class="text-xs text-muted-foreground max-w-xs space-y-1">
                <p>Las tablas de GE y concentración están calibradas a esta temperatura.</p>
                <p>Si mides a otra T, la densidad cambia y el resultado será inexacto.</p>
                <p class="font-medium text-foreground">Por eso se enfría con baño de hielo antes de medir.</p>
              </div>
            </div>
          </div>

          <!-- Navegación prev/next -->
          <div class="flex justify-between pt-2 border-t">
            <button
              class="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              :disabled="activeConceptIndex === 0"
              @click="activeConceptIndex--"
            >
              ← Anterior
            </button>
            <button
              class="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              :disabled="activeConceptIndex === concepts.length - 1"
              @click="activeConceptIndex++"
            >
              Siguiente →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@keyframes bubble-rise {
  0% { transform: translateY(0); opacity: 0.8; }
  100% { transform: translateY(-20px); opacity: 0; }
}
@keyframes vapor-rise {
  0% { transform: translate(0, 0); opacity: 0.4; }
  100% { transform: translate(5px, -15px); opacity: 0; }
}
@keyframes drop-fall {
  0% { transform: translateY(0); opacity: 0.8; }
  100% { transform: translateY(10px); opacity: 0; }
}
@keyframes flicker {
  0%, 100% { transform: scaleY(1); opacity: 0.8; }
  50% { transform: scaleY(1.1) scaleX(0.95); opacity: 1; }
}
.animate-bubble {
  animation: bubble-rise 1.5s ease-out forwards;
}
.animate-vapor {
  animation: vapor-rise 2s ease-out forwards;
}
.animate-drop {
  animation: drop-fall 1s ease-in forwards;
}
.animate-flame {
  animation: flicker 0.3s ease-in-out infinite;
}
</style>

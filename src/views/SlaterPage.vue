<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Datos de elementos Z=1..36
// ──────────────────────────────────────────────
const elementSymbols = {
  1:'H', 2:'He', 3:'Li', 4:'Be', 5:'B', 6:'C', 7:'N', 8:'O', 9:'F', 10:'Ne',
  11:'Na', 12:'Mg', 13:'Al', 14:'Si', 15:'P', 16:'S', 17:'Cl', 18:'Ar',
  19:'K', 20:'Ca', 21:'Sc', 22:'Ti', 23:'V', 24:'Cr', 25:'Mn', 26:'Fe',
  27:'Co', 28:'Ni', 29:'Cu', 30:'Zn', 31:'Ga', 32:'Ge', 33:'As', 34:'Se',
  35:'Br', 36:'Kr'
}

const elementNames = {
  1:'Hidrógeno', 2:'Helio', 3:'Litio', 4:'Berilio', 5:'Boro', 6:'Carbono',
  7:'Nitrógeno', 8:'Oxígeno', 9:'Flúor', 10:'Neón', 11:'Sodio', 12:'Magnesio',
  13:'Aluminio', 14:'Silicio', 15:'Fósforo', 16:'Azufre', 17:'Cloro', 18:'Argón',
  19:'Potasio', 20:'Calcio', 21:'Escandio', 22:'Titanio', 23:'Vanadio', 24:'Cromo',
  25:'Manganeso', 26:'Hierro', 27:'Cobalto', 28:'Níquel', 29:'Cobre', 30:'Zinc',
  31:'Galio', 32:'Germanio', 33:'Arsénico', 34:'Selenio', 35:'Bromo', 36:'Kriptón'
}

// Configuraciones electrónicas: Z -> array de {orb, e}
const aufbauOrder = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p']
const maxElec = { s:2, p:6, d:10, f:14 }
const exceptions = {
  24: [['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['3d',5],['4s',1]],  // Cr
  29: [['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['3d',10],['4s',1]], // Cu
}

function getElectronConfig(z) {
  if (exceptions[z]) return exceptions[z].map(([orb,e]) => ({ orb, e }))
  const config = []
  let remaining = z
  for (const orb of aufbauOrder) {
    if (remaining <= 0) break
    const type = orb.slice(-1)
    const cap = maxElec[type]
    const e = Math.min(remaining, cap)
    config.push({ orb, e })
    remaining -= e
  }
  return config
}

// Grupos de Slater: mismos orbitales van juntos
const slaterGroups = ['1s','2s,2p','3s,3p','3d','4s,4p','4d','4f','5s,5p','5d','5f']

function getSlaterGroupIndex(orb) {
  for (let i = 0; i < slaterGroups.length; i++) {
    if (slaterGroups[i].split(',').includes(orb)) return i
  }
  return -1
}

function isDorF(orb) {
  return orb.endsWith('d') || orb.endsWith('f')
}

// Calcula sigma y Z* para un electrón en targetOrb del elemento Z
function calcSlater(z, targetOrb) {
  const config = getElectronConfig(z)
  const targetGroupIdx = getSlaterGroupIndex(targetOrb)
  if (targetGroupIdx === -1) return null
  const targetEntry = config.find(c => c.orb === targetOrb)
  if (!targetEntry) return null

  const targetIsDorF = isDorF(targetOrb)
  let sigma = 0
  const steps = []

  for (const c of config) {
    const groupIdx = getSlaterGroupIndex(c.orb)
    if (groupIdx === targetGroupIdx) {
      const factor = targetGroupIdx === 0 ? 0.30 : 0.35
      const otherE = c.orb === targetOrb ? c.e - 1 : c.e
      if (otherE > 0) {
        sigma += otherE * factor
        steps.push({ group: slaterGroups[groupIdx], e: otherE, factor, contrib: otherE * factor, tipo: 'mismo' })
      }
    } else if (groupIdx < targetGroupIdx) {
      if (targetIsDorF) {
        sigma += c.e * 1.00
        steps.push({ group: slaterGroups[groupIdx], e: c.e, factor: 1.00, contrib: c.e * 1.00, tipo: 'interno_df' })
      } else {
        const factor = groupIdx === targetGroupIdx - 1 ? 0.85 : 1.00
        sigma += c.e * factor
        steps.push({ group: slaterGroups[groupIdx], e: c.e, factor, contrib: c.e * factor, tipo: factor === 0.85 ? 'n1' : 'n2' })
      }
    }
  }

  return {
    z, orbital: targetOrb, sigma: +sigma.toFixed(4),
    zEff: +(z - sigma).toFixed(4),
    steps
  }
}

// ──────────────────────────────────────────────
// Calculadora interactiva
// ──────────────────────────────────────────────
const calcInput = ref('Fe')
const calcOrb = ref('3d')

const calcZ = computed(() => {
  const n = parseInt(calcInput.value)
  if (!isNaN(n) && n >= 1 && n <= 36) return n
  const sym = Object.entries(elementSymbols).find(([, s]) => s === calcInput.value)
  return sym ? parseInt(sym[0]) : null
})

const calcOrbitalesDisponibles = computed(() => {
  if (!calcZ.value) return []
  return getElectronConfig(calcZ.value).map(c => c.orb)
})

const calcResult = computed(() => {
  if (!calcZ.value || !calcOrb.value) return null
  return calcSlater(calcZ.value, calcOrb.value)
})

const ejemplosRapidos = [
  { label: 'H (1s)', sym: 'H', orb: '1s' },
  { label: 'Na (3s)', sym: 'Na', orb: '3s' },
  { label: 'Cl (3p)', sym: 'Cl', orb: '3p' },
  { label: 'Fe (3d)', sym: 'Fe', orb: '3d' },
  { label: 'Fe (4s)', sym: 'Fe', orb: '4s' },
  { label: 'Cu (3d)', sym: 'Cu', orb: '3d' },
  { label: 'Cu (4s)', sym: 'Cu', orb: '4s' },
  { label: 'Kr (4p)', sym: 'Kr', orb: '4p' },
]

// ──────────────────────────────────────────────
// Tabla de referencia Z* para todos los elementos
// ──────────────────────────────────────────────
const tablaZ1a18 = computed(() => {
  return Array.from({ length: 18 }, (_, i) => {
    const z = i + 1
    const config = getElectronConfig(z)
    const lastOrb = config[config.length - 1].orb
    const result = calcSlater(z, lastOrb)
    return {
      z, sym: elementSymbols[z], name: elementNames[z],
      lastOrb, sigma: result?.sigma ?? '—', zEff: result?.zEff ?? '—'
    }
  })
})

const tablaZ19a36 = computed(() => {
  return Array.from({ length: 18 }, (_, i) => {
    const z = i + 19
    const config = getElectronConfig(z)
    const lastOrb = config[config.length - 1].orb
    const result = calcSlater(z, lastOrb)
    return {
      z, sym: elementSymbols[z], name: elementNames[z],
      lastOrb, sigma: result?.sigma ?? '—', zEff: result?.zEff ?? '—'
    }
  })
})

// ──────────────────────────────────────────────
// Comparador de dos elementos
// ──────────────────────────────────────────────
const cmpA = ref('Na')
const cmpB = ref('Cl')
const cmpOrbA = ref('3s')
const cmpOrbB = ref('3p')

const cmpZA = computed(() => {
  const n = parseInt(cmpA.value)
  if (!isNaN(n) && n >= 1 && n <= 36) return n
  return Object.entries(elementSymbols).find(([, s]) => s === cmpA.value)?.[0] ? +Object.entries(elementSymbols).find(([, s]) => s === cmpA.value)[0] : null
})
const cmpZB = computed(() => {
  const n = parseInt(cmpB.value)
  if (!isNaN(n) && n >= 1 && n <= 36) return n
  return Object.entries(elementSymbols).find(([, s]) => s === cmpB.value)?.[0] ? +Object.entries(elementSymbols).find(([, s]) => s === cmpB.value)[0] : null
})

const cmpOrbsA = computed(() => cmpZA.value ? getElectronConfig(cmpZA.value).map(c => c.orb) : [])
const cmpOrbsB = computed(() => cmpZB.value ? getElectronConfig(cmpZB.value).map(c => c.orb) : [])
const cmpResultA = computed(() => cmpZA.value && cmpOrbA.value ? calcSlater(cmpZA.value, cmpOrbA.value) : null)
const cmpResultB = computed(() => cmpZB.value && cmpOrbB.value ? calcSlater(cmpZB.value, cmpOrbB.value) : null)

// ──────────────────────────────────────────────
// Quiz de Slater
// ──────────────────────────────────────────────
const preguntas = [
  {
    texto: 'En las reglas de Slater, ¿qué factor de apantallamiento se usa para electrones en el mismo grupo (s/p, no 1s)?',
    opciones: ['0.30', '0.35', '0.85', '1.00'],
    correcta: '0.35',
    hint: 'Los electrones en el mismo grupo se apantallan entre sí con factor 0.35. Para 1s es 0.30.'
  },
  {
    texto: 'Para un electrón en un orbital s o p, ¿qué factor tienen los electrones del grupo (n-1)?',
    opciones: ['0.35', '0.85', '1.00', '0.30'],
    correcta: '0.85',
    hint: 'Grupo inmediatamente interior (n-1): factor 0.85. Grupos más internos (n-2 o menos): 1.00.'
  },
  {
    texto: 'Para un electrón en un orbital d o f, ¿qué factor tienen todos los electrones internos?',
    opciones: ['0.35', '0.85', '1.00', '0.50'],
    correcta: '1.00',
    hint: 'Para orbitales d y f: todos los electrones de grupos más internos aportan factor 1.00 (apantallan completamente).'
  },
  {
    texto: '¿Cuál es la fórmula de la carga nuclear efectiva según Slater?',
    opciones: ['Z* = Z + σ', 'Z* = Z − σ', 'Z* = σ / Z', 'Z* = Z × σ'],
    correcta: 'Z* = Z − σ',
    hint: 'Z* = Z − σ. Z es el número atómico, σ es la constante de apantallamiento total.'
  },
  {
    texto: 'Para el Na (Z=11), el electrón diferencial está en 3s. Los 8 electrones del grupo (n-1) = {2s,2p} aportan σ de:',
    opciones: ['8 × 0.35 = 2.80', '8 × 0.85 = 6.80', '8 × 1.00 = 8.00', '8 × 0.30 = 2.40'],
    correcta: '8 × 0.85 = 6.80',
    hint: 'Para 3s (s/p), el grupo interior {2s,2p} es el grupo n-1 → factor 0.85. 8 × 0.85 = 6.80.'
  },
  {
    texto: 'Para Na (Z=11), el electrón en 3s: σ = 2×1.00 (del 1s) + 8×0.85 (2s,2p) + 0×0.35. Entonces Z* =',
    opciones: ['11 − 8.80 = 2.20', '11 − 6.80 = 4.20', '11 − 9.00 = 2.00', '11 − 10 = 1.00'],
    correcta: '11 − 8.80 = 2.20',
    hint: 'σ = 2(1.00) + 8(0.85) = 2.00 + 6.80 = 8.80. Z* = 11 − 8.80 = 2.20. El 3s "siente" solo ~2.2 cargas positivas.'
  },
  {
    texto: 'Para el Fe (Z=26), el electrón en 4s: el grupo {3s,3p} (8 electrones) contribuye con factor:',
    opciones: ['0.35 (mismo grupo)', '0.85 (grupo n-1)', '1.00 (grupo ≤n-2)', '0.30 (solo para 1s)'],
    correcta: '0.85 (grupo n-1)',
    hint: 'Para el orbital 4s, el grupo Slater anterior {3s,3p} es el grupo (n-1) → factor 0.85.'
  },
  {
    texto: 'Un mayor Z* en el electrón de valencia implica:',
    opciones: [
      'Mayor radio atómico y menor electronegatividad',
      'Menor radio atómico, mayor potencial de ionización y mayor electronegatividad',
      'Menor potencial de ionización',
      'No tiene relación con las propiedades periódicas'
    ],
    correcta: 'Menor radio atómico, mayor potencial de ionización y mayor electronegatividad',
    hint: 'Mayor Z* = el núcleo atrae más fuertemente al electrón → radio menor, PI mayor, EN mayor. Explica las tendencias periódicas.'
  },
  {
    texto: 'En el mismo período (ej. Na → Cl), Z* del electrón de valencia:',
    opciones: ['Disminuye progresivamente', 'Se mantiene constante', 'Aumenta progresivamente', 'Fluctúa sin patrón'],
    correcta: 'Aumenta progresivamente',
    hint: 'Al avanzar en el período, Z aumenta en 1 por paso, pero σ solo aumenta en ~0.35 (mismo grupo). Z* = Z − σ aumenta ~0.65 por elemento.'
  },
  {
    texto: '¿Por qué el Cu (Z=29) tiene configuración [Ar]3d¹⁰4s¹ en vez de [Ar]3d⁹4s²?',
    opciones: [
      'Porque el 4s tiene menor energía que el 3d',
      'Porque la subcapa 3d completa (10 e⁻) es más estable: Z*(3d) aumenta y la energía total baja',
      'Es un error de la tabla periódica',
      'Porque el 4s siempre se llena antes que el 3d'
    ],
    correcta: 'Porque la subcapa 3d completa (10 e⁻) es más estable: Z*(3d) aumenta y la energía total baja',
    hint: 'Subcapa d completa o semillena → mayor estabilidad. En Cu, el 3d¹⁰ baja más la energía total que el 3d⁹4s².'
  },
]

const qIdx = ref(0)
const qResp = ref(null)
const qScore = ref(0)
const qShuffled = ref([...preguntas].sort(() => Math.random() - 0.5))
const qTerminado = computed(() => qIdx.value >= qShuffled.value.length)
const qActual = computed(() => qShuffled.value[qIdx.value])

function responder(op) {
  if (qResp.value !== null) return
  qResp.value = op
  if (op === qActual.value.correcta) qScore.value++
  setTimeout(() => { qIdx.value++; qResp.value = null }, 1800)
}
function reiniciar() {
  qShuffled.value = [...preguntas].sort(() => Math.random() - 0.5)
  qIdx.value = 0; qResp.value = null; qScore.value = 0
}

// Color para Z* en tabla
function zEffColor(zEff) {
  if (zEff === '—') return ''
  const v = parseFloat(zEff)
  if (v < 3) return 'text-blue-600'
  if (v < 8) return 'text-green-600'
  if (v < 15) return 'text-orange-600'
  return 'text-red-600'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Reglas de Slater — Carga Nuclear Efectiva (Z*)</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 2.2.3 — Apantallamiento, σ y Z* = Z − σ</p>
    </div>

    <Tabs default-value="teoria">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="teoria">Reglas y Grupos</TabsTrigger>
        <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
        <TabsTrigger value="tabla">Tabla Z*</TabsTrigger>
        <TabsTrigger value="comparador">Comparador</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>

      <!-- ── REGLAS ── -->
      <TabsContent value="teoria" class="mt-4 space-y-4">
        <!-- Concepto central -->
        <Card class="border-primary/30 bg-primary/5">
          <CardContent class="pt-4 pb-4 text-center space-y-2">
            <p class="text-sm text-muted-foreground">Carga nuclear efectiva</p>
            <p class="text-3xl font-bold font-mono text-primary">Z* = Z − σ</p>
            <p class="text-sm text-muted-foreground">
              Z = número atómico &nbsp;|&nbsp; σ = constante de apantallamiento (Slater)
            </p>
          </CardContent>
        </Card>

        <!-- Paso 1: Agrupación -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm flex items-center gap-2">
              <Badge class="text-xs">Paso 1</Badge>
              Agrupar los orbitales según las reglas de Slater
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <p class="text-sm text-muted-foreground">Los orbitales se agrupan en este orden. Orbitales en el mismo grupo se tratan juntos:</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="(g, i) in ['(1s)', '(2s, 2p)', '(3s, 3p)', '(3d)', '(4s, 4p)', '(4d)', '(4f)', '(5s, 5p)', '(5d)…']"
                :key="i"
                class="border rounded px-3 py-1.5 font-mono text-sm font-semibold"
                :class="i < 3 ? 'border-blue-300 bg-blue-50 text-blue-700' : i === 3 ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-muted'"
              >
                {{ g }}
              </div>
            </div>
            <p class="text-xs text-muted-foreground">Los grupos s,p del mismo nivel van juntos (ej. 2s y 2p). Los d y f tienen su propio grupo.</p>
          </CardContent>
        </Card>

        <!-- Paso 2: Factores -->
        <div class="grid gap-4 sm:grid-cols-2">
          <Card class="border-blue-200">
            <CardHeader class="pb-2">
              <CardTitle class="text-sm flex items-center gap-2">
                <Badge class="text-xs bg-blue-100 text-blue-700 border-0">Paso 2a</Badge>
                Para electrones en orbitales s o p
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <div class="space-y-2">
                <div class="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="outline" class="font-mono shrink-0">0.35</Badge>
                  <span>Cada e⁻ en el <strong>mismo grupo</strong></span>
                </div>
                <div class="text-xs text-muted-foreground ml-1">⚠️ Para el grupo (1s) se usa <strong>0.30</strong> en lugar de 0.35</div>
                <div class="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="outline" class="font-mono shrink-0">0.85</Badge>
                  <span>Cada e⁻ en el <strong>grupo (n−1)</strong></span>
                </div>
                <div class="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="outline" class="font-mono shrink-0">1.00</Badge>
                  <span>Cada e⁻ en grupos <strong>≤ (n−2)</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-orange-200">
            <CardHeader class="pb-2">
              <CardTitle class="text-sm flex items-center gap-2">
                <Badge class="text-xs bg-orange-100 text-orange-700 border-0">Paso 2b</Badge>
                Para electrones en orbitales d o f
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <div class="space-y-2">
                <div class="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="outline" class="font-mono shrink-0">0.35</Badge>
                  <span>Cada e⁻ en el <strong>mismo grupo d o f</strong></span>
                </div>
                <div class="flex items-center gap-3 p-2 bg-muted rounded">
                  <Badge variant="outline" class="font-mono shrink-0">1.00</Badge>
                  <span><strong>Todos</strong> los e⁻ en grupos más internos</span>
                </div>
                <p class="text-xs text-muted-foreground">
                  Para d y f no hay distinción entre (n−1) y (n−2): todo vale 1.00.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Tabla resumen compacta -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Tabla resumen de factores σ</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="bg-muted/50">
                  <tr>
                    <th class="text-left py-2 px-3 font-medium">Posición de los e⁻ apantallantes</th>
                    <th class="text-center py-2 px-3 font-medium">Factor para s/p</th>
                    <th class="text-center py-2 px-3 font-medium">Factor para d/f</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr>
                    <td class="py-2 px-3">Mismo grupo que el e⁻ estudiado</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-blue-600">0.35 <span class="text-xs text-muted-foreground">(0.30 para 1s)</span></td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-orange-600">0.35</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3">Grupo inmediatamente interior (n−1)</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-blue-600">0.85</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-orange-600">1.00</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3">Grupos más internos (≤ n−2)</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-blue-600">1.00</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-orange-600">1.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <!-- Ejemplo completo de Na -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Ejemplo completo — Na (Z=11), electrón en 3s</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <p class="text-muted-foreground">Configuración: [1s²] [2s²2p⁶] [3s¹]. El electrón estudiado está en el grupo (3s,3p).</p>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse border rounded">
                <thead class="bg-muted/40">
                  <tr>
                    <th class="py-2 px-3 text-left font-medium">Grupo Slater</th>
                    <th class="py-2 px-3 text-center font-medium">e⁻</th>
                    <th class="py-2 px-3 text-center font-medium">Factor</th>
                    <th class="py-2 px-3 text-center font-medium">σ parcial</th>
                    <th class="py-2 px-3 text-left font-medium">Razón</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr>
                    <td class="py-2 px-3 font-mono">(1s)</td>
                    <td class="py-2 px-3 text-center">2</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-red-600">1.00</td>
                    <td class="py-2 px-3 text-center font-mono">2.00</td>
                    <td class="py-2 px-3 text-xs text-muted-foreground">Grupo ≤ (n−2)</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono">(2s, 2p)</td>
                    <td class="py-2 px-3 text-center">8</td>
                    <td class="py-2 px-3 text-center font-mono font-bold text-orange-600">0.85</td>
                    <td class="py-2 px-3 text-center font-mono">6.80</td>
                    <td class="py-2 px-3 text-xs text-muted-foreground">Grupo (n−1)</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-3 font-mono">(3s) mismo grupo</td>
                    <td class="py-2 px-3 text-center">0</td>
                    <td class="py-2 px-3 text-center font-mono">0.35</td>
                    <td class="py-2 px-3 text-center font-mono">0.00</td>
                    <td class="py-2 px-3 text-xs text-muted-foreground">No hay otros en el grupo</td>
                  </tr>
                  <tr class="bg-muted/30 font-bold">
                    <td colspan="3" class="py-2 px-3 text-right">σ total =</td>
                    <td class="py-2 px-3 text-center font-mono">8.80</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="bg-primary/10 border border-primary/20 rounded p-3 text-center">
              <p class="font-mono font-bold text-lg">Z* = Z − σ = 11 − 8.80 = <span class="text-primary text-xl">2.20</span></p>
              <p class="text-xs text-muted-foreground mt-1">El electrón 3s del Na "siente" una carga nuclear neta de solo +2.20</p>
            </div>
          </CardContent>
        </Card>

        <!-- Relación con propiedades periódicas -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Z* y propiedades periódicas</CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-2">
            <div class="grid gap-2 sm:grid-cols-2">
              <div class="p-2 bg-muted/40 rounded space-y-1">
                <p class="font-semibold">En el mismo período (→)</p>
                <p class="text-muted-foreground text-xs">Z aumenta en 1, σ solo en ~0.35 → Z* aumenta ~0.65 por elemento. Por eso PI, EN y Z* aumentan al avanzar en el período.</p>
              </div>
              <div class="p-2 bg-muted/40 rounded space-y-1">
                <p class="font-semibold">En el mismo grupo (↓)</p>
                <p class="text-muted-foreground text-xs">Se agrega un nivel n más. Los nuevos electrones internos apantallan eficientemente → Z* crece poco. El radio atómico aumenta (n mayor domina).</p>
              </div>
              <div class="p-2 bg-muted/40 rounded space-y-1">
                <p class="font-semibold">Radio atómico</p>
                <p class="text-muted-foreground text-xs">r ∝ n / Z*. Mayor Z* → e⁻ más atraído → radio menor.</p>
              </div>
              <div class="p-2 bg-muted/40 rounded space-y-1">
                <p class="font-semibold">Ionización</p>
                <p class="text-muted-foreground text-xs">Mayor Z* → más energía para arrancar el e⁻ → mayor PI.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── CALCULADORA ── -->
      <TabsContent value="calculadora" class="mt-4 space-y-4">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Calcular Z* con las Reglas de Slater</CardTitle>
            <CardDescription>Ingresa el símbolo del elemento y el orbital del electrón a evaluar.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Inputs -->
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-sm font-medium">Elemento (símbolo o Z)</label>
                <input
                  v-model="calcInput"
                  type="text"
                  placeholder="ej. Fe, Na, 17"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p v-if="calcZ" class="text-xs text-muted-foreground">
                  Z = {{ calcZ }} — {{ elementNames[calcZ] }}
                </p>
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Orbital del electrón</label>
                <select
                  v-model="calcOrb"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option v-for="orb in calcOrbitalesDisponibles" :key="orb" :value="orb">{{ orb }}</option>
                </select>
              </div>
            </div>

            <!-- Ejemplos rápidos -->
            <div class="flex flex-wrap gap-2">
              <span class="text-xs text-muted-foreground self-center">Ejemplos:</span>
              <Button
                v-for="ej in ejemplosRapidos"
                :key="ej.label"
                variant="outline"
                size="sm"
                class="text-xs h-7"
                @click="calcInput = ej.sym; calcOrb = ej.orb"
              >{{ ej.label }}</Button>
            </div>

            <!-- Resultado -->
            <template v-if="calcResult">
              <!-- Resultado principal -->
              <div class="bg-primary/10 border border-primary/20 rounded p-4 text-center space-y-2">
                <p class="text-sm text-muted-foreground">
                  Z* para un e⁻ en <strong>{{ calcResult.orbital }}</strong> de
                  <strong>{{ elementSymbols[calcResult.z] }} (Z={{ calcResult.z }})</strong>
                </p>
                <p class="text-4xl font-bold font-mono text-primary">Z* = {{ calcResult.zEff }}</p>
                <p class="text-sm font-mono text-muted-foreground">
                  Z* = {{ calcResult.z }} − σ({{ calcResult.sigma }}) = {{ calcResult.zEff }}
                </p>
              </div>

              <!-- Tabla de pasos -->
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse border rounded">
                  <thead class="bg-muted/40">
                    <tr>
                      <th class="py-2 px-3 text-left font-medium">Grupo Slater</th>
                      <th class="py-2 px-3 text-center font-medium">e⁻</th>
                      <th class="py-2 px-3 text-center font-medium">Factor σ</th>
                      <th class="py-2 px-3 text-center font-medium">σ parcial</th>
                      <th class="py-2 px-3 text-left font-medium hidden sm:table-cell">Tipo</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    <tr v-for="(step, i) in calcResult.steps" :key="i">
                      <td class="py-2 px-3 font-mono">{{ step.group }}</td>
                      <td class="py-2 px-3 text-center">{{ step.e }}</td>
                      <td class="py-2 px-3 text-center font-mono font-bold"
                        :class="{
                          'text-green-600': step.factor === 0.35 || step.factor === 0.30,
                          'text-orange-600': step.factor === 0.85,
                          'text-red-600': step.factor === 1.00
                        }">
                        {{ step.factor.toFixed(2) }}
                      </td>
                      <td class="py-2 px-3 text-center font-mono">{{ step.contrib.toFixed(4) }}</td>
                      <td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          class="text-xs"
                          :class="{
                            'text-green-600 border-green-200': step.tipo === 'mismo',
                            'text-orange-600 border-orange-200': step.tipo === 'n1',
                            'text-red-600 border-red-200': step.tipo === 'n2' || step.tipo === 'interno_df'
                          }">
                          {{ step.tipo === 'mismo' ? 'Mismo grupo' : step.tipo === 'n1' ? 'Grupo (n−1)' : 'Grupo ≤(n−2)' }}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-muted/20 font-bold">
                    <tr>
                      <td colspan="3" class="py-2 px-3 text-right">σ total =</td>
                      <td class="py-2 px-3 text-center font-mono">{{ calcResult.sigma }}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </template>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── TABLA DE REFERENCIA ── -->
      <TabsContent value="tabla" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">
          Z* calculado con reglas de Slater para el <strong>electrón diferencial</strong> (último en llenarse) de cada elemento.
        </p>

        <div class="space-y-4">
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Períodos 1, 2 y 3 (Z = 1 – 18)</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead class="bg-muted/50">
                    <tr>
                      <th class="py-2 px-2 text-center font-medium">Z</th>
                      <th class="py-2 px-2 text-center font-medium">Símbolo</th>
                      <th class="py-2 px-2 text-left font-medium hidden sm:table-cell">Nombre</th>
                      <th class="py-2 px-2 text-center font-medium">Orbital</th>
                      <th class="py-2 px-2 text-center font-medium">σ</th>
                      <th class="py-2 px-2 text-center font-medium">Z*</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    <tr v-for="row in tablaZ1a18" :key="row.z" class="hover:bg-muted/20">
                      <td class="py-1.5 px-2 text-center font-mono text-xs text-muted-foreground">{{ row.z }}</td>
                      <td class="py-1.5 px-2 text-center font-bold">{{ row.sym }}</td>
                      <td class="py-1.5 px-2 text-xs text-muted-foreground hidden sm:table-cell">{{ row.name }}</td>
                      <td class="py-1.5 px-2 text-center font-mono text-xs">{{ row.lastOrb }}</td>
                      <td class="py-1.5 px-2 text-center font-mono text-xs text-muted-foreground">{{ row.sigma }}</td>
                      <td class="py-1.5 px-2 text-center font-mono font-bold" :class="zEffColor(row.zEff)">{{ row.zEff }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Períodos 4 (Z = 19 – 36, incluye metales de transición)</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead class="bg-muted/50">
                    <tr>
                      <th class="py-2 px-2 text-center font-medium">Z</th>
                      <th class="py-2 px-2 text-center font-medium">Símbolo</th>
                      <th class="py-2 px-2 text-left font-medium hidden sm:table-cell">Nombre</th>
                      <th class="py-2 px-2 text-center font-medium">Orbital</th>
                      <th class="py-2 px-2 text-center font-medium">σ</th>
                      <th class="py-2 px-2 text-center font-medium">Z*</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    <tr v-for="row in tablaZ19a36" :key="row.z" class="hover:bg-muted/20">
                      <td class="py-1.5 px-2 text-center font-mono text-xs text-muted-foreground">{{ row.z }}</td>
                      <td class="py-1.5 px-2 text-center font-bold">{{ row.sym }}</td>
                      <td class="py-1.5 px-2 text-xs text-muted-foreground hidden sm:table-cell">{{ row.name }}</td>
                      <td class="py-1.5 px-2 text-center font-mono text-xs">{{ row.lastOrb }}</td>
                      <td class="py-1.5 px-2 text-center font-mono text-xs text-muted-foreground">{{ row.sigma }}</td>
                      <td class="py-1.5 px-2 text-center font-mono font-bold" :class="zEffColor(row.zEff)">{{ row.zEff }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-xs text-muted-foreground mt-2 italic">
                Cr (Z=24) y Cu (Z=29) tienen configuraciones de excepción que se aplican en el cálculo.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- ── COMPARADOR ── -->
      <TabsContent value="comparador" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Compara el Z* de dos elementos para entender tendencias periódicas.</p>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- Elemento A -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Elemento A</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">Símbolo o Z</label>
                <input v-model="cmpA" type="text" placeholder="ej. Na" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Orbital</label>
                <select v-model="cmpOrbA" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option v-for="o in cmpOrbsA" :key="o" :value="o">{{ o }}</option>
                </select>
              </div>
              <div v-if="cmpResultA" class="bg-primary/10 border border-primary/20 rounded p-3 text-center">
                <p class="text-xs text-muted-foreground">{{ elementSymbols[cmpResultA.z] }} (Z={{ cmpResultA.z }}) — {{ cmpResultA.orbital }}</p>
                <p class="text-2xl font-bold font-mono text-primary">Z* = {{ cmpResultA.zEff }}</p>
                <p class="text-xs font-mono text-muted-foreground">σ = {{ cmpResultA.sigma }}</p>
              </div>
            </CardContent>
          </Card>

          <!-- Elemento B -->
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Elemento B</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">Símbolo o Z</label>
                <input v-model="cmpB" type="text" placeholder="ej. Cl" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Orbital</label>
                <select v-model="cmpOrbB" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option v-for="o in cmpOrbsB" :key="o" :value="o">{{ o }}</option>
                </select>
              </div>
              <div v-if="cmpResultB" class="bg-primary/10 border border-primary/20 rounded p-3 text-center">
                <p class="text-xs text-muted-foreground">{{ elementSymbols[cmpResultB.z] }} (Z={{ cmpResultB.z }}) — {{ cmpResultB.orbital }}</p>
                <p class="text-2xl font-bold font-mono text-primary">Z* = {{ cmpResultB.zEff }}</p>
                <p class="text-xs font-mono text-muted-foreground">σ = {{ cmpResultB.sigma }}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Comparación -->
        <Card v-if="cmpResultA && cmpResultB">
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Comparación</CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-2">
            <div class="flex items-center gap-3">
              <div class="flex-1 text-center">
                <p class="font-bold font-mono text-lg">{{ cmpResultA.zEff }}</p>
                <p class="text-xs text-muted-foreground">Z*({{ elementSymbols[cmpResultA.z] }}, {{ cmpResultA.orbital }})</p>
              </div>
              <div class="text-2xl font-bold" :class="parseFloat(cmpResultA.zEff) > parseFloat(cmpResultB.zEff) ? 'text-green-600' : parseFloat(cmpResultA.zEff) < parseFloat(cmpResultB.zEff) ? 'text-red-500' : 'text-muted-foreground'">
                {{ parseFloat(cmpResultA.zEff) > parseFloat(cmpResultB.zEff) ? '>' : parseFloat(cmpResultA.zEff) < parseFloat(cmpResultB.zEff) ? '<' : '=' }}
              </div>
              <div class="flex-1 text-center">
                <p class="font-bold font-mono text-lg">{{ cmpResultB.zEff }}</p>
                <p class="text-xs text-muted-foreground">Z*({{ elementSymbols[cmpResultB.z] }}, {{ cmpResultB.orbital }})</p>
              </div>
            </div>
            <p class="text-xs text-muted-foreground text-center">
              Diferencia: {{ Math.abs(parseFloat(cmpResultA.zEff) - parseFloat(cmpResultB.zEff)).toFixed(4) }}
            </p>
          </CardContent>
        </Card>

        <!-- Comparaciones interesantes sugeridas -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Comparaciones sugeridas</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid gap-2 sm:grid-cols-2">
              <button
                v-for="s in [
                  { label: 'Na vs Cl (3s vs 3p) — mismo período', a: 'Na', oa: '3s', b: 'Cl', ob: '3p' },
                  { label: 'Na vs K (3s vs 4s) — mismo grupo', a: 'Na', oa: '3s', b: 'K', ob: '4s' },
                  { label: 'Fe(3d) vs Fe(4s) — mismo átomo', a: 'Fe', oa: '3d', b: 'Fe', ob: '4s' },
                  { label: 'Cu(3d) vs Cu(4s) — excepción', a: 'Cu', oa: '3d', b: 'Cu', ob: '4s' },
                ]"
                :key="s.label"
                class="text-left border rounded p-2 text-xs hover:border-primary/40 transition-colors"
                @click="cmpA = s.a; cmpOrbA = s.oa; cmpB = s.b; cmpOrbB = s.ob"
              >
                {{ s.label }}
              </button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">10 preguntas sobre las reglas de Slater y su aplicación.</p>

        <div v-if="!qTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qResp !== null && qResp === qActual.correcta,
            'border-red-400': qResp !== null && qResp !== qActual.correcta,
            'border-border': qResp === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ qIdx + 1 }} / {{ qShuffled.length }}</Badge>
                <span class="text-sm text-muted-foreground">✓ {{ qScore }}</span>
              </div>
              <CardTitle class="text-base mt-2 leading-relaxed">{{ qActual.texto }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex flex-col gap-2">
                <Button
                  v-for="op in qActual.opciones" :key="op"
                  :variant="qResp === op
                    ? (op === qActual.correcta ? 'default' : 'destructive')
                    : qResp !== null && op === qActual.correcta ? 'default' : 'outline'"
                  :disabled="qResp !== null"
                  class="justify-start h-auto py-2 text-sm text-left whitespace-normal font-mono"
                  @click="responder(op)"
                >{{ op }}</Button>
              </div>
              <p v-if="qResp !== null" class="text-sm border-l-2 pl-2 mt-2"
                :class="qResp === qActual.correcta ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="qResp === qActual.correcta">✓ </span><span v-else>✗ Era: <strong class="font-mono">{{ qActual.correcta }}</strong>. </span>
                {{ qActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qScore / qShuffled.length >= 0.75 ? 'text-green-600' : 'text-orange-500'">
              {{ qScore }} / {{ qShuffled.length }}
            </p>
            <p class="text-muted-foreground">
              {{ qScore / qShuffled.length >= 0.9 ? '¡Dominas las reglas de Slater!' : qScore / qShuffled.length >= 0.7 ? 'Buen trabajo, repasa los factores.' : 'Revisa la tabla de factores y el ejemplo de Na.' }}
            </p>
            <Button @click="reiniciar" class="gap-2">
              <RotateCcw class="size-4" /> Reintentar
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Atom, ArrowRight, Zap, Calculator, BookOpen, AlertTriangle, ChevronRight, Minus, Plus, Search } from 'lucide-vue-next'

// ─── Navegación por secciones ───
const activeSection = ref('configurador')
const sections = [
  { id: 'configurador', label: 'Configurador', icon: '⚛️' },
  { id: 'aufbau', label: 'Diagrama de Aufbau', icon: '📐' },
  { id: 'iones', label: 'Iones', icon: '⚡' },
  { id: 'zefectiva', label: 'Carga Nuclear Efectiva', icon: '🧲' },
  { id: 'referencia', label: 'Referencia Rápida', icon: '📋' },
]

// ─── Datos de elementos Z=1..36 ───
const elementSymbols = {
  1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',
  11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',
  19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',
  27:'Co',28:'Ni',29:'Cu',30:'Zn',31:'Ga',32:'Ge',33:'As',34:'Se',
  35:'Br',36:'Kr'
}

const elementNames = {
  1:'Hidrógeno',2:'Helio',3:'Litio',4:'Berilio',5:'Boro',6:'Carbono',7:'Nitrógeno',8:'Oxígeno',
  9:'Flúor',10:'Neón',11:'Sodio',12:'Magnesio',13:'Aluminio',14:'Silicio',15:'Fósforo',16:'Azufre',
  17:'Cloro',18:'Argón',19:'Potasio',20:'Calcio',21:'Escandio',22:'Titanio',23:'Vanadio',24:'Cromo',
  25:'Manganeso',26:'Hierro',27:'Cobalto',28:'Níquel',29:'Cobre',30:'Zinc',31:'Galio',32:'Germanio',
  33:'Arsénico',34:'Selenio',35:'Bromo',36:'Kriptón'
}

// ─── Superscripts ───
const superscripts = { 0:'⁰',1:'¹',2:'²',3:'³',4:'⁴',5:'⁵',6:'⁶',7:'⁷',8:'⁸',9:'⁹',10:'¹⁰',11:'¹¹',12:'¹²',13:'¹³',14:'¹⁴' }

function toSuperscript(n) {
  if (n in superscripts) return superscripts[n]
  return String(n).split('').map(d => superscripts[parseInt(d)] || d).join('')
}

// ─── Orden de llenado Aufbau ───
const aufbauOrder = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p']

const maxElectrons = { s: 2, p: 6, d: 10, f: 14 }

// ─── Gas noble anterior ───
const nobleGases = [
  { z: 2, symbol: 'He' },
  { z: 10, symbol: 'Ne' },
  { z: 18, symbol: 'Ar' },
  { z: 36, symbol: 'Kr' },
  { z: 54, symbol: 'Xe' },
  { z: 86, symbol: 'Rn' },
  { z: 118, symbol: 'Og' },
]

// ─── Excepciones conocidas ───
const exceptions = {
  24: { config: [
    {orb:'1s',e:2},{orb:'2s',e:2},{orb:'2p',e:6},{orb:'3s',e:2},{orb:'3p',e:6},{orb:'4s',e:1},{orb:'3d',e:5}
  ], reason: 'El cromo (Cr) prefiere tener el subnivel 3d semilleno (3d⁵) y 4s¹ por mayor estabilidad, en lugar de 3d⁴4s².' },
  29: { config: [
    {orb:'1s',e:2},{orb:'2s',e:2},{orb:'2p',e:6},{orb:'3s',e:2},{orb:'3p',e:6},{orb:'4s',e:1},{orb:'3d',e:10}
  ], reason: 'El cobre (Cu) prefiere tener el subnivel 3d completamente lleno (3d¹⁰) y 4s¹ por mayor estabilidad, en lugar de 3d⁹4s².' },
}

// ─── Generar configuración electrónica ───
function getElectronConfig(z) {
  if (z <= 0 || z > 118) return []
  if (exceptions[z]) return exceptions[z].config

  const config = []
  let remaining = z
  for (const orb of aufbauOrder) {
    if (remaining <= 0) break
    const type = orb.slice(-1)
    const max = maxElectrons[type]
    const e = Math.min(remaining, max)
    config.push({ orb, e })
    remaining -= e
  }
  return config
}

// ─── Configuración en texto ───
function configToString(config) {
  return config.map(c => `${c.orb}${toSuperscript(c.e)}`).join(' ')
}

// ─── Notación de gas noble ───
function getNobleGasNotation(z, config) {
  let bestGas = null
  for (const ng of nobleGases) {
    if (ng.z < z) bestGas = ng
    else break
  }
  if (!bestGas) return configToString(config)

  const gasConfig = getElectronConfig(bestGas.z)
  const gasElectrons = gasConfig.reduce((sum, c) => sum + c.e, 0)

  let accumulated = 0
  let startIndex = 0
  for (let i = 0; i < config.length; i++) {
    accumulated += config[i].e
    if (accumulated === gasElectrons) {
      startIndex = i + 1
      break
    }
  }

  if (startIndex >= config.length) return `[${bestGas.symbol}]`
  const remainder = config.slice(startIndex)
  return `[${bestGas.symbol}] ${configToString(remainder)}`
}

// ─── Configuración ordenada por n para mostrar ───
function configSortedByN(config) {
  return [...config].sort((a, b) => {
    const nA = parseInt(a.orb[0]), nB = parseInt(b.orb[0])
    const lOrder = { s: 0, p: 1, d: 2, f: 3 }
    if (nA !== nB) return nA - nB
    return lOrder[a.orb.slice(-1)] - lOrder[b.orb.slice(-1)]
  })
}

// ─── Diagrama de cajas orbitales ───
function getOrbitalBoxes(orbName, electronCount) {
  const type = orbName.slice(-1)
  const numOrbitals = type === 's' ? 1 : type === 'p' ? 3 : type === 'd' ? 5 : 7
  const boxes = Array.from({ length: numOrbitals }, () => ({ up: false, down: false }))
  let remaining = electronCount
  // Hund: primero un electrón en cada orbital (spin up)
  for (let i = 0; i < numOrbitals && remaining > 0; i++) { boxes[i].up = true; remaining-- }
  // Luego el segundo electrón (spin down)
  for (let i = 0; i < numOrbitals && remaining > 0; i++) { boxes[i].down = true; remaining-- }
  return boxes
}

// ─── Electrones desapareados ───
function countUnpaired(config) {
  let unpaired = 0
  for (const c of config) {
    const boxes = getOrbitalBoxes(c.orb, c.e)
    for (const box of boxes) {
      if (box.up && !box.down) unpaired++
    }
  }
  return unpaired
}

// ─── Bloque del elemento ───
function getBlock(config) {
  if (config.length === 0) return '?'
  const lastOrb = config[config.length - 1].orb
  return lastOrb.slice(-1)
}

// ─── Electrones de valencia ───
function getValenceElectrons(z, config) {
  if (config.length === 0) return 0
  const sorted = configSortedByN(config)
  const maxN = Math.max(...sorted.map(c => parseInt(c.orb[0])))
  const block = getBlock(config)

  if (block === 's' || block === 'p') {
    return sorted.filter(c => parseInt(c.orb[0]) === maxN).reduce((sum, c) => sum + c.e, 0)
  }
  if (block === 'd') {
    return sorted.filter(c => {
      const n = parseInt(c.orb[0])
      const l = c.orb.slice(-1)
      return (n === maxN && l === 's') || (n === maxN - 1 && l === 'd')
    }).reduce((sum, c) => sum + c.e, 0)
  }
  if (block === 'f') {
    return sorted.filter(c => {
      const n = parseInt(c.orb[0])
      const l = c.orb.slice(-1)
      return (n === maxN && l === 's') || (n === maxN - 1 && l === 'd') || (n === maxN - 2 && l === 'f')
    }).reduce((sum, c) => sum + c.e, 0)
  }
  return 0
}

// ─── Resolver símbolo a Z ───
function symbolToZ(input) {
  const trimmed = input.trim()
  const num = parseInt(trimmed)
  if (!isNaN(num) && num >= 1 && num <= 118) return num
  const lower = trimmed.toLowerCase()
  for (const [z, sym] of Object.entries(elementSymbols)) {
    if (sym.toLowerCase() === lower) return parseInt(z)
  }
  return null
}

// ════════════════════════════════════════════
// SECCIÓN 1: CONFIGURADOR
// ════════════════════════════════════════════
const confInput = ref('26')
const confZ = computed(() => symbolToZ(confInput.value))
const confConfig = computed(() => confZ.value ? getElectronConfig(confZ.value) : [])
const confConfigSorted = computed(() => confZ.value ? configSortedByN(confConfig.value) : [])
const confFullString = computed(() => configToString(confConfigSorted.value))
const confNobleGas = computed(() => confZ.value ? getNobleGasNotation(confZ.value, confConfigSorted.value) : '')
const confIsException = computed(() => confZ.value && exceptions[confZ.value])
const confExceptionReason = computed(() => confIsException.value ? exceptions[confZ.value].reason : '')
const confUnpaired = computed(() => countUnpaired(confConfig.value))
const confBlock = computed(() => getBlock(confConfig.value))

// ════════════════════════════════════════════
// SECCIÓN 2: DIAGRAMA DE AUFBAU
// ════════════════════════════════════════════
const aufbauHighlight = ref(-1)

const aufbauDiagramRows = computed(() => {
  const rows = []
  for (let n = 1; n <= 7; n++) {
    const cols = []
    const sublevels = ['s', 'p', 'd', 'f']
    for (const l of sublevels) {
      const lNum = { s: 0, p: 1, d: 2, f: 3 }[l]
      if (lNum >= n) {
        cols.push(null)
      } else {
        const orb = `${n}${l}`
        const idx = aufbauOrder.indexOf(orb)
        cols.push({ orb, nPlusL: n + lNum, idx })
      }
    }
    rows.push({ n, cols })
  }
  return rows
})

const aufbauFillingTable = computed(() => {
  let cumulative = 0
  return aufbauOrder.map((orb, idx) => {
    const type = orb.slice(-1)
    const max = maxElectrons[type]
    cumulative += max
    const n = parseInt(orb[0])
    const lNum = { s: 0, p: 1, d: 2, f: 3 }[type]
    return { orb, max, cumulative, nPlusL: n + lNum, n, idx }
  })
})

// ════════════════════════════════════════════
// SECCIÓN 3: IONES
// ════════════════════════════════════════════
const ionInput = ref('26')
const ionCharge = ref(2)

const ionZ = computed(() => symbolToZ(ionInput.value))
const ionNeutralConfig = computed(() => ionZ.value ? getElectronConfig(ionZ.value) : [])

function getIonConfig(z, charge) {
  if (!z) return []
  const neutralConfig = getElectronConfig(z)
  if (charge === 0) return neutralConfig

  if (charge > 0) {
    // Catión: remover electrones del n más alto primero
    const sorted = configSortedByN(neutralConfig)
    let remaining = charge
    for (let i = sorted.length - 1; i >= 0 && remaining > 0; i--) {
      const remove = Math.min(sorted[i].e, remaining)
      sorted[i].e -= remove
      remaining -= remove
    }
    return sorted.filter(c => c.e > 0)
  } else {
    // Anión: agregar electrones siguiendo Aufbau
    const totalElectrons = z + Math.abs(charge)
    return getElectronConfig(totalElectrons).map(c => ({...c}))
  }
}

const ionConfig = computed(() => getIonConfig(ionZ.value, ionCharge.value))
const ionNeutralString = computed(() => configToString(configSortedByN(ionNeutralConfig.value)))
const ionConfigString = computed(() => configToString(ionConfig.value))
const ionLabel = computed(() => {
  if (!ionZ.value) return ''
  const sym = elementSymbols[ionZ.value] || '?'
  if (ionCharge.value > 0) return `${sym}${toSuperscript(Math.abs(ionCharge.value))}⁺`
  if (ionCharge.value < 0) return `${sym}${toSuperscript(Math.abs(ionCharge.value))}⁻`
  return sym
})

const ionDifference = computed(() => {
  if (!ionZ.value) return []
  const neutral = configSortedByN(ionNeutralConfig.value)
  const ion = ionConfig.value
  const diffs = []

  if (ionCharge.value > 0) {
    for (const nc of neutral) {
      const ic = ion.find(i => i.orb === nc.orb)
      const ionE = ic ? ic.e : 0
      if (nc.e !== ionE) {
        diffs.push({ orb: nc.orb, from: nc.e, to: ionE, change: ionE - nc.e })
      }
    }
  } else if (ionCharge.value < 0) {
    for (const ic of ion) {
      const nc = neutral.find(n => n.orb === ic.orb)
      const neutE = nc ? nc.e : 0
      if (ic.e !== neutE) {
        diffs.push({ orb: ic.orb, from: neutE, to: ic.e, change: ic.e - neutE })
      }
    }
  }
  return diffs
})

const commonIons = [
  { symbol: 'Fe²⁺', z: 26, charge: 2 },
  { symbol: 'Fe³⁺', z: 26, charge: 3 },
  { symbol: 'Cu⁺', z: 29, charge: 1 },
  { symbol: 'Cu²⁺', z: 29, charge: 2 },
  { symbol: 'Zn²⁺', z: 30, charge: 2 },
  { symbol: 'Cr³⁺', z: 24, charge: 3 },
  { symbol: 'Na⁺', z: 11, charge: 1 },
  { symbol: 'Cl⁻', z: 17, charge: -1 },
  { symbol: 'O²⁻', z: 8, charge: -2 },
  { symbol: 'Ca²⁺', z: 20, charge: 2 },
]

function selectCommonIon(ion) {
  ionInput.value = String(ion.z)
  ionCharge.value = ion.charge
}

// ════════════════════════════════════════════
// SECCIÓN 4: CARGA NUCLEAR EFECTIVA (Z*)
// ════════════════════════════════════════════
const zeffInput = ref('26')
const zeffOrbital = ref('3d')

const zeffZ = computed(() => symbolToZ(zeffInput.value))

const slaterGroups = ['1s', '2s,2p', '3s,3p', '3d', '4s,4p', '4d', '4f', '5s,5p', '5d', '5f', '6s,6p', '6d', '7s,7p']

function getSlaterGroupIndex(orb) {
  for (let i = 0; i < slaterGroups.length; i++) {
    if (slaterGroups[i].split(',').includes(orb)) return i
  }
  return -1
}

function isDorF(orb) {
  const type = orb.slice(-1)
  return type === 'd' || type === 'f'
}

const zeffCalculation = computed(() => {
  if (!zeffZ.value || !zeffOrbital.value) return null

  const config = getElectronConfig(zeffZ.value)
  const configSorted = configSortedByN(config)
  const targetOrb = zeffOrbital.value
  const targetGroupIdx = getSlaterGroupIndex(targetOrb)

  if (targetGroupIdx === -1) return null

  const targetEntry = configSorted.find(c => c.orb === targetOrb)
  if (!targetEntry) return null

  const z = zeffZ.value
  let sigma = 0
  const steps = []
  const targetIsDorF = isDorF(targetOrb)

  for (const c of configSorted) {
    const groupIdx = getSlaterGroupIndex(c.orb)
    if (groupIdx === targetGroupIdx) {
      const sameGroupContrib = targetGroupIdx === 0 ? 0.30 : 0.35
      const otherElectrons = c.orb === targetOrb ? c.e - 1 : c.e
      if (otherElectrons > 0) {
        const contrib = otherElectrons * sameGroupContrib
        sigma += contrib
        steps.push({
          group: slaterGroups[groupIdx],
          electrons: otherElectrons,
          factor: sameGroupContrib,
          contrib,
          rule: `Mismo grupo: ${otherElectrons} e⁻ × ${sameGroupContrib}`
        })
      }
    } else if (groupIdx < targetGroupIdx) {
      if (targetIsDorF) {
        const contrib = c.e * 1.00
        sigma += contrib
        steps.push({
          group: slaterGroups[groupIdx],
          electrons: c.e,
          factor: 1.00,
          contrib,
          rule: `Interno (d/f): ${c.e} e⁻ × 1.00`
        })
      } else {
        if (groupIdx === targetGroupIdx - 1) {
          const contrib = c.e * 0.85
          sigma += contrib
          steps.push({
            group: slaterGroups[groupIdx],
            electrons: c.e,
            factor: 0.85,
            contrib,
            rule: `Grupo (n-1): ${c.e} e⁻ × 0.85`
          })
        } else {
          const contrib = c.e * 1.00
          sigma += contrib
          steps.push({
            group: slaterGroups[groupIdx],
            electrons: c.e,
            factor: 1.00,
            contrib,
            rule: `Grupo ≤(n-2): ${c.e} e⁻ × 1.00`
          })
        }
      }
    }
  }

  const zEff = z - sigma

  return { z, sigma: sigma.toFixed(2), zEff: zEff.toFixed(2), steps, targetOrb }
})

const zeffAvailableOrbitals = computed(() => {
  if (!zeffZ.value) return []
  const config = getElectronConfig(zeffZ.value)
  return configSortedByN(config).map(c => c.orb)
})

// ════════════════════════════════════════════
// SECCIÓN 5: REFERENCIA RÁPIDA
// ════════════════════════════════════════════
const refFilterBlock = ref('todos')

const referenceTable = computed(() => {
  const rows = []
  for (let z = 1; z <= 36; z++) {
    const config = getElectronConfig(z)
    const sorted = configSortedByN(config)
    const block = getBlock(config)
    const valence = getValenceElectrons(z, config)
    const unpaired = countUnpaired(config)
    const isExc = !!exceptions[z]

    rows.push({
      z,
      symbol: elementSymbols[z],
      name: elementNames[z],
      config: configToString(sorted),
      nobleGas: getNobleGasNotation(z, sorted),
      valence,
      block,
      unpaired,
      paramagnetic: unpaired > 0,
      isException: isExc,
    })
  }
  return rows
})

const filteredReference = computed(() => {
  if (refFilterBlock.value === 'todos') return referenceTable.value
  return referenceTable.value.filter(r => r.block === refFilterBlock.value)
})

const refSearch = ref('')
const filteredReferenceSearch = computed(() => {
  const list = filteredReference.value
  if (!refSearch.value.trim()) return list
  const q = refSearch.value.trim().toLowerCase()
  return list.filter(r =>
    r.symbol.toLowerCase().includes(q) ||
    r.name.toLowerCase().includes(q) ||
    String(r.z).includes(q)
  )
})
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Configuracion Electronica</h1>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Herramienta interactiva para estudiar la distribucion de electrones en atomos e iones,
        reglas de llenado, diagramas de cajas orbitales y carga nuclear efectiva.
      </p>
    </div>

    <!-- Navegacion por pills -->
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeSection === sec.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
        @click="activeSection = sec.id"
      >
        <span>{{ sec.icon }}</span>
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- SECCION 1: CONFIGURADOR -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="activeSection === 'configurador'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Atom class="h-5 w-5 text-primary" />
            Configurador Electronico Interactivo
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Input -->
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1 space-y-2">
              <Label>Numero atomico (1-118) o simbolo del elemento</Label>
              <Input v-model="confInput" placeholder="Ej: 26 o Fe" class="text-lg" />
            </div>
            <div v-if="confZ" class="text-center px-6 py-3 bg-primary/10 rounded-lg">
              <div class="text-3xl font-bold text-primary">{{ elementSymbols[confZ] || '?' }}</div>
              <div class="text-sm text-muted-foreground">{{ elementNames[confZ] || '?' }}</div>
              <div class="text-xs text-muted-foreground">Z = {{ confZ }}</div>
            </div>
          </div>

          <!-- Botones de ejemplo rapido -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-muted-foreground self-center mr-2">Ejemplos:</span>
            <Button v-for="ex in [1,6,8,11,17,24,26,29,35]" :key="ex" variant="outline" size="sm" @click="confInput = String(ex)">
              {{ elementSymbols[ex] }} ({{ ex }})
            </Button>
          </div>

          <template v-if="confZ && confConfig.length > 0">
            <!-- Excepcion -->
            <div v-if="confIsException" class="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <AlertTriangle class="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <Badge variant="outline" class="mb-1 text-amber-600 border-amber-500/50">Excepcion al Aufbau</Badge>
                <p class="text-sm text-amber-700 dark:text-amber-300">{{ confExceptionReason }}</p>
              </div>
            </div>

            <!-- Configuracion completa -->
            <div class="space-y-3">
              <div class="p-4 bg-muted/50 rounded-lg">
                <div class="text-sm font-medium text-muted-foreground mb-1">Configuracion completa (orden por nivel):</div>
                <div class="text-lg font-mono font-semibold tracking-wide">{{ confFullString }}</div>
              </div>
              <div class="p-4 bg-muted/50 rounded-lg">
                <div class="text-sm font-medium text-muted-foreground mb-1">Notacion de gas noble:</div>
                <div class="text-lg font-mono font-semibold tracking-wide">{{ confNobleGas }}</div>
              </div>
              <div class="flex flex-wrap gap-3">
                <Badge variant="secondary" class="text-sm">
                  Bloque: <span class="font-bold ml-1 uppercase">{{ confBlock }}</span>
                </Badge>
                <Badge :variant="confUnpaired > 0 ? 'default' : 'secondary'" class="text-sm">
                  {{ confUnpaired > 0 ? `Paramagnetico (${confUnpaired} e⁻ desapareados)` : 'Diamagnetico' }}
                </Badge>
              </div>
            </div>

            <!-- Diagrama de cajas orbitales -->
            <div class="space-y-3">
              <h3 class="font-semibold text-lg">Diagrama de Cajas Orbitales</h3>
              <p class="text-sm text-muted-foreground">
                Cada caja representa un orbital. Las flechas ↑ y ↓ representan electrones con espin +1/2 y -1/2.
                Segun la regla de Hund, los electrones llenan primero un orbital por caja antes de aparearse.
              </p>
              <div class="space-y-3 overflow-x-auto">
                <div v-for="c in confConfigSorted" :key="c.orb" class="flex items-center gap-3">
                  <span class="font-mono font-bold w-12 text-right text-sm">{{ c.orb }}</span>
                  <div class="flex gap-1">
                    <div
                      v-for="(box, bi) in getOrbitalBoxes(c.orb, c.e)"
                      :key="bi"
                      class="w-10 h-12 border-2 rounded flex flex-col items-center justify-center text-xs font-bold"
                      :class="(box.up || box.down) ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/30'"
                    >
                      <span v-if="box.up" class="text-blue-600 dark:text-blue-400 leading-none">↑</span>
                      <span v-if="box.down" class="text-red-600 dark:text-red-400 leading-none">↓</span>
                    </div>
                  </div>
                  <span class="text-xs text-muted-foreground">
                    {{ c.e }} e⁻
                  </span>
                </div>
              </div>
            </div>
          </template>

          <div v-else-if="confInput && !confZ" class="text-center p-8 text-muted-foreground">
            <AlertTriangle class="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p>Ingresa un numero atomico valido (1-36) o un simbolo de elemento.</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- SECCION 2: DIAGRAMA DE AUFBAU -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="activeSection === 'aufbau'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <ArrowRight class="h-5 w-5 text-primary" />
            Diagrama de Aufbau y Regla Diagonal
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Explicacion -->
          <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
            <h3 class="font-semibold text-blue-700 dark:text-blue-300">Por que 4s se llena antes que 3d?</h3>
            <p class="text-sm">
              El orden de llenado se determina por la regla de <strong>(n + l)</strong>, tambien conocida como
              regla de Madelung o regla diagonal. Los electrones ocupan primero los subniveles con menor
              valor de (n + l). Cuando dos subniveles tienen el mismo valor de (n + l), se llena primero
              el de menor n.
            </p>
            <p class="text-sm">
              Ejemplo: <strong>4s</strong> tiene n+l = 4+0 = <strong>4</strong>, mientras que
              <strong>3d</strong> tiene n+l = 3+2 = <strong>5</strong>. Por eso 4s se llena primero.
            </p>
          </div>

          <!-- Diagrama visual de niveles de energia -->
          <div class="space-y-3">
            <h3 class="font-semibold text-lg">Diagrama de Niveles de Energia</h3>
            <p class="text-sm text-muted-foreground">
              Haz clic en un subnivel para resaltarlo. Cada celda muestra el orbital y su valor de (n+l).
            </p>
            <div class="overflow-x-auto">
              <div class="min-w-[400px] p-4">
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="text-left text-sm font-medium text-muted-foreground px-2 py-1">n</th>
                      <th class="text-center text-sm font-medium text-muted-foreground px-2 py-1">s (l=0)</th>
                      <th class="text-center text-sm font-medium text-muted-foreground px-2 py-1">p (l=1)</th>
                      <th class="text-center text-sm font-medium text-muted-foreground px-2 py-1">d (l=2)</th>
                      <th class="text-center text-sm font-medium text-muted-foreground px-2 py-1">f (l=3)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in aufbauDiagramRows" :key="row.n">
                      <td class="text-left font-bold text-primary px-2 py-2">{{ row.n }}</td>
                      <td
                        v-for="(col, ci) in row.cols"
                        :key="ci"
                        class="text-center px-2 py-2"
                      >
                        <button
                          v-if="col"
                          class="px-3 py-1.5 rounded-md font-mono text-sm font-semibold transition-all duration-200"
                          :class="aufbauHighlight === col.idx
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/50'
                            : 'bg-muted hover:bg-muted/80'"
                          @click="aufbauHighlight = aufbauHighlight === col.idx ? -1 : col.idx"
                        >
                          {{ col.orb }}
                          <span class="block text-xs opacity-70">n+l={{ col.nPlusL }}</span>
                        </button>
                        <span v-else class="text-muted-foreground/30">&mdash;</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Orden de llenado visual con flechas -->
          <div class="space-y-3">
            <h3 class="font-semibold text-lg">Orden de Llenado</h3>
            <div class="flex flex-wrap items-center gap-1">
              <template v-for="(orb, idx) in aufbauOrder" :key="orb">
                <button
                  class="px-3 py-1.5 rounded-lg font-mono text-sm font-semibold transition-all"
                  :class="aufbauHighlight === idx
                    ? 'bg-primary text-primary-foreground shadow-md scale-110'
                    : idx <= aufbauHighlight
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'"
                  @click="aufbauHighlight = aufbauHighlight === idx ? -1 : idx"
                >
                  {{ orb }}
                </button>
                <ChevronRight v-if="idx < aufbauOrder.length - 1" class="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
              </template>
            </div>
          </div>

          <!-- Tabla detallada de llenado -->
          <div class="space-y-3">
            <h3 class="font-semibold text-lg">Tabla de Llenado con Electrones Acumulados</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">#</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Subnivel</th>
                    <th class="text-center px-3 py-2 font-medium text-muted-foreground">n + l</th>
                    <th class="text-center px-3 py-2 font-medium text-muted-foreground">Max. e⁻</th>
                    <th class="text-center px-3 py-2 font-medium text-muted-foreground">e⁻ acumulados</th>
                    <th class="text-left px-3 py-2 font-medium text-muted-foreground">Elemento en que se completa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in aufbauFillingTable"
                    :key="row.orb"
                    class="border-b border-muted/50 transition-colors"
                    :class="aufbauHighlight === row.idx ? 'bg-primary/10' : 'hover:bg-muted/30'"
                  >
                    <td class="px-3 py-2 text-muted-foreground">{{ row.idx + 1 }}</td>
                    <td class="px-3 py-2 font-mono font-semibold">{{ row.orb }}</td>
                    <td class="px-3 py-2 text-center">{{ row.nPlusL }}</td>
                    <td class="px-3 py-2 text-center">{{ row.max }}</td>
                    <td class="px-3 py-2 text-center font-semibold">{{ row.cumulative }}</td>
                    <td class="px-3 py-2">
                      <span v-if="row.cumulative <= 36">
                        {{ elementSymbols[row.cumulative] }} (Z={{ row.cumulative }})
                      </span>
                      <span v-else class="text-muted-foreground">Z={{ row.cumulative }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- SECCION 3: IONES -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="activeSection === 'iones'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Zap class="h-5 w-5 text-primary" />
            Configuracion Electronica de Iones
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Explicacion -->
          <div class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg space-y-2">
            <h3 class="font-semibold text-purple-700 dark:text-purple-300">Reglas para iones</h3>
            <ul class="text-sm space-y-1 list-disc pl-5">
              <li><strong>Cationes (+):</strong> Se remueven electrones del nivel con mayor valor de <strong>n</strong> primero (no del ultimo en llenarse por Aufbau). Por ejemplo, en Fe2+ se quitan los 2 electrones del 4s, no del 3d.</li>
              <li><strong>Aniones (-):</strong> Se agregan electrones siguiendo el orden normal de Aufbau.</li>
            </ul>
          </div>

          <!-- Input -->
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1 space-y-2">
              <Label>Elemento (Z o simbolo)</Label>
              <Input v-model="ionInput" placeholder="Ej: 26 o Fe" />
            </div>
            <div class="space-y-2">
              <Label>Carga del ion</Label>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" @click="ionCharge = Math.max(ionCharge - 1, -3)">
                  <Minus class="h-4 w-4" />
                </Button>
                <span class="w-16 text-center font-mono font-bold text-lg">
                  {{ ionCharge > 0 ? '+' : '' }}{{ ionCharge }}
                </span>
                <Button variant="outline" size="sm" @click="ionCharge = Math.min(ionCharge + 1, 3)">
                  <Plus class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Botones de iones comunes -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-muted-foreground self-center mr-2">Iones comunes:</span>
            <Button
              v-for="ion in commonIons"
              :key="ion.symbol"
              variant="outline"
              size="sm"
              @click="selectCommonIon(ion)"
              class="font-mono"
            >
              {{ ion.symbol }}
            </Button>
          </div>

          <template v-if="ionZ && ionNeutralConfig.length > 0">
            <!-- Comparacion lado a lado -->
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Neutro -->
              <div class="p-4 bg-muted/50 rounded-lg space-y-2">
                <div class="flex items-center gap-2">
                  <Badge variant="secondary">Neutro</Badge>
                  <span class="font-bold">{{ elementSymbols[ionZ] }}</span>
                </div>
                <div class="font-mono text-sm">{{ ionNeutralString }}</div>
                <div class="text-xs text-muted-foreground">{{ ionZ }} electrones</div>
              </div>

              <!-- Ion -->
              <div class="p-4 rounded-lg space-y-2" :class="ionCharge > 0 ? 'bg-red-500/10 border border-red-500/20' : ionCharge < 0 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-muted/50'">
                <div class="flex items-center gap-2">
                  <Badge :variant="ionCharge !== 0 ? 'default' : 'secondary'">
                    {{ ionCharge > 0 ? 'Cation' : ionCharge < 0 ? 'Anion' : 'Neutro' }}
                  </Badge>
                  <span class="font-bold">{{ ionLabel }}</span>
                </div>
                <div class="font-mono text-sm">{{ ionConfigString }}</div>
                <div class="text-xs text-muted-foreground">{{ ionZ - ionCharge }} electrones</div>
              </div>
            </div>

            <!-- Cambios -->
            <div v-if="ionDifference.length > 0" class="space-y-2">
              <h3 class="font-semibold">Cambios realizados:</h3>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="diff in ionDifference"
                  :key="diff.orb"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  :class="diff.change < 0 ? 'bg-red-500/10 text-red-700 dark:text-red-300' : 'bg-green-500/10 text-green-700 dark:text-green-300'"
                >
                  <span class="font-mono font-bold">{{ diff.orb }}</span>
                  <span>{{ diff.from }} e⁻</span>
                  <ArrowRight class="h-3 w-3" />
                  <span>{{ diff.to }} e⁻</span>
                  <Badge :variant="diff.change < 0 ? 'destructive' : 'default'" class="text-xs">
                    {{ diff.change > 0 ? '+' : '' }}{{ diff.change }}
                  </Badge>
                </div>
              </div>
            </div>

            <!-- Diagrama orbital del ion -->
            <div class="space-y-3">
              <h3 class="font-semibold">Diagrama orbital del ion {{ ionLabel }}</h3>
              <div class="space-y-2 overflow-x-auto">
                <div v-for="c in ionConfig" :key="c.orb" class="flex items-center gap-3">
                  <span class="font-mono font-bold w-12 text-right text-sm">{{ c.orb }}</span>
                  <div class="flex gap-1">
                    <div
                      v-for="(box, bi) in getOrbitalBoxes(c.orb, c.e)"
                      :key="bi"
                      class="w-10 h-12 border-2 rounded flex flex-col items-center justify-center text-xs font-bold"
                      :class="(box.up || box.down) ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/30'"
                    >
                      <span v-if="box.up" class="text-blue-600 dark:text-blue-400 leading-none">↑</span>
                      <span v-if="box.down" class="text-red-600 dark:text-red-400 leading-none">↓</span>
                    </div>
                  </div>
                  <span class="text-xs text-muted-foreground">{{ c.e }} e⁻</span>
                </div>
              </div>
              <div class="flex flex-wrap gap-3">
                <Badge :variant="countUnpaired(ionConfig) > 0 ? 'default' : 'secondary'" class="text-sm">
                  {{ countUnpaired(ionConfig) > 0 ? `Paramagnetico (${countUnpaired(ionConfig)} e⁻ desapareados)` : 'Diamagnetico' }}
                </Badge>
              </div>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- SECCION 4: CARGA NUCLEAR EFECTIVA -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="activeSection === 'zefectiva'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="h-5 w-5 text-primary" />
            Carga Nuclear Efectiva (Z*)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Explicacion -->
          <div class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-3">
            <h3 class="font-semibold text-emerald-700 dark:text-emerald-300">Que es Z*?</h3>
            <p class="text-sm">
              La <strong>carga nuclear efectiva</strong> (Z*) es la carga neta que experimenta un electron,
              considerando el efecto de apantallamiento (sigma) de los demas electrones. Se calcula como:
            </p>
            <div class="text-center text-lg font-mono font-bold py-2">
              Z* = Z - sigma
            </div>
            <p class="text-sm">
              Donde Z es el numero atomico y sigma es la constante de apantallamiento, calculada con las
              <strong>reglas de Slater</strong>.
            </p>
          </div>

          <!-- Reglas de Slater simplificadas -->
          <div class="p-4 bg-muted/50 rounded-lg space-y-3">
            <h3 class="font-semibold">Reglas de Slater (simplificadas)</h3>
            <div class="text-sm space-y-2">
              <p><strong>Agrupacion:</strong> (1s)(2s,2p)(3s,3p)(3d)(4s,4p)(4d)(4f)(5s,5p)...</p>
              <div class="space-y-1 mt-2">
                <p class="font-medium">Para electrones s y p:</p>
                <ul class="list-disc pl-5 space-y-0.5">
                  <li>Mismo grupo: <strong>0.35</strong> por cada otro e⁻ (0.30 para 1s)</li>
                  <li>Grupo (n-1): <strong>0.85</strong> por cada e⁻</li>
                  <li>Grupos (n-2) o inferiores: <strong>1.00</strong> por cada e⁻</li>
                </ul>
              </div>
              <div class="space-y-1 mt-2">
                <p class="font-medium">Para electrones d y f:</p>
                <ul class="list-disc pl-5 space-y-0.5">
                  <li>Mismo grupo: <strong>0.35</strong> por cada otro e⁻</li>
                  <li>Todos los demas grupos internos: <strong>1.00</strong> por cada e⁻</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Calculadora -->
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="flex-1 space-y-2">
              <Label>Elemento (Z o simbolo)</Label>
              <Input v-model="zeffInput" placeholder="Ej: 26 o Fe" />
            </div>
            <div class="flex-1 space-y-2">
              <Label>Electron en el orbital</Label>
              <select
                v-model="zeffOrbital"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option v-for="orb in zeffAvailableOrbitals" :key="orb" :value="orb">{{ orb }}</option>
              </select>
            </div>
          </div>

          <!-- Ejemplos rapidos -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm text-muted-foreground self-center mr-2">Ejemplos:</span>
            <Button variant="outline" size="sm" @click="zeffInput = '26'; zeffOrbital = '3d'">Fe (3d)</Button>
            <Button variant="outline" size="sm" @click="zeffInput = '26'; zeffOrbital = '4s'">Fe (4s)</Button>
            <Button variant="outline" size="sm" @click="zeffInput = '29'; zeffOrbital = '3d'">Cu (3d)</Button>
            <Button variant="outline" size="sm" @click="zeffInput = '29'; zeffOrbital = '4s'">Cu (4s)</Button>
            <Button variant="outline" size="sm" @click="zeffInput = '11'; zeffOrbital = '3s'">Na (3s)</Button>
            <Button variant="outline" size="sm" @click="zeffInput = '17'; zeffOrbital = '3p'">Cl (3p)</Button>
          </div>

          <!-- Resultado del calculo -->
          <template v-if="zeffCalculation">
            <div class="space-y-4">
              <div class="text-center p-6 bg-primary/10 rounded-lg">
                <div class="text-sm text-muted-foreground mb-1">Carga nuclear efectiva para un electron en {{ zeffCalculation.targetOrb }} de {{ elementSymbols[zeffZ] || '?' }}</div>
                <div class="text-4xl font-bold text-primary font-mono">
                  Z* = {{ zeffCalculation.zEff }}
                </div>
                <div class="text-sm text-muted-foreground mt-1">
                  Z* = {{ zeffCalculation.z }} - {{ zeffCalculation.sigma }} = {{ zeffCalculation.zEff }}
                </div>
              </div>

              <!-- Calculo paso a paso -->
              <div class="space-y-2">
                <h3 class="font-semibold">Calculo paso a paso de sigma:</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b">
                        <th class="text-left px-3 py-2 font-medium text-muted-foreground">Grupo</th>
                        <th class="text-center px-3 py-2 font-medium text-muted-foreground">e⁻</th>
                        <th class="text-center px-3 py-2 font-medium text-muted-foreground">Factor</th>
                        <th class="text-center px-3 py-2 font-medium text-muted-foreground">Contribucion</th>
                        <th class="text-left px-3 py-2 font-medium text-muted-foreground">Regla</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(step, si) in zeffCalculation.steps" :key="si" class="border-b border-muted/50">
                        <td class="px-3 py-2 font-mono">{{ step.group }}</td>
                        <td class="px-3 py-2 text-center">{{ step.electrons }}</td>
                        <td class="px-3 py-2 text-center font-mono">{{ step.factor.toFixed(2) }}</td>
                        <td class="px-3 py-2 text-center font-mono font-semibold">{{ step.contrib.toFixed(2) }}</td>
                        <td class="px-3 py-2 text-xs text-muted-foreground">{{ step.rule }}</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr class="font-bold">
                        <td colspan="3" class="px-3 py-2 text-right">sigma total =</td>
                        <td class="px-3 py-2 text-center font-mono">{{ zeffCalculation.sigma }}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </template>

          <div v-else-if="zeffZ" class="text-center p-8 text-muted-foreground">
            <p>Selecciona un orbital valido para calcular Z*.</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════════ -->
    <!-- SECCION 5: REFERENCIA RAPIDA -->
    <!-- ═══════════════════════════════════════════════ -->
    <div v-if="activeSection === 'referencia'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BookOpen class="h-5 w-5 text-primary" />
            Referencia Rapida &mdash; Configuraciones Z=1 a 36
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Filtros -->
          <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div class="flex flex-wrap gap-2">
              <span class="text-sm text-muted-foreground self-center mr-1">Bloque:</span>
              <Button
                v-for="b in ['todos','s','p','d']"
                :key="b"
                :variant="refFilterBlock === b ? 'default' : 'outline'"
                size="sm"
                @click="refFilterBlock = b"
              >
                {{ b === 'todos' ? 'Todos' : b.toUpperCase() }}
              </Button>
            </div>
            <div class="flex-1 flex items-center gap-2">
              <Search class="h-4 w-4 text-muted-foreground" />
              <Input v-model="refSearch" placeholder="Buscar por nombre, simbolo o Z..." class="max-w-xs" />
            </div>
          </div>

          <!-- Leyenda -->
          <div class="flex flex-wrap gap-3 text-xs">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/50"></span> Excepcion al Aufbau
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/50"></span> Bloque s
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded bg-green-500/30 border border-green-500/50"></span> Bloque p
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded bg-purple-500/30 border border-purple-500/50"></span> Bloque d
            </span>
            <span class="flex items-center gap-1">
              <Badge variant="default" class="text-xs px-1 py-0">P</Badge> Paramagnetico
            </span>
            <span class="flex items-center gap-1">
              <Badge variant="secondary" class="text-xs px-1 py-0">D</Badge> Diamagnetico
            </span>
          </div>

          <!-- Tabla -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left px-2 py-2 font-medium text-muted-foreground">Z</th>
                  <th class="text-left px-2 py-2 font-medium text-muted-foreground">Simbolo</th>
                  <th class="text-left px-2 py-2 font-medium text-muted-foreground">Nombre</th>
                  <th class="text-left px-2 py-2 font-medium text-muted-foreground">Configuracion</th>
                  <th class="text-left px-2 py-2 font-medium text-muted-foreground">Gas Noble</th>
                  <th class="text-center px-2 py-2 font-medium text-muted-foreground">Val.</th>
                  <th class="text-center px-2 py-2 font-medium text-muted-foreground">Bloque</th>
                  <th class="text-center px-2 py-2 font-medium text-muted-foreground">Mag.</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in filteredReferenceSearch"
                  :key="row.z"
                  class="border-b border-muted/50 transition-colors hover:bg-muted/30"
                  :class="{
                    'bg-amber-500/5': row.isException,
                  }"
                >
                  <td class="px-2 py-2 font-mono text-muted-foreground">{{ row.z }}</td>
                  <td class="px-2 py-2">
                    <span class="font-bold text-base">{{ row.symbol }}</span>
                    <Badge v-if="row.isException" variant="outline" class="ml-1 text-xs text-amber-600 border-amber-500/50 px-1 py-0">exc</Badge>
                  </td>
                  <td class="px-2 py-2">{{ row.name }}</td>
                  <td class="px-2 py-2 font-mono text-xs">{{ row.config }}</td>
                  <td class="px-2 py-2 font-mono text-xs">{{ row.nobleGas }}</td>
                  <td class="px-2 py-2 text-center font-semibold">{{ row.valence }}</td>
                  <td class="px-2 py-2 text-center">
                    <Badge
                      variant="secondary"
                      class="text-xs uppercase font-bold"
                      :class="{
                        'bg-blue-500/20 text-blue-700 dark:text-blue-300': row.block === 's',
                        'bg-green-500/20 text-green-700 dark:text-green-300': row.block === 'p',
                        'bg-purple-500/20 text-purple-700 dark:text-purple-300': row.block === 'd',
                      }"
                    >
                      {{ row.block }}
                    </Badge>
                  </td>
                  <td class="px-2 py-2 text-center">
                    <Badge
                      :variant="row.paramagnetic ? 'default' : 'secondary'"
                      class="text-xs px-1.5 py-0"
                    >
                      {{ row.paramagnetic ? `P(${row.unpaired})` : 'D' }}
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-xs text-muted-foreground text-center">
            P(n) = Paramagnetico con n electrones desapareados &middot; D = Diamagnetico &middot; Val. = Electrones de valencia &middot; exc = Excepcion al Aufbau
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

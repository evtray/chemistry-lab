<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Atom, CheckCircle, XCircle, ArrowUp, ArrowDown, Layers, Search, Shapes, BookOpen } from 'lucide-vue-next'

// ─── Navigation ───
const activeSection = ref('explorador')
const sections = [
  { id: 'explorador', label: 'Explorador', icon: Atom },
  { id: 'resumen', label: 'Resumen', icon: Layers },
  { id: 'validador', label: 'Validador', icon: Search },
  { id: 'orbitales', label: 'Orbitales', icon: Shapes },
  { id: 'principios', label: 'Principios', icon: BookOpen },
]

// ─── Helpers ───
const orbitalLetters = { 0: 's', 1: 'p', 2: 'd', 3: 'f' }
const orbitalShapes = {
  s: 'Esfera',
  p: 'Pesa (dumbbell)',
  d: 'Trebol (cloverleaf)',
  f: 'Formas complejas multilobulares'
}

// ═══════════════════════════════════════════════
// SECTION 1: Explorador Interactivo
// ═══════════════════════════════════════════════
const explorer = reactive({ n: 2, l: 1, ml: 0, ms: 0.5 })

const explorerValidL = computed(() => {
  const vals = []
  for (let i = 0; i < explorer.n; i++) vals.push(i)
  return vals
})

const explorerValidMl = computed(() => {
  const vals = []
  for (let i = -explorer.l; i <= explorer.l; i++) vals.push(i)
  return vals
})

const explorerOrbitalName = computed(() => `${explorer.n}${orbitalLetters[explorer.l] || '?'}`)
const explorerMaxElectrons = computed(() => 2 * (2 * explorer.l + 1))
const explorerNumOrbitals = computed(() => 2 * explorer.l + 1)

const explorerSummary = computed(() => {
  const spin = explorer.ms > 0 ? 'arriba (↑)' : 'abajo (↓)'
  return `Este electron esta en el orbital ${explorerOrbitalName.value}, ml=${explorer.ml}, spin ${spin}`
})

// Orbital boxes visualization
const explorerBoxes = computed(() => {
  const boxes = []
  for (let m = -explorer.l; m <= explorer.l; m++) {
    let fill = 'empty'
    if (m === explorer.ml) {
      fill = explorer.ms > 0 ? 'up' : 'down'
    }
    boxes.push({ ml: m, fill })
  }
  return boxes
})

watch(() => explorer.n, () => {
  if (explorer.l >= explorer.n) explorer.l = explorer.n - 1
})
watch(() => explorer.l, () => {
  if (explorer.ml < -explorer.l || explorer.ml > explorer.l) explorer.ml = 0
})

function setExplorerN(n) {
  explorer.n = n
  if (explorer.l >= n) explorer.l = 0
  if (explorer.ml < -explorer.l || explorer.ml > explorer.l) explorer.ml = 0
}

// ═══════════════════════════════════════════════
// SECTION 2: Resumen de Numeros Cuanticos
// ═══════════════════════════════════════════════
const quantumNumbers = [
  {
    symbol: 'n',
    name: 'Principal',
    range: '1, 2, 3, 4, 5, 6, 7',
    determines: 'Nivel de energia y distancia al nucleo',
    detail: 'A mayor n, mayor energia y mayor distancia promedio del electron al nucleo. Determina el tamano del orbital.',
    visual: 'Capas concentricas cada vez mas grandes',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    iconColor: 'text-blue-600',
  },
  {
    symbol: 'l',
    name: 'Angular / Azimutal',
    range: '0, 1, ..., n-1',
    determines: 'Forma del orbital (subnivel)',
    detail: 'l=0 → s (esfera), l=1 → p (pesa), l=2 → d (trebol), l=3 → f (complejo). Tambien afecta la energia en atomos multielectronicos.',
    visual: 's = esfera, p = pesa, d = trebol, f = complejo',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconColor: 'text-emerald-600',
  },
  {
    symbol: 'ml',
    name: 'Magnetico',
    range: '-l, ..., 0, ..., +l',
    determines: 'Orientacion del orbital en el espacio',
    detail: 'Determina cuantos orbitales hay en un subnivel (2l+1). Por ejemplo, p tiene 3 orientaciones (px, py, pz).',
    visual: 'Ejes x, y, z para orbitales p',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    iconColor: 'text-purple-600',
  },
  {
    symbol: 'ms',
    name: 'Espin',
    range: '+1/2, -1/2',
    determines: 'Direccion de giro del electron',
    detail: 'Cada orbital puede contener maximo 2 electrones con espines opuestos. +1/2 = spin arriba (↑), -1/2 = spin abajo (↓).',
    visual: '↑ (spin up) y ↓ (spin down)',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    iconColor: 'text-amber-600',
  },
]

// Sublevel table for n=1..4
const sublevelTable = computed(() => {
  const rows = []
  for (let n = 1; n <= 4; n++) {
    for (let l = 0; l < n; l++) {
      const letter = orbitalLetters[l]
      const numOrbitals = 2 * l + 1
      const maxE = 2 * numOrbitals
      rows.push({
        n,
        l,
        letter,
        name: `${n}${letter}`,
        numOrbitals,
        maxElectrons: maxE,
      })
    }
  }
  return rows
})

// ═══════════════════════════════════════════════
// SECTION 3: Validador
// ═══════════════════════════════════════════════
const validator = reactive({ n: '', l: '', ml: '', ms: '' })

const validationResults = computed(() => {
  const n = parseInt(validator.n)
  const l = parseInt(validator.l)
  const ml = parseInt(validator.ml)
  const msStr = validator.ms.toString().trim()

  const errors = []
  const checks = { n: false, l: false, ml: false, ms: false }

  // n validation
  if (validator.n === '') {
    errors.push({ field: 'n', msg: 'Ingrese n' })
  } else if (!Number.isInteger(n) || n < 1 || n > 7) {
    errors.push({ field: 'n', msg: 'n debe ser un entero entre 1 y 7' })
  } else {
    checks.n = true
  }

  // l validation
  if (validator.l === '') {
    errors.push({ field: 'l', msg: 'Ingrese l' })
  } else if (!checks.n) {
    errors.push({ field: 'l', msg: 'Primero corrija n' })
  } else if (!Number.isInteger(l) || l < 0 || l > n - 1) {
    errors.push({ field: 'l', msg: `l debe ser un entero entre 0 y ${n - 1} (n-1)` })
  } else {
    checks.l = true
  }

  // ml validation
  if (validator.ml === '') {
    errors.push({ field: 'ml', msg: 'Ingrese ml' })
  } else if (!checks.l) {
    errors.push({ field: 'ml', msg: 'Primero corrija l' })
  } else if (!Number.isInteger(ml) || ml < -l || ml > l) {
    errors.push({ field: 'ml', msg: `ml debe ser un entero entre ${-l} y +${l}` })
  } else {
    checks.ml = true
  }

  // ms validation
  const msVal = parseFloat(msStr)
  if (msStr === '') {
    errors.push({ field: 'ms', msg: 'Ingrese ms' })
  } else if (msVal !== 0.5 && msVal !== -0.5) {
    errors.push({ field: 'ms', msg: 'ms debe ser +0.5 o -0.5' })
  } else {
    checks.ms = true
  }

  const allValid = checks.n && checks.l && checks.ml && checks.ms

  let info = null
  if (allValid) {
    const letter = orbitalLetters[l] || '?'
    info = {
      orbital: `${n}${letter}`,
      sublevel: letter,
      maxElectrons: 2 * (2 * l + 1),
      numOrbitals: 2 * l + 1,
    }
  }

  return { errors, checks, allValid, info }
})

function getFieldError(field) {
  return validationResults.value.errors.find(e => e.field === field)
}

const presets = [
  { label: '3d, ml=2, ↑ (valido)', n: '3', l: '2', ml: '2', ms: '0.5', valid: true },
  { label: '2p, ml=-1, ↓ (valido)', n: '2', l: '1', ml: '-1', ms: '-0.5', valid: true },
  { label: '1s, ml=0, ↑ (valido)', n: '1', l: '0', ml: '0', ms: '0.5', valid: true },
  { label: '4f, ml=3, ↓ (valido)', n: '4', l: '3', ml: '3', ms: '-0.5', valid: true },
  { label: 'n=2, l=2 (invalido)', n: '2', l: '2', ml: '0', ms: '0.5', valid: false },
  { label: 'n=3, l=1, ml=5 (invalido)', n: '3', l: '1', ml: '5', ms: '0.5', valid: false },
  { label: 'n=1, l=0, ms=0 (invalido)', n: '1', l: '0', ml: '0', ms: '0', valid: false },
  { label: 'n=0 (invalido)', n: '0', l: '0', ml: '0', ms: '0.5', valid: false },
]

function applyPreset(p) {
  validator.n = p.n
  validator.l = p.l
  validator.ml = p.ml
  validator.ms = p.ms
}

// ═══════════════════════════════════════════════
// SECTION 4: Orbitales
// ═══════════════════════════════════════════════
const orbitalTypes = [
  {
    letter: 's',
    l: 0,
    shape: 'Esfera',
    orientations: 1,
    names: ['s'],
    maxElectrons: 2,
    description: 'Simetria esferica. La probabilidad depende solo de la distancia al nucleo.',
    elements: 'H (1s1), He (1s2), Li ([He]2s1)',
    angularNodes: 0,
  },
  {
    letter: 'p',
    l: 1,
    shape: 'Pesa (dumbbell)',
    orientations: 3,
    names: ['px', 'py', 'pz'],
    maxElectrons: 6,
    description: 'Dos lobulos opuestos separados por un plano nodal. Se orientan a lo largo de los ejes x, y, z.',
    elements: 'B (2p1), C (2p2), N (2p3), O (2p4)',
    angularNodes: 1,
  },
  {
    letter: 'd',
    l: 2,
    shape: 'Trebol (cloverleaf)',
    orientations: 5,
    names: ['dxy', 'dxz', 'dyz', 'dx2-y2', 'dz2'],
    maxElectrons: 10,
    description: 'Cuatro lobulos en forma de trebol (excepto dz2 que tiene forma de dona). Aparecen a partir de n=3.',
    elements: 'Sc (3d1), Ti (3d2), Fe (3d6), Cu (3d10)',
    angularNodes: 2,
  },
  {
    letter: 'f',
    l: 3,
    shape: 'Formas complejas multilobulares',
    orientations: 7,
    names: ['fz3', 'fxz2', 'fyz2', 'fxyz', 'fz(x2-y2)', 'fx(x2-3y2)', 'fy(3x2-y2)'],
    maxElectrons: 14,
    description: 'Formas con multiples lobulos. Aparecen a partir de n=4. Importantes en lantanidos y actinidos.',
    elements: 'Ce (4f1), Nd (4f4), U (5f3)',
    angularNodes: 3,
  },
]

// ═══════════════════════════════════════════════
// SECTION 5: Principios
// ═══════════════════════════════════════════════

// Aufbau filling order
const aufbauOrder = [
  '1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d',
  '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'
]

// Diagonal rule matrix
const diagonalMatrix = computed(() => {
  const rows = []
  for (let n = 1; n <= 7; n++) {
    const cols = []
    for (let l = 0; l < Math.min(n, 4); l++) {
      cols.push({ n, l, name: `${n}${orbitalLetters[l]}` })
    }
    rows.push(cols)
  }
  return rows
})

// Hund's rule example
const hundExample = ref('nitrogen')
const hundExamples = {
  nitrogen: {
    name: 'Nitrogeno (N, Z=7)',
    config: '1s2 2s2 2p3',
    orbitals: [
      { name: '1s', boxes: [{ up: true, down: true }] },
      { name: '2s', boxes: [{ up: true, down: true }] },
      { name: '2p', boxes: [{ up: true, down: false }, { up: true, down: false }, { up: true, down: false }] },
    ]
  },
  oxygen: {
    name: 'Oxigeno (O, Z=8)',
    config: '1s2 2s2 2p4',
    orbitals: [
      { name: '1s', boxes: [{ up: true, down: true }] },
      { name: '2s', boxes: [{ up: true, down: true }] },
      { name: '2p', boxes: [{ up: true, down: true }, { up: true, down: false }, { up: true, down: false }] },
    ]
  },
  carbon: {
    name: 'Carbono (C, Z=6)',
    config: '1s2 2s2 2p2',
    orbitals: [
      { name: '1s', boxes: [{ up: true, down: true }] },
      { name: '2s', boxes: [{ up: true, down: true }] },
      { name: '2p', boxes: [{ up: true, down: false }, { up: true, down: false }, { up: false, down: false }] },
    ]
  },
  iron: {
    name: 'Hierro (Fe, Z=26)',
    config: '[Ar] 4s2 3d6',
    orbitals: [
      { name: '4s', boxes: [{ up: true, down: true }] },
      { name: '3d', boxes: [{ up: true, down: true }, { up: true, down: false }, { up: true, down: false }, { up: true, down: false }, { up: true, down: false }] },
    ]
  },
}

// Pauli example
const pauliDemo = reactive({ valid: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Numeros Cuanticos</h1>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Explora los cuatro numeros cuanticos que describen completamente el estado de un electron en un atomo.
      </p>
    </div>

    <!-- Pill Navigation -->
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeSection === sec.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
        @click="activeSection = sec.id"
      >
        <component :is="sec.icon" class="w-4 h-4" />
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 1: Explorador Interactivo          -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'explorador'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Atom class="w-5 h-5 text-primary" />
            Explorador de Numeros Cuanticos
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- n selection -->
          <div class="space-y-2">
            <Label class="text-base font-semibold">
              n (Principal) — Nivel de energia
            </Label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="n in 7"
                :key="n"
                :variant="explorer.n === n ? 'default' : 'outline'"
                size="sm"
                @click="setExplorerN(n)"
                class="w-12 h-10"
              >
                {{ n }}
              </Button>
            </div>
          </div>

          <!-- l selection -->
          <div class="space-y-2">
            <Label class="text-base font-semibold">
              l (Angular) — Forma del orbital
            </Label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="l in explorerValidL"
                :key="l"
                :variant="explorer.l === l ? 'default' : 'outline'"
                size="sm"
                @click="explorer.l = l; if (explorer.ml < -l || explorer.ml > l) explorer.ml = 0"
                class="min-w-[4rem] h-10"
              >
                {{ l }} ({{ orbitalLetters[l] }})
              </Button>
            </div>
            <p class="text-xs text-muted-foreground">Valores validos: 0 a {{ explorer.n - 1 }} (n-1)</p>
          </div>

          <!-- ml selection -->
          <div class="space-y-2">
            <Label class="text-base font-semibold">
              m<sub>l</sub> (Magnetico) — Orientacion del orbital
            </Label>
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="ml in explorerValidMl"
                :key="ml"
                :variant="explorer.ml === ml ? 'default' : 'outline'"
                size="sm"
                @click="explorer.ml = ml"
                class="w-14 h-10"
              >
                {{ ml >= 0 ? '+' : '' }}{{ ml }}
              </Button>
            </div>
            <p class="text-xs text-muted-foreground">Valores validos: {{ -explorer.l }} a +{{ explorer.l }}</p>
          </div>

          <!-- ms selection -->
          <div class="space-y-2">
            <Label class="text-base font-semibold">
              m<sub>s</sub> (Espin) — Giro del electron
            </Label>
            <div class="flex gap-3">
              <Button
                :variant="explorer.ms === 0.5 ? 'default' : 'outline'"
                @click="explorer.ms = 0.5"
                class="flex items-center gap-2"
              >
                <ArrowUp class="w-4 h-4" /> +1/2 (↑)
              </Button>
              <Button
                :variant="explorer.ms === -0.5 ? 'default' : 'outline'"
                @click="explorer.ms = -0.5"
                class="flex items-center gap-2"
              >
                <ArrowDown class="w-4 h-4" /> -1/2 (↓)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Results -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Orbital Info -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Orbital Seleccionado</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span class="text-3xl font-bold text-primary">{{ explorerOrbitalName }}</span>
              </div>
              <div class="space-y-1">
                <p class="text-sm text-muted-foreground">Subnivel: <span class="font-semibold text-foreground">{{ orbitalLetters[explorer.l] }}</span></p>
                <p class="text-sm text-muted-foreground">Orbitales en subnivel: <span class="font-semibold text-foreground">{{ explorerNumOrbitals }}</span></p>
                <p class="text-sm text-muted-foreground">Max electrones: <span class="font-semibold text-foreground">{{ explorerMaxElectrons }}</span></p>
                <p class="text-sm text-muted-foreground">Formula: 2(2l+1) = 2(2·{{ explorer.l }}+1) = {{ explorerMaxElectrons }}</p>
              </div>
            </div>

            <!-- Quantum numbers badge display -->
            <div class="flex flex-wrap gap-2">
              <Badge variant="outline" class="text-sm px-3 py-1">n = {{ explorer.n }}</Badge>
              <Badge variant="outline" class="text-sm px-3 py-1">l = {{ explorer.l }}</Badge>
              <Badge variant="outline" class="text-sm px-3 py-1">ml = {{ explorer.ml }}</Badge>
              <Badge variant="outline" class="text-sm px-3 py-1">ms = {{ explorer.ms > 0 ? '+' : '' }}{{ explorer.ms }}</Badge>
            </div>
          </CardContent>
        </Card>

        <!-- Orbital Boxes Visualization -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Representacion Visual</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">Subnivel {{ explorerOrbitalName }} — {{ explorerNumOrbitals }} orbital{{ explorerNumOrbitals > 1 ? 'es' : '' }}</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <div v-for="box in explorerBoxes" :key="box.ml" class="flex flex-col items-center gap-1">
                <div
                  class="w-14 h-16 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all"
                  :class="box.ml === explorer.ml
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-muted-foreground/30 bg-muted/30'"
                >
                  <span v-if="box.fill === 'up'" class="text-blue-600">↑</span>
                  <span v-else-if="box.fill === 'down'" class="text-red-600">↓</span>
                  <span v-else class="text-muted-foreground/30">·</span>
                </div>
                <span class="text-xs text-muted-foreground">ml={{ box.ml }}</span>
              </div>
            </div>

            <!-- Summary -->
            <div class="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p class="text-sm font-medium text-primary">{{ explorerSummary }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: Resumen                         -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'resumen'" class="space-y-6">
      <!-- Reference Cards -->
      <div class="grid gap-4 md:grid-cols-2">
        <Card v-for="qn in quantumNumbers" :key="qn.symbol" :class="`border-2 ${qn.color.split(' ')[2]}`">
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-3">
              <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${qn.color}`">
                {{ qn.symbol }}
              </div>
              <div>
                <p class="text-lg font-bold">{{ qn.name }}</p>
                <p class="text-sm font-normal text-muted-foreground">Numero cuantico {{ qn.symbol }}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="space-y-2">
              <div class="flex items-start gap-2">
                <Badge variant="outline" class="shrink-0 mt-0.5">Rango</Badge>
                <span class="text-sm">{{ qn.range }}</span>
              </div>
              <div class="flex items-start gap-2">
                <Badge variant="outline" class="shrink-0 mt-0.5">Determina</Badge>
                <span class="text-sm">{{ qn.determines }}</span>
              </div>
              <p class="text-sm text-muted-foreground">{{ qn.detail }}</p>
              <div class="p-2 rounded-md bg-muted/50">
                <p class="text-xs text-muted-foreground italic">{{ qn.visual }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sublevel Table -->
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Subniveles (n = 1 a 4)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2 font-semibold">n</th>
                  <th class="text-left p-2 font-semibold">l</th>
                  <th class="text-left p-2 font-semibold">Subnivel</th>
                  <th class="text-left p-2 font-semibold">Nombre</th>
                  <th class="text-center p-2 font-semibold"># Orbitales (2l+1)</th>
                  <th class="text-center p-2 font-semibold">Max e- [2(2l+1)]</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in sublevelTable" :key="i" class="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td class="p-2 font-medium">{{ row.n }}</td>
                  <td class="p-2">{{ row.l }}</td>
                  <td class="p-2">
                    <Badge variant="secondary">{{ row.letter }}</Badge>
                  </td>
                  <td class="p-2 font-semibold">{{ row.name }}</td>
                  <td class="p-2 text-center">{{ row.numOrbitals }}</td>
                  <td class="p-2 text-center">
                    <Badge>{{ row.maxElectrons }}</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Total electrons per level -->
      <Card>
        <CardHeader>
          <CardTitle>Total de Electrones por Nivel</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="n in 4" :key="n" class="p-4 rounded-xl bg-muted/50 text-center space-y-1">
              <p class="text-2xl font-bold text-primary">{{ 2 * n * n }}</p>
              <p class="text-sm text-muted-foreground">n = {{ n }}</p>
              <p class="text-xs text-muted-foreground">2n² = 2({{ n }})² = {{ 2 * n * n }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 3: Validador                       -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'validador'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Search class="w-5 h-5 text-primary" />
            Validador de Numeros Cuanticos
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Input fields -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- n -->
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                n
                <span v-if="validator.n !== ''">
                  <CheckCircle v-if="validationResults.checks.n" class="w-4 h-4 text-green-600" />
                  <XCircle v-else class="w-4 h-4 text-red-500" />
                </span>
              </Label>
              <Input
                v-model="validator.n"
                placeholder="1-7"
                :class="validator.n !== '' && !validationResults.checks.n ? 'border-red-500' : validator.n !== '' && validationResults.checks.n ? 'border-green-500' : ''"
              />
              <p v-if="getFieldError('n') && validator.n !== ''" class="text-xs text-red-500">{{ getFieldError('n').msg }}</p>
            </div>

            <!-- l -->
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                l
                <span v-if="validator.l !== ''">
                  <CheckCircle v-if="validationResults.checks.l" class="w-4 h-4 text-green-600" />
                  <XCircle v-else class="w-4 h-4 text-red-500" />
                </span>
              </Label>
              <Input
                v-model="validator.l"
                placeholder="0 a n-1"
                :class="validator.l !== '' && !validationResults.checks.l ? 'border-red-500' : validator.l !== '' && validationResults.checks.l ? 'border-green-500' : ''"
              />
              <p v-if="getFieldError('l') && validator.l !== ''" class="text-xs text-red-500">{{ getFieldError('l').msg }}</p>
            </div>

            <!-- ml -->
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                m<sub>l</sub>
                <span v-if="validator.ml !== ''">
                  <CheckCircle v-if="validationResults.checks.ml" class="w-4 h-4 text-green-600" />
                  <XCircle v-else class="w-4 h-4 text-red-500" />
                </span>
              </Label>
              <Input
                v-model="validator.ml"
                placeholder="-l a +l"
                :class="validator.ml !== '' && !validationResults.checks.ml ? 'border-red-500' : validator.ml !== '' && validationResults.checks.ml ? 'border-green-500' : ''"
              />
              <p v-if="getFieldError('ml') && validator.ml !== ''" class="text-xs text-red-500">{{ getFieldError('ml').msg }}</p>
            </div>

            <!-- ms -->
            <div class="space-y-2">
              <Label class="flex items-center gap-2">
                m<sub>s</sub>
                <span v-if="validator.ms !== ''">
                  <CheckCircle v-if="validationResults.checks.ms" class="w-4 h-4 text-green-600" />
                  <XCircle v-else class="w-4 h-4 text-red-500" />
                </span>
              </Label>
              <Input
                v-model="validator.ms"
                placeholder="+0.5 o -0.5"
                :class="validator.ms !== '' && !validationResults.checks.ms ? 'border-red-500' : validator.ms !== '' && validationResults.checks.ms ? 'border-green-500' : ''"
              />
              <p v-if="getFieldError('ms') && validator.ms !== ''" class="text-xs text-red-500">{{ getFieldError('ms').msg }}</p>
            </div>
          </div>

          <!-- Result Card -->
          <div v-if="validationResults.allValid" class="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-800 space-y-2">
            <div class="flex items-center gap-2">
              <CheckCircle class="w-5 h-5 text-green-600" />
              <span class="font-semibold text-green-800 dark:text-green-300">Combinacion valida</span>
            </div>
            <div class="flex flex-wrap gap-3 text-sm">
              <span>Orbital: <strong>{{ validationResults.info.orbital }}</strong></span>
              <span>Subnivel: <strong>{{ validationResults.info.sublevel }}</strong></span>
              <span>Orbitales: <strong>{{ validationResults.info.numOrbitals }}</strong></span>
              <span>Max e-: <strong>{{ validationResults.info.maxElectrons }}</strong></span>
            </div>
          </div>

          <div v-else-if="validator.n !== '' || validator.l !== '' || validator.ml !== '' || validator.ms !== ''" class="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800">
            <div class="flex items-center gap-2">
              <XCircle class="w-5 h-5 text-red-500" />
              <span class="font-semibold text-red-800 dark:text-red-300">Combinacion invalida o incompleta</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Presets -->
      <Card>
        <CardHeader>
          <CardTitle>Pruebas Rapidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              v-for="(preset, i) in presets"
              :key="i"
              variant="outline"
              class="justify-start h-auto py-2 text-left"
              :class="preset.valid ? 'hover:border-green-400' : 'hover:border-red-400'"
              @click="applyPreset(preset)"
            >
              <span class="flex items-center gap-2">
                <CheckCircle v-if="preset.valid" class="w-4 h-4 text-green-600 shrink-0" />
                <XCircle v-else class="w-4 h-4 text-red-500 shrink-0" />
                <span class="text-sm">{{ preset.label }}</span>
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 4: Orbitales                       -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'orbitales'" class="space-y-6">
      <!-- Orbital Type Cards -->
      <div class="grid gap-4 md:grid-cols-2">
        <Card v-for="orb in orbitalTypes" :key="orb.letter">
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-3">
              <div class="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <span class="text-2xl font-bold text-primary">{{ orb.letter }}</span>
              </div>
              <div>
                <p class="text-lg font-bold">Orbital {{ orb.letter }}</p>
                <p class="text-sm font-normal text-muted-foreground">l = {{ orb.l }} | {{ orb.shape }}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- SVG Visual -->
            <div class="flex justify-center py-3">
              <!-- s orbital: sphere -->
              <svg v-if="orb.letter === 's'" width="120" height="120" viewBox="0 0 120 120">
                <defs>
                  <radialGradient id="sGrad" cx="40%" cy="40%">
                    <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.05" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="45" fill="url(#sGrad)" stroke="hsl(var(--primary))" stroke-width="2" />
                <circle cx="60" cy="60" r="3" fill="hsl(var(--primary))" />
                <text x="60" y="115" text-anchor="middle" fill="currentColor" font-size="11">s</text>
              </svg>

              <!-- p orbital: dumbbell -->
              <svg v-if="orb.letter === 'p'" width="280" height="120" viewBox="0 0 280 120">
                <defs>
                  <radialGradient id="pGrad1" cx="50%" cy="50%">
                    <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.05" />
                  </radialGradient>
                </defs>
                <!-- px -->
                <g transform="translate(50,55)">
                  <ellipse cx="-20" cy="0" rx="18" ry="12" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" />
                  <ellipse cx="20" cy="0" rx="18" ry="12" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" />
                  <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" />
                  <text x="0" y="32" text-anchor="middle" fill="currentColor" font-size="10">px</text>
                </g>
                <!-- py -->
                <g transform="translate(140,55)">
                  <ellipse cx="0" cy="-20" rx="12" ry="18" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" />
                  <ellipse cx="0" cy="20" rx="12" ry="18" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" />
                  <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" />
                  <text x="0" y="50" text-anchor="middle" fill="currentColor" font-size="10">py</text>
                </g>
                <!-- pz -->
                <g transform="translate(230,55)">
                  <ellipse cx="-14" cy="-14" rx="16" ry="10" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(-45)" />
                  <ellipse cx="14" cy="14" rx="16" ry="10" fill="url(#pGrad1)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(-45)" />
                  <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" />
                  <text x="0" y="50" text-anchor="middle" fill="currentColor" font-size="10">pz</text>
                </g>
              </svg>

              <!-- d orbital: cloverleaf -->
              <svg v-if="orb.letter === 'd'" width="140" height="140" viewBox="0 0 140 140">
                <defs>
                  <radialGradient id="dGrad" cx="50%" cy="50%">
                    <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.05" />
                  </radialGradient>
                </defs>
                <g transform="translate(70,65)">
                  <!-- 4 lobes -->
                  <ellipse cx="-22" cy="-22" rx="16" ry="10" fill="url(#dGrad)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(45, -22, -22)" />
                  <ellipse cx="22" cy="-22" rx="16" ry="10" fill="url(#dGrad)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(-45, 22, -22)" />
                  <ellipse cx="22" cy="22" rx="16" ry="10" fill="url(#dGrad)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(45, 22, 22)" />
                  <ellipse cx="-22" cy="22" rx="16" ry="10" fill="url(#dGrad)" stroke="hsl(var(--primary))" stroke-width="1.5" transform="rotate(-45, -22, 22)" />
                  <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" />
                </g>
                <text x="70" y="130" text-anchor="middle" fill="currentColor" font-size="11">dxy</text>
              </svg>

              <!-- f orbital: complex -->
              <svg v-if="orb.letter === 'f'" width="160" height="140" viewBox="0 0 160 140">
                <defs>
                  <radialGradient id="fGrad" cx="50%" cy="50%">
                    <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0.05" />
                  </radialGradient>
                </defs>
                <g transform="translate(80,65)">
                  <!-- 8 lobes for f -->
                  <ellipse v-for="angle in [0, 45, 90, 135, 180, 225, 270, 315]" :key="angle"
                    :cx="28 * Math.cos(angle * Math.PI / 180)"
                    :cy="28 * Math.sin(angle * Math.PI / 180)"
                    rx="14" ry="8"
                    fill="url(#fGrad)" stroke="hsl(var(--primary))" stroke-width="1"
                    :transform="`rotate(${angle}, ${28 * Math.cos(angle * Math.PI / 180)}, ${28 * Math.sin(angle * Math.PI / 180)})`"
                  />
                  <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" />
                </g>
                <text x="80" y="130" text-anchor="middle" fill="currentColor" font-size="11">f (esquematico)</text>
              </svg>
            </div>

            <p class="text-sm text-muted-foreground">{{ orb.description }}</p>

            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="p-2 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">Orientaciones</p>
                <p class="font-semibold">{{ orb.orientations }}</p>
              </div>
              <div class="p-2 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">Max electrones</p>
                <p class="font-semibold">{{ orb.maxElectrons }}</p>
              </div>
              <div class="p-2 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">Nodos angulares</p>
                <p class="font-semibold">{{ orb.angularNodes }}</p>
              </div>
              <div class="p-2 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">Ejemplo</p>
                <p class="font-semibold text-xs">{{ orb.elements.split(',')[0] }}</p>
              </div>
            </div>

            <!-- Orbital names -->
            <div class="flex flex-wrap gap-1">
              <Badge v-for="name in orb.names" :key="name" variant="secondary" class="text-xs">{{ name }}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Comparison Table -->
      <Card>
        <CardHeader>
          <CardTitle>Tabla Comparativa de Orbitales</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2 font-semibold">Tipo</th>
                  <th class="text-left p-2 font-semibold">l</th>
                  <th class="text-left p-2 font-semibold">Forma</th>
                  <th class="text-center p-2 font-semibold"># Orientaciones</th>
                  <th class="text-center p-2 font-semibold">Max e-</th>
                  <th class="text-left p-2 font-semibold">Nodos (angular)</th>
                  <th class="text-left p-2 font-semibold">Ejemplos</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="orb in orbitalTypes" :key="orb.letter" class="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td class="p-2 font-bold text-primary">{{ orb.letter }}</td>
                  <td class="p-2">{{ orb.l }}</td>
                  <td class="p-2">{{ orb.shape }}</td>
                  <td class="p-2 text-center">{{ orb.orientations }}</td>
                  <td class="p-2 text-center"><Badge>{{ orb.maxElectrons }}</Badge></td>
                  <td class="p-2">{{ orb.angularNodes }}</td>
                  <td class="p-2 text-xs">{{ orb.elements }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Node formula -->
      <Card>
        <CardHeader>
          <CardTitle>Nodos de un Orbital</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
              <p class="text-sm text-muted-foreground mb-1">Nodos totales</p>
              <p class="text-xl font-bold text-blue-700 dark:text-blue-300">n - 1</p>
            </div>
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
              <p class="text-sm text-muted-foreground mb-1">Nodos angulares</p>
              <p class="text-xl font-bold text-emerald-700 dark:text-emerald-300">l</p>
            </div>
            <div class="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-center">
              <p class="text-sm text-muted-foreground mb-1">Nodos radiales</p>
              <p class="text-xl font-bold text-purple-700 dark:text-purple-300">n - l - 1</p>
            </div>
          </div>
          <p class="text-sm text-muted-foreground">
            Los nodos son regiones donde la probabilidad de encontrar al electron es cero. Los nodos angulares son planos o conos;
            los nodos radiales son superficies esfericas.
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 5: Principios                      -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'principios'" class="space-y-6">
      <!-- Pauli Exclusion Principle -->
      <Card class="border-2 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 font-bold">P</div>
            Principio de Exclusion de Pauli
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p class="font-semibold text-red-800 dark:text-red-300">
              "Dos electrones en un mismo atomo no pueden tener los cuatro numeros cuanticos iguales."
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <!-- Valid -->
            <div class="p-4 rounded-xl border border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 space-y-2">
              <div class="flex items-center gap-2 mb-2">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="font-semibold text-green-800 dark:text-green-300">Correcto</span>
              </div>
              <div class="flex justify-center gap-1">
                <div class="w-12 h-14 border-2 border-green-500 rounded-lg flex items-center justify-center gap-0.5">
                  <span class="text-blue-600 text-lg">↑</span>
                  <span class="text-red-600 text-lg">↓</span>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground">
                (n=1, l=0, ml=0, ms=+1/2) y (n=1, l=0, ml=0, ms=-1/2)
              </p>
              <p class="text-xs text-center text-green-700 dark:text-green-400">Difieren en ms</p>
            </div>
            <!-- Invalid -->
            <div class="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 space-y-2">
              <div class="flex items-center gap-2 mb-2">
                <XCircle class="w-5 h-5 text-red-500" />
                <span class="font-semibold text-red-800 dark:text-red-300">Incorrecto</span>
              </div>
              <div class="flex justify-center gap-1">
                <div class="w-12 h-14 border-2 border-red-500 rounded-lg flex items-center justify-center gap-0.5">
                  <span class="text-blue-600 text-lg">↑</span>
                  <span class="text-blue-600 text-lg">↑</span>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground">
                (n=1, l=0, ml=0, ms=+1/2) y (n=1, l=0, ml=0, ms=+1/2)
              </p>
              <p class="text-xs text-center text-red-700 dark:text-red-400">Los 4 numeros son iguales — IMPOSIBLE</p>
            </div>
          </div>

          <div class="p-3 rounded-lg bg-muted/50">
            <p class="text-sm"><strong>Consecuencia:</strong> Cada orbital puede contener maximo 2 electrones, y deben tener espines opuestos (antiparalelos).</p>
          </div>
        </CardContent>
      </Card>

      <!-- Aufbau Principle -->
      <Card class="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-bold">A</div>
            Principio de Aufbau (Construccion)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p class="font-semibold text-blue-800 dark:text-blue-300">
              "Los electrones llenan los orbitales de menor energia primero."
            </p>
          </div>

          <!-- Diagonal Rule Diagram -->
          <div class="space-y-2">
            <p class="text-sm font-semibold">Regla Diagonal (Regla de Madelung):</p>
            <div class="overflow-x-auto">
              <div class="p-4 rounded-xl bg-muted/30 border min-w-[320px]">
                <div class="space-y-1.5">
                  <div v-for="(row, ri) in diagonalMatrix" :key="ri" class="flex items-center gap-1">
                    <span class="w-8 text-xs text-muted-foreground text-right mr-1">n={{ ri + 1 }}</span>
                    <div v-for="(cell, ci) in row" :key="ci" class="relative">
                      <div
                        class="w-10 h-8 rounded flex items-center justify-center text-xs font-semibold border"
                        :class="aufbauOrder.indexOf(cell.name) >= 0
                          ? 'bg-primary/10 border-primary/40 text-primary'
                          : 'bg-muted border-muted-foreground/20 text-muted-foreground'"
                      >
                        {{ cell.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Filling Order -->
          <div class="space-y-2">
            <p class="text-sm font-semibold">Orden de llenado:</p>
            <div class="flex flex-wrap gap-1.5">
              <template v-for="(orb, i) in aufbauOrder" :key="orb">
                <Badge variant="secondary" class="text-xs font-mono">{{ orb }}</Badge>
                <span v-if="i < aufbauOrder.length - 1" class="text-muted-foreground text-xs flex items-center">→</span>
              </template>
            </div>
          </div>

          <div class="p-3 rounded-lg bg-muted/50">
            <p class="text-sm"><strong>Consecuencia:</strong> El orden de llenado no siempre sigue el orden de n. Por ejemplo, 4s se llena antes que 3d porque tiene menor energia (n+l = 4+0=4 vs 3+2=5).</p>
          </div>
        </CardContent>
      </Card>

      <!-- Hund's Rule -->
      <Card class="border-2 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold">H</div>
            Regla de Hund (Maxima Multiplicidad)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <p class="font-semibold text-emerald-800 dark:text-emerald-300">
              "Los electrones ocupan orbitales degenerados de forma individual (con espines paralelos) antes de emparejarse."
            </p>
          </div>

          <!-- Example selector -->
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="(ex, key) in hundExamples"
              :key="key"
              :variant="hundExample === key ? 'default' : 'outline'"
              size="sm"
              @click="hundExample = key"
            >
              {{ ex.name.split(' (')[0] }}
            </Button>
          </div>

          <!-- Visual Example -->
          <div class="p-4 rounded-xl border bg-muted/20 space-y-3">
            <p class="font-semibold">{{ hundExamples[hundExample].name }}</p>
            <p class="text-sm text-muted-foreground font-mono">{{ hundExamples[hundExample].config }}</p>
            <div class="flex flex-wrap gap-4">
              <div v-for="orbital in hundExamples[hundExample].orbitals" :key="orbital.name" class="space-y-1">
                <div class="flex gap-1">
                  <div
                    v-for="(box, bi) in orbital.boxes"
                    :key="bi"
                    class="w-12 h-14 border-2 border-primary/40 rounded-lg flex items-center justify-center gap-0.5 bg-background"
                  >
                    <span v-if="box.up" class="text-blue-600 text-lg font-bold">↑</span>
                    <span v-if="box.down" class="text-red-600 text-lg font-bold">↓</span>
                    <span v-if="!box.up && !box.down" class="text-muted-foreground/30">·</span>
                  </div>
                </div>
                <p class="text-xs text-center text-muted-foreground">{{ orbital.name }}</p>
              </div>
            </div>
          </div>

          <!-- Correct vs Incorrect for Hund -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl border border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 space-y-2">
              <div class="flex items-center gap-2">
                <CheckCircle class="w-5 h-5 text-green-600" />
                <span class="font-semibold text-green-800 dark:text-green-300">Correcto (Hund)</span>
              </div>
              <div class="flex gap-1 justify-center">
                <div class="w-11 h-13 border-2 border-green-500 rounded-lg flex items-center justify-center"><span class="text-blue-600">↑</span></div>
                <div class="w-11 h-13 border-2 border-green-500 rounded-lg flex items-center justify-center"><span class="text-blue-600">↑</span></div>
                <div class="w-11 h-13 border-2 border-green-500 rounded-lg flex items-center justify-center"><span class="text-muted-foreground/30">·</span></div>
              </div>
              <p class="text-xs text-center text-muted-foreground">2p2: primero uno en cada orbital</p>
            </div>
            <div class="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 space-y-2">
              <div class="flex items-center gap-2">
                <XCircle class="w-5 h-5 text-red-500" />
                <span class="font-semibold text-red-800 dark:text-red-300">Incorrecto</span>
              </div>
              <div class="flex gap-1 justify-center">
                <div class="w-11 h-13 border-2 border-red-500 rounded-lg flex items-center justify-center gap-0.5"><span class="text-blue-600">↑</span><span class="text-red-600">↓</span></div>
                <div class="w-11 h-13 border-2 border-red-500 rounded-lg flex items-center justify-center"><span class="text-muted-foreground/30">·</span></div>
                <div class="w-11 h-13 border-2 border-red-500 rounded-lg flex items-center justify-center"><span class="text-muted-foreground/30">·</span></div>
              </div>
              <p class="text-xs text-center text-muted-foreground">2p2: NO emparejar antes de llenar</p>
            </div>
          </div>

          <div class="p-3 rounded-lg bg-muted/50">
            <p class="text-sm"><strong>Consecuencia:</strong> La configuracion con mas electrones desapareados (espines paralelos) es la mas estable. Esto minimiza la repulsion electronica.</p>
          </div>
        </CardContent>
      </Card>

      <!-- Summary of the 3 principles -->
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Principios</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2 font-semibold">Principio</th>
                  <th class="text-left p-2 font-semibold">Enunciado Clave</th>
                  <th class="text-left p-2 font-semibold">Consecuencia Practica</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b hover:bg-muted/30">
                  <td class="p-2 font-semibold text-red-600">Pauli</td>
                  <td class="p-2">No hay 2 e- con los mismos 4 numeros cuanticos</td>
                  <td class="p-2">Max 2 e- por orbital (espines opuestos)</td>
                </tr>
                <tr class="border-b hover:bg-muted/30">
                  <td class="p-2 font-semibold text-blue-600">Aufbau</td>
                  <td class="p-2">Llenar de menor a mayor energia</td>
                  <td class="p-2">Seguir la regla diagonal (n+l)</td>
                </tr>
                <tr class="hover:bg-muted/30">
                  <td class="p-2 font-semibold text-emerald-600">Hund</td>
                  <td class="p-2">Llenar orbitales degenerados individualmente primero</td>
                  <td class="p-2">Espines paralelos antes de emparejar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

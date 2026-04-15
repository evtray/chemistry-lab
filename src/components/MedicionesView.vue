<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Ruler, AlertTriangle, Droplets, FlaskConical,
  CheckCircle2, XCircle, Calculator, Target,
  Beaker, Thermometer, ArrowRight, BarChart3, Info
} from 'lucide-vue-next'

const activeSection = ref('cifras')
const sections = [
  { id: 'cifras', label: 'Cifras Significativas', icon: Ruler },
  { id: 'error', label: 'Error e Incertidumbre', icon: AlertTriangle },
  { id: 'densidad', label: 'Densidad', icon: Droplets },
  { id: 'calibracion', label: 'Calibración Volumétrica', icon: FlaskConical },
  { id: 'conversiones', label: 'Conversiones y Temperatura', icon: Calculator },
]

// ─── Section 5: Conversiones de unidades ───
const convCategorias = [
  {
    id: 'longitud', label: 'Longitud',
    unidades: [
      { id: 'm', label: 'm', factor: 1 },
      { id: 'cm', label: 'cm', factor: 0.01 },
      { id: 'mm', label: 'mm', factor: 0.001 },
      { id: 'km', label: 'km', factor: 1000 },
      { id: 'in', label: 'in (pulg)', factor: 0.0254 },
      { id: 'ft', label: 'ft (pie)', factor: 0.3048 },
      { id: 'mi', label: 'mi (milla)', factor: 1609.344 },
      { id: 'um', label: 'μm', factor: 1e-6 },
      { id: 'nm', label: 'nm', factor: 1e-9 },
    ]
  },
  {
    id: 'masa', label: 'Masa',
    unidades: [
      { id: 'kg', label: 'kg', factor: 1 },
      { id: 'g', label: 'g', factor: 0.001 },
      { id: 'mg', label: 'mg', factor: 1e-6 },
      { id: 'ug', label: 'μg', factor: 1e-9 },
      { id: 'lb', label: 'lb', factor: 0.453592 },
      { id: 'oz', label: 'oz', factor: 0.0283495 },
      { id: 'ton', label: 'ton (métrica)', factor: 1000 },
    ]
  },
  {
    id: 'volumen', label: 'Volumen',
    unidades: [
      { id: 'L', label: 'L', factor: 1 },
      { id: 'mL', label: 'mL', factor: 0.001 },
      { id: 'uL', label: 'μL', factor: 1e-6 },
      { id: 'm3', label: 'm³', factor: 1000 },
      { id: 'cm3', label: 'cm³', factor: 0.001 },
      { id: 'gal', label: 'gal (US)', factor: 3.78541 },
      { id: 'qt', label: 'qt (US)', factor: 0.946353 },
    ]
  },
  {
    id: 'presion', label: 'Presión',
    unidades: [
      { id: 'atm', label: 'atm', factor: 1 },
      { id: 'mmHg', label: 'mmHg (torr)', factor: 1/760 },
      { id: 'kPa', label: 'kPa', factor: 1/101.325 },
      { id: 'bar', label: 'bar', factor: 1/1.01325 },
      { id: 'psi', label: 'psi', factor: 1/14.696 },
    ]
  },
  {
    id: 'energia', label: 'Energía',
    unidades: [
      { id: 'J', label: 'J', factor: 1 },
      { id: 'kJ', label: 'kJ', factor: 1000 },
      { id: 'cal', label: 'cal', factor: 4.184 },
      { id: 'kcal', label: 'kcal', factor: 4184 },
      { id: 'eV', label: 'eV', factor: 1.602e-19 },
    ]
  }
]

const convCategoria = ref('longitud')
const convDesde = ref('m')
const convHasta = ref('cm')
const convValor = ref('1')

const convUnidades = computed(() => convCategorias.find(c => c.id === convCategoria.value)?.unidades ?? [])
const convResult = computed(() => {
  const val = parseFloat(convValor.value)
  if (!Number.isFinite(val)) return null
  const desde = convUnidades.value.find(u => u.id === convDesde.value)
  const hasta = convUnidades.value.find(u => u.id === convHasta.value)
  if (!desde || !hasta) return null
  const enBase = val * desde.factor
  const resultado = enBase / hasta.factor
  const factorRelativo = desde.factor / hasta.factor
  return {
    resultado,
    factorRelativo,
    pasos: [
      `${val} ${desde.label} × (1 [base] / ${desde.label})`,
      `= ${enBase.toPrecision(6)} [en unidad base]`,
      `× (${hasta.label} / 1 [base]) = ${resultado.toPrecision(6)} ${hasta.label}`,
      `Factor unitario directo: 1 ${desde.label} = ${factorRelativo.toPrecision(4)} ${hasta.label}`
    ]
  }
})

// Temperatura
const tempValor = ref('25')
const tempDesde = ref('C')
const tempResultados = computed(() => {
  const v = parseFloat(tempValor.value)
  if (!Number.isFinite(v)) return null
  let C, K, F
  if (tempDesde.value === 'C') { C = v; K = v + 273.15; F = v * 1.8 + 32 }
  else if (tempDesde.value === 'K') { K = v; C = v - 273.15; F = C * 1.8 + 32 }
  else { F = v; C = (v - 32) / 1.8; K = C + 273.15 }
  return {
    C: C.toFixed(3), K: K.toFixed(3), F: F.toFixed(3),
    pasos: tempDesde.value === 'C'
      ? [`K = °C + 273.15 = ${v} + 273.15 = ${K.toFixed(3)} K`, `°F = °C × 1.8 + 32 = ${v} × 1.8 + 32 = ${F.toFixed(3)} °F`]
      : tempDesde.value === 'K'
      ? [`°C = K − 273.15 = ${v} − 273.15 = ${C.toFixed(3)} °C`, `°F = °C × 1.8 + 32 = ${C.toFixed(3)} × 1.8 + 32 = ${F.toFixed(3)} °F`]
      : [`°C = (°F − 32) / 1.8 = (${v} − 32) / 1.8 = ${C.toFixed(3)} °C`, `K = °C + 273.15 = ${C.toFixed(3)} + 273.15 = ${K.toFixed(3)} K`]
  }
})

// ─── Section 1: Cifras Significativas ───
const csInput = ref('')

function countSigFigs(str) {
  if (!str || str.trim() === '') return { count: 0, digits: [] }
  const s = str.trim().replace(/^-/, '')
  if (!/^[\d.]+$/.test(s)) return { count: 0, digits: [] }
  const hasDecimal = s.includes('.')
  const cleaned = s.replace('.', '')
  const digits = []
  let firstNonZero = -1
  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned[i] !== '0' && firstNonZero === -1) firstNonZero = i
  }
  if (firstNonZero === -1) {
    for (let i = 0; i < cleaned.length; i++) digits.push({ char: cleaned[i], sig: hasDecimal })
    return { count: hasDecimal ? cleaned.length : 1, digits }
  }
  let lastNonZero = cleaned.length - 1
  for (let i = cleaned.length - 1; i >= 0; i--) {
    if (cleaned[i] !== '0') { lastNonZero = i; break }
  }
  for (let i = 0; i < cleaned.length; i++) {
    if (i < firstNonZero) {
      digits.push({ char: cleaned[i], sig: false })
    } else if (hasDecimal) {
      digits.push({ char: cleaned[i], sig: true })
    } else {
      digits.push({ char: cleaned[i], sig: i <= lastNonZero })
    }
  }
  const count = digits.filter(d => d.sig).length
  return { count, digits }
}

const csResult = computed(() => countSigFigs(csInput.value))

const csRules = [
  { rule: 'Todos los dígitos no cero son significativos', example: '1234', cs: '4 CS' },
  { rule: 'Ceros entre dígitos significativos son significativos', example: '1002', cs: '4 CS' },
  { rule: 'Ceros a la izquierda NO son significativos', example: '0.0012', cs: '2 CS' },
  { rule: 'Ceros a la derecha con punto decimal SÍ son significativos', example: '1.200', cs: '4 CS' },
  { rule: 'Ceros a la derecha sin punto decimal son ambiguos', example: '1200', cs: '2-4 CS' },
]

// Operations practice
const opsA = ref('')
const opsB = ref('')
const opsType = ref('suma')
const opsResult = computed(() => {
  const a = parseFloat(opsA.value)
  const b = parseFloat(opsB.value)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  if (opsType.value === 'suma' || opsType.value === 'resta') {
    const decA = (opsA.value.split('.')[1] || '').length
    const decB = (opsB.value.split('.')[1] || '').length
    const minDec = Math.min(decA, decB)
    const raw = opsType.value === 'suma' ? a + b : a - b
    return {
      raw: raw,
      rounded: raw.toFixed(minDec),
      rule: `Menor cantidad de decimales: ${minDec}`,
    }
  } else {
    const sfA = countSigFigs(opsA.value).count
    const sfB = countSigFigs(opsB.value).count
    const minSf = Math.min(sfA, sfB)
    const raw = opsType.value === 'mult' ? a * b : a / b
    return {
      raw: raw,
      rounded: parseFloat(raw.toPrecision(minSf)),
      rule: `Menor cantidad de cifras significativas: ${minSf}`,
    }
  }
})

// Quiz
const quizNumbers = ['0.00340', '50.020', '1200', '3.070', '0.10020']
const quizAnswers = [3, 5, 2, 4, 5]
const quizUserAnswers = ref(['', '', '', '', ''])
const quizChecked = ref(false)
function checkQuiz() { quizChecked.value = true }
function resetQuiz() {
  quizUserAnswers.value = ['', '', '', '', '']
  quizChecked.value = false
}

// ─── Section 2: Error e Incertidumbre ───
const errMedido = ref('')
const errReal = ref('')
const errAbsoluto = computed(() => {
  const m = parseFloat(errMedido.value)
  const r = parseFloat(errReal.value)
  if (!Number.isFinite(m) || !Number.isFinite(r)) return null
  return Math.abs(m - r)
})
const errRelativo = computed(() => {
  const r = parseFloat(errReal.value)
  if (errAbsoluto.value === null || !Number.isFinite(r) || r === 0) return null
  return (errAbsoluto.value / Math.abs(r)) * 100
})

// Desviación media
const desvValues = ref('')
const desvResult = computed(() => {
  const vals = desvValues.value.split(',').map(v => parseFloat(v.trim())).filter(Number.isFinite)
  if (vals.length < 2) return null
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  const devs = vals.map(v => Math.abs(v - mean))
  const desvMedia = devs.reduce((a, b) => a + b, 0) / vals.length
  return { mean: mean.toFixed(4), desvMedia: desvMedia.toFixed(4), n: vals.length }
})

// Incertidumbre relativa
const incertValor = ref('')
const incertIncert = ref('')
const incertResult = computed(() => {
  const v = parseFloat(incertValor.value)
  const i = parseFloat(incertIncert.value)
  if (!Number.isFinite(v) || !Number.isFinite(i) || v === 0) return null
  return ((i / Math.abs(v)) * 100).toFixed(4)
})

// Dartboard data
const dartboards = [
  {
    title: 'Alta exactitud + Alta precisión',
    dots: [[50,48],[52,50],[48,51],[50,52],[51,49]],
    color: '#22c55e',
  },
  {
    title: 'Alta exactitud + Baja precisión',
    dots: [[35,60],[65,40],[45,55],[55,35],[50,65]],
    color: '#3b82f6',
  },
  {
    title: 'Baja exactitud + Alta precisión',
    dots: [[70,72],[72,70],[68,71],[70,68],[71,70]],
    color: '#f59e0b',
  },
  {
    title: 'Baja exactitud + Baja precisión',
    dots: [[30,70],[70,30],[25,40],[65,75],[40,25]],
    color: '#ef4444',
  },
]

// ─── Section 3: Densidad ───
const densMasa = ref('')
const densVol = ref('')
const densResult = computed(() => {
  const m = parseFloat(densMasa.value)
  const v = parseFloat(densVol.value)
  if (!Number.isFinite(m) || !Number.isFinite(v) || v <= 0) return null
  return (m / v).toFixed(4)
})

const densReverse = ref('masa')
const densKnownDens = ref('')
const densKnownVal = ref('')
const densReverseResult = computed(() => {
  const d = parseFloat(densKnownDens.value)
  const v = parseFloat(densKnownVal.value)
  if (!Number.isFinite(d) || !Number.isFinite(v) || d <= 0) return null
  if (densReverse.value === 'masa') return { value: (d * v).toFixed(4), unit: 'g', label: 'Masa' }
  return { value: (v / d).toFixed(4), unit: 'mL', label: 'Volumen' }
})

// Water displacement SVG
const waterLevel = ref(40)
const objectSubmerged = ref(false)
const objectVolume = 15
const displacedLevel = computed(() => objectSubmerged.value ? waterLevel.value + objectVolume : waterLevel.value)

const densTable = [
  { sustancia: 'Agua (25°C)', densidad: '0.9970', unidad: 'g/mL' },
  { sustancia: 'Etanol', densidad: '0.7893', unidad: 'g/mL' },
  { sustancia: 'Cobre', densidad: '8.96', unidad: 'g/cm³' },
  { sustancia: 'Aluminio', densidad: '2.70', unidad: 'g/cm³' },
  { sustancia: 'Hierro', densidad: '7.87', unidad: 'g/cm³' },
  { sustancia: 'Oro', densidad: '19.32', unidad: 'g/cm³' },
  { sustancia: 'Mercurio', densidad: '13.53', unidad: 'g/mL' },
  { sustancia: 'Glicerina', densidad: '1.261', unidad: 'g/mL' },
  { sustancia: 'Acetona', densidad: '0.791', unidad: 'g/mL' },
]

// Problem solver
const psMasa = ref('')
const psVol = ref('')
const psDens = ref('')
const psSolve = computed(() => {
  const m = parseFloat(psMasa.value)
  const v = parseFloat(psVol.value)
  const d = parseFloat(psDens.value)
  const hasM = Number.isFinite(m)
  const hasV = Number.isFinite(v) && v > 0
  const hasD = Number.isFinite(d) && d > 0
  if (hasM && hasV && !hasD) {
    return { found: 'densidad', value: (m / v).toFixed(4), unit: 'g/mL',
      steps: [`ρ = m / V`, `ρ = ${m} / ${v}`, `ρ = ${(m / v).toFixed(4)} g/mL`] }
  }
  if (hasM && hasD && !hasV) {
    return { found: 'volumen', value: (m / d).toFixed(4), unit: 'mL',
      steps: [`V = m / ρ`, `V = ${m} / ${d}`, `V = ${(m / d).toFixed(4)} mL`] }
  }
  if (hasV && hasD && !hasM) {
    return { found: 'masa', value: (d * v).toFixed(4), unit: 'g',
      steps: [`m = ρ × V`, `m = ${d} × ${v}`, `m = ${(d * v).toFixed(4)} g`] }
  }
  return null
})

// ─── Section 4: Calibración Volumétrica ───
const waterDensityTable = [
  { temp: 15, density: 0.99913 },
  { temp: 16, density: 0.99897 },
  { temp: 17, density: 0.99880 },
  { temp: 18, density: 0.99862 },
  { temp: 19, density: 0.99843 },
  { temp: 20, density: 0.99823 },
  { temp: 21, density: 0.99802 },
  { temp: 22, density: 0.99780 },
  { temp: 23, density: 0.99756 },
  { temp: 24, density: 0.99732 },
  { temp: 25, density: 0.99707 },
  { temp: 26, density: 0.99681 },
  { temp: 27, density: 0.99654 },
  { temp: 28, density: 0.99626 },
  { temp: 29, density: 0.99597 },
  { temp: 30, density: 0.99567 },
]

function getWaterDensity(temp) {
  const t = parseFloat(temp)
  if (!Number.isFinite(t)) return null
  const entry = waterDensityTable.find(e => e.temp === Math.round(t))
  if (entry) return entry.density
  // Linear interpolation
  const lower = waterDensityTable.filter(e => e.temp <= t).pop()
  const upper = waterDensityTable.find(e => e.temp > t)
  if (!lower || !upper) return null
  const frac = (t - lower.temp) / (upper.temp - lower.temp)
  return lower.density + frac * (upper.density - lower.density)
}

const calMasa = ref('')
const calTemp = ref('')
const calResult = computed(() => {
  const m = parseFloat(calMasa.value)
  const t = parseFloat(calTemp.value)
  if (!Number.isFinite(m) || !Number.isFinite(t)) return null
  const rho = getWaterDensity(t)
  if (!rho) return null
  return { vol: (m / rho).toFixed(4), rho: rho.toFixed(5) }
})

// Instrument comparison
const instruments = reactive([
  { name: 'Bureta', medida: '', incert: '' },
  { name: 'Probeta', medida: '', incert: '' },
  { name: 'Pipeta', medida: '', incert: '' },
  { name: 'Balón aforado', medida: '', incert: '' },
])

const instrumentResults = computed(() => {
  const results = instruments.map(inst => {
    const m = parseFloat(inst.medida)
    const i = parseFloat(inst.incert)
    if (!Number.isFinite(m) || !Number.isFinite(i) || m === 0) return null
    return { name: inst.name, relUncert: ((i / Math.abs(m)) * 100).toFixed(4) }
  }).filter(Boolean)
  if (results.length === 0) return { results: [], best: null }
  const best = results.reduce((a, b) => parseFloat(a.relUncert) < parseFloat(b.relUncert) ? a : b)
  return { results, best: best.name }
})

// Incertidumbre relativa for instruments
const irValor = ref('')
const irIncert = ref('')
const irResult = computed(() => {
  const v = parseFloat(irValor.value)
  const i = parseFloat(irIncert.value)
  if (!Number.isFinite(v) || !Number.isFinite(i) || v === 0) return null
  return ((i / Math.abs(v)) * 100).toFixed(4)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Navigation Pills -->
    <div class="flex flex-wrap gap-2">
      <Button
        v-for="s in sections"
        :key="s.id"
        :variant="activeSection === s.id ? 'default' : 'outline'"
        size="sm"
        class="gap-2"
        @click="activeSection = s.id"
      >
        <component :is="s.icon" class="w-4 h-4" />
        {{ s.label }}
      </Button>
    </div>

    <!-- ══════════ SECTION 1: CIFRAS SIGNIFICATIVAS ══════════ -->
    <div v-if="activeSection === 'cifras'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Ruler class="w-5 h-5 text-primary" />
            Analizador de Cifras Significativas
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label>Ingresa un número:</Label>
            <Input v-model="csInput" placeholder="Ej: 0.00340" class="mt-1 max-w-xs" />
          </div>
          <div v-if="csResult.digits.length > 0" class="space-y-3">
            <div class="flex items-center gap-1 text-2xl font-mono">
              <template v-for="(d, i) in csResult.digits" :key="i">
                <span v-if="i === csInput.replace('-','').indexOf('.') && csInput.includes('.')"
                      class="text-muted-foreground">.</span>
                <span
                  :class="d.sig ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300'"
                  class="inline-flex items-center justify-center w-8 h-10 rounded border font-bold"
                >{{ d.char }}</span>
              </template>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="default">{{ csResult.count }} cifras significativas</Badge>
              <span class="flex items-center gap-1 text-sm">
                <span class="w-3 h-3 rounded bg-green-400 inline-block"></span> Significativo
                <span class="w-3 h-3 rounded bg-red-400 inline-block ml-2"></span> No significativo
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Rules -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Info class="w-5 h-5 text-primary" />
            Reglas de Cifras Significativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-3">
            <div
              v-for="(r, i) in csRules"
              :key="i"
              class="flex items-start gap-3 rounded-lg border p-3"
            >
              <Badge variant="outline" class="mt-0.5 shrink-0">{{ i + 1 }}</Badge>
              <div class="flex-1">
                <p class="font-medium text-sm">{{ r.rule }}</p>
                <p class="text-sm text-muted-foreground mt-1">
                  Ejemplo: <code class="bg-muted px-1 rounded">{{ r.example }}</code>
                  <ArrowRight class="w-3 h-3 inline mx-1" />
                  <Badge variant="secondary" class="text-xs">{{ r.cs }}</Badge>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Operations Practice -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-primary" />
            Práctica de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="op in [{id:'suma',label:'Suma'},{id:'resta',label:'Resta'},{id:'mult',label:'Multiplicación'},{id:'div',label:'División'}]"
              :key="op.id"
              :variant="opsType === op.id ? 'default' : 'outline'"
              size="sm"
              @click="opsType = op.id"
            >{{ op.label }}</Button>
          </div>
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Valor A</Label>
              <Input v-model="opsA" placeholder="Ej: 12.34" class="mt-1" />
            </div>
            <div>
              <Label>Valor B</Label>
              <Input v-model="opsB" placeholder="Ej: 5.6" class="mt-1" />
            </div>
          </div>
          <div v-if="opsResult" class="rounded-lg bg-muted p-4 space-y-1">
            <p class="text-sm">
              <span class="font-medium">Resultado sin redondear:</span>
              {{ opsResult.raw }}
            </p>
            <p class="text-sm">
              <span class="font-medium">Resultado redondeado:</span>
              <Badge variant="default" class="ml-1">{{ opsResult.rounded }}</Badge>
            </p>
            <p class="text-xs text-muted-foreground">{{ opsResult.rule }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Quiz -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Target class="w-5 h-5 text-primary" />
            Mini Quiz: Cifras Significativas
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Indica cuántas cifras significativas tiene cada número:
          </p>
          <div class="grid gap-3">
            <div
              v-for="(num, i) in quizNumbers"
              :key="i"
              class="flex items-center gap-3"
            >
              <code class="bg-muted px-2 py-1 rounded font-mono text-sm min-w-[80px]">{{ num }}</code>
              <Input
                v-model="quizUserAnswers[i]"
                placeholder="CS"
                class="w-20"
                type="number"
              />
              <CheckCircle2 v-if="quizChecked && parseInt(quizUserAnswers[i]) === quizAnswers[i]" class="w-5 h-5 text-green-500" />
              <XCircle v-if="quizChecked && parseInt(quizUserAnswers[i]) !== quizAnswers[i]" class="w-5 h-5 text-red-500" />
              <span v-if="quizChecked && parseInt(quizUserAnswers[i]) !== quizAnswers[i]" class="text-sm text-red-500">
                Respuesta: {{ quizAnswers[i] }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button size="sm" @click="checkQuiz">Verificar</Button>
            <Button size="sm" variant="outline" @click="resetQuiz">Reiniciar</Button>
          </div>
          <div v-if="quizChecked">
            <Badge :variant="quizUserAnswers.every((a, i) => parseInt(a) === quizAnswers[i]) ? 'default' : 'secondary'">
              {{ quizUserAnswers.filter((a, i) => parseInt(a) === quizAnswers[i]).length }} / {{ quizNumbers.length }} correctas
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ══════════ SECTION 2: ERROR E INCERTIDUMBRE ══════════ -->
    <div v-if="activeSection === 'error'" class="space-y-6">
      <!-- Error Absoluto y Relativo -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <AlertTriangle class="w-5 h-5 text-primary" />
            Calculadora de Error
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Valor medido</Label>
              <Input v-model="errMedido" placeholder="Ej: 9.85" class="mt-1" />
            </div>
            <div>
              <Label>Valor real (teórico)</Label>
              <Input v-model="errReal" placeholder="Ej: 9.81" class="mt-1" />
            </div>
          </div>
          <div v-if="errAbsoluto !== null" class="grid grid-cols-2 gap-3 max-w-md">
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">Error absoluto</p>
              <p class="text-lg font-bold">{{ errAbsoluto.toFixed(4) }}</p>
              <p class="text-xs text-muted-foreground mt-1">|medido - real|</p>
            </div>
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">Error relativo %</p>
              <p class="text-lg font-bold">{{ errRelativo !== null ? errRelativo.toFixed(4) + '%' : '—' }}</p>
              <p class="text-xs text-muted-foreground mt-1">(|error| / real) × 100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Desviación Media -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-primary" />
            Desviación Media
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label>Valores separados por coma:</Label>
            <Input v-model="desvValues" placeholder="Ej: 10.2, 10.5, 10.3, 10.1, 10.4" class="mt-1 max-w-lg" />
          </div>
          <div v-if="desvResult" class="grid grid-cols-3 gap-3">
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">Media (x̄)</p>
              <p class="text-lg font-bold">{{ desvResult.mean }}</p>
            </div>
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">Desviación media</p>
              <p class="text-lg font-bold">{{ desvResult.desvMedia }}</p>
            </div>
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">n</p>
              <p class="text-lg font-bold">{{ desvResult.n }}</p>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">Fórmula: d̄ = Σ|xᵢ - x̄| / n</p>
        </CardContent>
      </Card>

      <!-- Incertidumbre Relativa -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-primary" />
            Incertidumbre Relativa
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Valor medido</Label>
              <Input v-model="incertValor" placeholder="Ej: 25.00" class="mt-1" />
            </div>
            <div>
              <Label>Incertidumbre (±)</Label>
              <Input v-model="incertIncert" placeholder="Ej: 0.05" class="mt-1" />
            </div>
          </div>
          <div v-if="irResult !== null || incertResult !== null" class="rounded-lg bg-muted p-3 max-w-md">
            <p class="text-xs text-muted-foreground">Incertidumbre relativa %</p>
            <p class="text-lg font-bold">{{ incertResult }}%</p>
            <p class="text-xs text-muted-foreground mt-1">(incertidumbre / valor) × 100</p>
          </div>
        </CardContent>
      </Card>

      <!-- Exactitud vs Precisión Dartboards -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Target class="w-5 h-5 text-primary" />
            Exactitud vs Precisión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(db, i) in dartboards" :key="i" class="text-center space-y-2">
              <svg viewBox="0 0 100 100" class="w-full max-w-[140px] mx-auto">
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="0.5" class="text-muted-foreground" />
                <circle cx="50" cy="50" r="36" fill="none" stroke="currentColor" stroke-width="0.5" class="text-muted-foreground" />
                <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" stroke-width="0.5" class="text-muted-foreground" />
                <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="0.5" class="text-muted-foreground" />
                <circle cx="50" cy="50" r="3" fill="currentColor" class="text-muted-foreground" opacity="0.3" />
                <circle
                  v-for="(dot, j) in db.dots"
                  :key="j"
                  :cx="dot[0]"
                  :cy="dot[1]"
                  r="3"
                  :fill="db.color"
                  opacity="0.85"
                >
                  <animate attributeName="r" values="0;3" dur="0.5s" :begin="(j * 0.15) + 's'" fill="freeze" />
                </circle>
              </svg>
              <p class="text-xs font-medium leading-tight">{{ db.title }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Propagación de Error -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Info class="w-5 h-5 text-primary" />
            Propagación de Error
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="rounded-lg border p-4 space-y-2">
              <Badge variant="outline">Suma / Resta</Badge>
              <p class="text-sm font-medium">R = a ± b</p>
              <div class="bg-muted rounded p-3 text-center font-mono text-sm">
                ΔR = √(Δa² + Δb²)
              </div>
              <p class="text-xs text-muted-foreground">
                Se suman los cuadrados de las incertidumbres absolutas
              </p>
            </div>
            <div class="rounded-lg border p-4 space-y-2">
              <Badge variant="outline">Multiplicación / División</Badge>
              <p class="text-sm font-medium">R = a × b o R = a / b</p>
              <div class="bg-muted rounded p-3 text-center font-mono text-sm">
                ΔR/R = √((Δa/a)² + (Δb/b)²)
              </div>
              <p class="text-xs text-muted-foreground">
                Se suman los cuadrados de las incertidumbres relativas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ══════════ SECTION 3: DENSIDAD ══════════ -->
    <div v-if="activeSection === 'densidad'" class="space-y-6">
      <!-- Direct Calculator -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Droplets class="w-5 h-5 text-primary" />
            Calculadora de Densidad (ρ = m / V)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Masa (g)</Label>
              <Input v-model="densMasa" placeholder="Ej: 45.2" class="mt-1" />
            </div>
            <div>
              <Label>Volumen (mL)</Label>
              <Input v-model="densVol" placeholder="Ej: 25.0" class="mt-1" />
            </div>
          </div>
          <div v-if="densResult" class="rounded-lg bg-muted p-4">
            <p class="text-xs text-muted-foreground">Densidad</p>
            <p class="text-2xl font-bold">{{ densResult }} g/mL</p>
          </div>
        </CardContent>
      </Card>

      <!-- Reverse Calculator -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-primary" />
            Calculadora Inversa
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex gap-2">
            <Button
              :variant="densReverse === 'masa' ? 'default' : 'outline'"
              size="sm"
              @click="densReverse = 'masa'"
            >Encontrar masa</Button>
            <Button
              :variant="densReverse === 'volumen' ? 'default' : 'outline'"
              size="sm"
              @click="densReverse = 'volumen'"
            >Encontrar volumen</Button>
          </div>
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Densidad (g/mL)</Label>
              <Input v-model="densKnownDens" placeholder="Ej: 1.808" class="mt-1" />
            </div>
            <div>
              <Label>{{ densReverse === 'masa' ? 'Volumen (mL)' : 'Masa (g)' }}</Label>
              <Input v-model="densKnownVal" :placeholder="densReverse === 'masa' ? 'Ej: 25.0' : 'Ej: 45.2'" class="mt-1" />
            </div>
          </div>
          <div v-if="densReverseResult" class="rounded-lg bg-muted p-4">
            <p class="text-xs text-muted-foreground">{{ densReverseResult.label }}</p>
            <p class="text-2xl font-bold">{{ densReverseResult.value }} {{ densReverseResult.unit }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Water Displacement SVG -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Beaker class="w-5 h-5 text-primary" />
            Desplazamiento de Agua (Método Visual)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <Button size="sm" :variant="!objectSubmerged ? 'default' : 'outline'" @click="objectSubmerged = false">
              Sin objeto
            </Button>
            <Button size="sm" :variant="objectSubmerged ? 'default' : 'outline'" @click="objectSubmerged = true">
              Con objeto sumergido
            </Button>
          </div>
          <div class="flex items-end gap-8">
            <svg viewBox="0 0 120 200" class="w-32 h-64">
              <!-- Cylinder body -->
              <rect x="25" y="20" width="70" height="160" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground" />
              <!-- Graduation marks -->
              <line v-for="n in 8" :key="n" :x1="25" :y1="20 + n * 18" :x2="35" :y2="20 + n * 18" stroke="currentColor" stroke-width="0.5" class="text-muted-foreground" />
              <!-- Water -->
              <rect
                x="26"
                :y="180 - displacedLevel * 2"
                width="68"
                :height="displacedLevel * 2"
                fill="#3b82f6"
                opacity="0.3"
                class="transition-all duration-500"
              />
              <!-- Water level line -->
              <line
                x1="26"
                :y1="180 - displacedLevel * 2"
                x2="94"
                :y2="180 - displacedLevel * 2"
                stroke="#3b82f6"
                stroke-width="1.5"
                class="transition-all duration-500"
              />
              <!-- Object -->
              <rect
                v-if="objectSubmerged"
                x="42"
                :y="180 - waterLevel * 2 - 20"
                width="36"
                height="20"
                rx="2"
                fill="#f59e0b"
                opacity="0.8"
                class="transition-all duration-500"
              />
              <!-- Level labels -->
              <text x="98" :y="180 - waterLevel * 2 + 4" font-size="8" fill="currentColor" class="text-muted-foreground">
                V₁ = {{ waterLevel }} mL
              </text>
              <text v-if="objectSubmerged" x="98" :y="180 - displacedLevel * 2 + 4" font-size="8" fill="#3b82f6">
                V₂ = {{ displacedLevel }} mL
              </text>
            </svg>
            <div class="space-y-2 text-sm">
              <p><span class="font-medium">Nivel inicial (V₁):</span> {{ waterLevel }} mL</p>
              <p v-if="objectSubmerged">
                <span class="font-medium">Nivel con objeto (V₂):</span> {{ displacedLevel }} mL
              </p>
              <p v-if="objectSubmerged">
                <span class="font-medium">Volumen del objeto:</span>
                <Badge variant="default" class="ml-1">{{ objectVolume }} mL</Badge>
              </p>
              <p v-if="objectSubmerged" class="text-xs text-muted-foreground">
                V_objeto = V₂ - V₁ = {{ displacedLevel }} - {{ waterLevel }} = {{ objectVolume }} mL
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Density Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Info class="w-5 h-5 text-primary" />
            Tabla de Densidades Comunes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 px-3 font-medium">Sustancia</th>
                  <th class="text-right py-2 px-3 font-medium">Densidad</th>
                  <th class="text-right py-2 px-3 font-medium">Unidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in densTable" :key="d.sustancia" class="border-b last:border-0">
                  <td class="py-2 px-3">{{ d.sustancia }}</td>
                  <td class="py-2 px-3 text-right font-mono">{{ d.densidad }}</td>
                  <td class="py-2 px-3 text-right text-muted-foreground">{{ d.unidad }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Problem Solver -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-primary" />
            Resolver Problemas (Paso a Paso)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Ingresa 2 de los 3 valores y se calculará el tercero:</p>
          <div class="grid grid-cols-3 gap-3 max-w-lg">
            <div>
              <Label>Masa (g)</Label>
              <Input v-model="psMasa" placeholder="?" class="mt-1" />
            </div>
            <div>
              <Label>Volumen (mL)</Label>
              <Input v-model="psVol" placeholder="?" class="mt-1" />
            </div>
            <div>
              <Label>Densidad (g/mL)</Label>
              <Input v-model="psDens" placeholder="?" class="mt-1" />
            </div>
          </div>
          <div v-if="psSolve" class="rounded-lg border p-4 space-y-2">
            <Badge variant="default">{{ psSolve.found }} encontrada</Badge>
            <p class="text-2xl font-bold">{{ psSolve.value }} {{ psSolve.unit }}</p>
            <div class="space-y-1">
              <p class="text-xs font-medium text-muted-foreground">Paso a paso:</p>
              <p v-for="(step, i) in psSolve.steps" :key="i" class="text-sm font-mono">
                {{ step }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ══════════ SECTION 4: CALIBRACIÓN VOLUMÉTRICA ══════════ -->
    <div v-if="activeSection === 'calibracion'" class="space-y-6">
      <!-- Concept -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FlaskConical class="w-5 h-5 text-primary" />
            ¿Por qué calibrar?
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <p class="text-sm">
            El volumen que marca un instrumento (volumen nominal) puede diferir del volumen real
            que contiene. La densidad del agua varía con la temperatura, por lo que al pesar el
            agua contenida y conocer la temperatura, podemos calcular el volumen real.
          </p>
          <div class="bg-muted rounded-lg p-4 text-center">
            <p class="font-mono text-lg font-bold">V_real = m_agua / ρ_agua(T)</p>
            <p class="text-xs text-muted-foreground mt-1">
              Donde ρ_agua(T) es la densidad del agua a la temperatura T
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Volume Correction Calculator -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Thermometer class="w-5 h-5 text-primary" />
            Corrección de Volumen
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Masa del agua (g)</Label>
              <Input v-model="calMasa" placeholder="Ej: 24.85" class="mt-1" />
            </div>
            <div>
              <Label>Temperatura (°C)</Label>
              <Input v-model="calTemp" placeholder="15-30" class="mt-1" />
            </div>
          </div>
          <div v-if="calResult" class="grid grid-cols-2 gap-3 max-w-md">
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">ρ_agua(T)</p>
              <p class="text-lg font-bold">{{ calResult.rho }} g/mL</p>
            </div>
            <div class="rounded-lg bg-muted p-3">
              <p class="text-xs text-muted-foreground">Volumen real</p>
              <p class="text-lg font-bold">{{ calResult.vol }} mL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Water Density Table -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Droplets class="w-5 h-5 text-primary" />
            Densidad del Agua según Temperatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 px-3 font-medium">T (°C)</th>
                  <th class="text-right py-2 px-3 font-medium">ρ (g/mL)</th>
                  <th class="text-left py-2 px-3 font-medium">T (°C)</th>
                  <th class="text-right py-2 px-3 font-medium">ρ (g/mL)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 8" :key="i" class="border-b last:border-0">
                  <td class="py-2 px-3">{{ waterDensityTable[i - 1].temp }}</td>
                  <td class="py-2 px-3 text-right font-mono">{{ waterDensityTable[i - 1].density.toFixed(5) }}</td>
                  <td class="py-2 px-3">{{ waterDensityTable[i + 7].temp }}</td>
                  <td class="py-2 px-3 text-right font-mono">{{ waterDensityTable[i + 7].density.toFixed(5) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Instrument Uncertainty Calculator -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Calculator class="w-5 h-5 text-primary" />
            Incertidumbre Relativa de Instrumentos
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <Label>Valor medido</Label>
              <Input v-model="irValor" placeholder="Ej: 25.00" class="mt-1" />
            </div>
            <div>
              <Label>Incertidumbre (±)</Label>
              <Input v-model="irIncert" placeholder="Ej: 0.05" class="mt-1" />
            </div>
          </div>
          <div v-if="irResult" class="rounded-lg bg-muted p-3 max-w-md">
            <p class="text-xs text-muted-foreground">Incertidumbre relativa %</p>
            <p class="text-lg font-bold">{{ irResult }}%</p>
          </div>
        </CardContent>
      </Card>

      <!-- Instrument Comparison -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <BarChart3 class="w-5 h-5 text-primary" />
            Comparación de Instrumentos
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Ingresa las mediciones e incertidumbres de cada instrumento para determinar cuál es más preciso:
          </p>
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="(inst, i) in instruments" :key="i" class="rounded-lg border p-3 space-y-2">
              <p class="font-medium text-sm">{{ inst.name }}</p>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <Label class="text-xs">Medida (mL)</Label>
                  <Input v-model="inst.medida" placeholder="Ej: 25.0" class="mt-1" />
                </div>
                <div>
                  <Label class="text-xs">Incertidumbre (±)</Label>
                  <Input v-model="inst.incert" placeholder="Ej: 0.05" class="mt-1" />
                </div>
              </div>
            </div>
          </div>
          <div v-if="instrumentResults.results.length > 0" class="space-y-3">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b">
                    <th class="text-left py-2 px-3 font-medium">Instrumento</th>
                    <th class="text-right py-2 px-3 font-medium">Incert. relativa %</th>
                    <th class="text-center py-2 px-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in instrumentResults.results" :key="r.name" class="border-b last:border-0">
                    <td class="py-2 px-3">{{ r.name }}</td>
                    <td class="py-2 px-3 text-right font-mono">{{ r.relUncert }}%</td>
                    <td class="py-2 px-3 text-center">
                      <Badge v-if="r.name === instrumentResults.best" variant="default">
                        Más preciso
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="instrumentResults.best" class="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 flex items-center gap-2">
              <CheckCircle2 class="w-5 h-5 text-green-600" />
              <p class="text-sm">
                El instrumento más preciso es: <span class="font-bold">{{ instrumentResults.best }}</span>
                (menor incertidumbre relativa)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══ CONVERSIONES Y TEMPERATURA ═══ -->
    <div v-if="activeSection === 'conversiones'" class="space-y-6">
      <!-- Conversión de unidades -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base flex items-center gap-2">
            <Calculator class="size-4" /> Convertidor de Unidades (Factor Unitario)
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Categoría -->
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="cat in convCategorias" :key="cat.id"
              :variant="convCategoria === cat.id ? 'default' : 'outline'"
              size="sm"
              @click="convCategoria = cat.id; convDesde = convUnidades[0]?.id; convHasta = convUnidades[1]?.id"
            >{{ cat.label }}</Button>
          </div>

          <div class="grid gap-3 sm:grid-cols-3 items-end">
            <div class="space-y-1">
              <label class="text-sm font-medium">Valor</label>
              <input v-model="convValor" type="number" step="any"
                class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">Desde</label>
              <select v-model="convDesde" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="u in convUnidades" :key="u.id" :value="u.id">{{ u.label }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">Hasta</label>
              <select v-model="convHasta" class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option v-for="u in convUnidades" :key="u.id" :value="u.id">{{ u.label }}</option>
              </select>
            </div>
          </div>

          <div v-if="convResult" class="rounded bg-primary/10 border border-primary/20 p-4 space-y-2">
            <p class="text-xl font-bold font-mono text-primary">
              {{ convValor }} {{ convUnidades.find(u => u.id === convDesde)?.label }} = {{ convResult.resultado.toPrecision(6) }} {{ convUnidades.find(u => u.id === convHasta)?.label }}
            </p>
            <div class="space-y-0.5">
              <p v-for="paso in convResult.pasos" :key="paso" class="text-xs font-mono text-muted-foreground">{{ paso }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Conversión de Temperatura -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base flex items-center gap-2">
            <Thermometer class="size-4" /> Conversión de Temperatura
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2 items-end">
            <div class="space-y-1">
              <label class="text-sm font-medium">Valor</label>
              <input v-model="tempValor" type="number" step="any"
                class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">Unidad de entrada</label>
              <div class="flex gap-2">
                <Button v-for="t in [{ id: 'C', label: '°C' }, { id: 'K', label: 'K' }, { id: 'F', label: '°F' }]"
                  :key="t.id" :variant="tempDesde === t.id ? 'default' : 'outline'" size="sm"
                  @click="tempDesde = t.id">{{ t.label }}</Button>
              </div>
            </div>
          </div>

          <div v-if="tempResultados" class="grid gap-3 sm:grid-cols-3">
            <div class="rounded border p-3 text-center" :class="tempDesde === 'C' ? 'border-primary bg-primary/5' : ''">
              <p class="text-xs text-muted-foreground mb-1">Celsius (°C)</p>
              <p class="text-2xl font-bold font-mono text-blue-600">{{ tempResultados.C }}</p>
            </div>
            <div class="rounded border p-3 text-center" :class="tempDesde === 'K' ? 'border-primary bg-primary/5' : ''">
              <p class="text-xs text-muted-foreground mb-1">Kelvin (K)</p>
              <p class="text-2xl font-bold font-mono text-orange-600">{{ tempResultados.K }}</p>
            </div>
            <div class="rounded border p-3 text-center" :class="tempDesde === 'F' ? 'border-primary bg-primary/5' : ''">
              <p class="text-xs text-muted-foreground mb-1">Fahrenheit (°F)</p>
              <p class="text-2xl font-bold font-mono text-purple-600">{{ tempResultados.F }}</p>
            </div>
          </div>

          <div v-if="tempResultados" class="space-y-0.5">
            <p v-for="paso in tempResultados.pasos" :key="paso" class="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">{{ paso }}</p>
          </div>

          <div class="grid gap-2 sm:grid-cols-3 text-sm">
            <div class="bg-muted rounded p-2 font-mono text-center">K = °C + 273.15</div>
            <div class="bg-muted rounded p-2 font-mono text-center">°F = °C × 1.8 + 32</div>
            <div class="bg-muted rounded p-2 font-mono text-center">°C = (°F − 32) / 1.8</div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

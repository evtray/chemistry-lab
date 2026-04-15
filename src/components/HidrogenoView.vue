<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Atom, Waves, BarChart3, Zap, ArrowDown, ArrowUp, Calculator, Info } from 'lucide-vue-next'

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════
const activeSection = ref('bohr')
const sections = [
  { id: 'bohr', label: 'Modelo de Bohr', icon: Atom },
  { id: 'series', label: 'Series Espectrales', icon: Waves },
  { id: 'niveles', label: 'Niveles de Energia', icon: BarChart3 },
  { id: 'pozo', label: 'Pozo de Potencial', icon: Zap },
]

// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════
const RH_J = 2.1799e-18       // Rydberg energy in J
const R_inf = 1.097373e7      // Rydberg constant in m⁻¹
const a0_m = 5.2918e-11       // Bohr radius in m
const a0_A = 0.529            // Bohr radius in Angstroms
const eV_per_J = 6.242e18     // eV per Joule
const h = 6.626e-34           // Planck constant J·s
const c_light = 2.998e8       // Speed of light m/s

function sci(num, d = 3) {
  if (num === 0) return '0'
  return num.toExponential(d)
}

function energyN(n) {
  return -13.6 / (n * n)
}

function energyN_J(n) {
  return -RH_J / (n * n)
}

function radiusN(n) {
  return a0_A * n * n
}

function radiusN_m(n) {
  return a0_m * n * n
}

function wavelengthNm(n1, n2) {
  const nLow = Math.min(n1, n2)
  const nHigh = Math.max(n1, n2)
  const invLambda = R_inf * (1 / (nLow * nLow) - 1 / (nHigh * nHigh))
  return 1 / invLambda * 1e9
}

function frequencyHz(lambdaNm) {
  return c_light / (lambdaNm * 1e-9)
}

function wavelengthToColor(nm) {
  if (nm < 380) return '#7c3aed'
  if (nm < 420) return '#6d28d9'
  if (nm < 440) return '#4338ca'
  if (nm < 490) return '#2563eb'
  if (nm < 510) return '#0891b2'
  if (nm < 530) return '#16a34a'
  if (nm < 570) return '#65a30d'
  if (nm < 590) return '#ca8a04'
  if (nm < 620) return '#ea580c'
  if (nm < 750) return '#dc2626'
  return '#991b1b'
}

function wavelengthRange(nm) {
  if (nm < 10) return 'Rayos gamma'
  if (nm < 380) return 'Ultravioleta (UV)'
  if (nm < 750) return 'Visible'
  if (nm < 1e6) return 'Infrarrojo (IR)'
  return 'Microondas/Radio'
}

function isVisible(nm) {
  return nm >= 380 && nm <= 750
}

// ═══════════════════════════════════════════════
// SECTION 1: MODELO DE BOHR
// ═══════════════════════════════════════════════
const bohr = reactive({ n1: 2, n2: 4 })

const bohrTransition = computed(() => {
  const n1 = parseInt(bohr.n1) || 1
  const n2 = parseInt(bohr.n2) || 2
  if (n1 === n2 || n1 < 1 || n2 < 1 || n1 > 10 || n2 > 10) return null

  const nLow = Math.min(n1, n2)
  const nHigh = Math.max(n1, n2)
  const isEmission = n1 > n2
  const deltaE_eV = Math.abs(energyN(nHigh) - energyN(nLow))
  const deltaE_J = deltaE_eV / eV_per_J
  const lambda = wavelengthNm(nLow, nHigh)
  const nu = frequencyHz(lambda)
  const color = wavelengthToColor(lambda)
  const range = wavelengthRange(lambda)

  let serie = ''
  if (nLow === 1) serie = 'Lyman (UV)'
  else if (nLow === 2) serie = 'Balmer (Vis/UV)'
  else if (nLow === 3) serie = 'Paschen (IR)'
  else if (nLow === 4) serie = 'Brackett (IR)'
  else if (nLow === 5) serie = 'Pfund (IR)'
  else serie = `Serie n=${nLow}`

  return {
    n1, n2, nLow, nHigh, isEmission,
    deltaE_eV, deltaE_J, lambda, nu,
    color, range, serie,
    E_initial: energyN(n1),
    E_final: energyN(n2),
  }
})

const bohrLevels = [1, 2, 3, 4, 5, 6]
function orbitRadius(n) {
  return 30 + n * 32
}

// ═══════════════════════════════════════════════
// SECTION 2: SERIES ESPECTRALES
// ═══════════════════════════════════════════════
const seriesData = [
  { name: 'Lyman', nf: 1, region: 'Ultravioleta', color: '#7c3aed', transitions: [2, 3, 4, 5, 6] },
  { name: 'Balmer', nf: 2, region: 'Visible / UV cercano', color: '#2563eb', transitions: [3, 4, 5, 6, 7] },
  { name: 'Paschen', nf: 3, region: 'Infrarrojo cercano', color: '#dc2626', transitions: [4, 5, 6, 7, 8] },
  { name: 'Brackett', nf: 4, region: 'Infrarrojo', color: '#991b1b', transitions: [5, 6, 7, 8, 9] },
  { name: 'Pfund', nf: 5, region: 'Infrarrojo lejano', color: '#7f1d1d', transitions: [6, 7, 8, 9, 10] },
]

function seriesTransitionData(nf, ni) {
  const lambda = wavelengthNm(nf, ni)
  const nu = frequencyHz(lambda)
  const deltaE = Math.abs(energyN(ni) - energyN(nf))
  return { ni, nf, lambda, nu, deltaE, visible: isVisible(lambda), color: wavelengthToColor(lambda) }
}

const selectedTransition = ref(null)

function selectTransition(nf, ni) {
  const data = seriesTransitionData(nf, ni)
  selectedTransition.value = data
}

// ═══════════════════════════════════════════════
// SECTION 3: NIVELES DE ENERGIA
// ═══════════════════════════════════════════════
const nivelesInput = ref(3)

const nivelCalc = computed(() => {
  const n = parseInt(nivelesInput.value) || 1
  if (n < 1 || n > 100) return null
  const E_eV = energyN(n)
  const E_J = E_eV / eV_per_J
  const r_A = radiusN(n)
  const r_m = radiusN_m(n)
  return { n, E_eV, E_J, r_A, r_m }
})

const ionizationEnergy_eV = 13.6
const ionizationEnergy_J = ionizationEnergy_eV / eV_per_J

const energyLevels = computed(() => {
  const levels = []
  for (let n = 1; n <= 7; n++) {
    levels.push({
      n,
      E_eV: energyN(n),
      E_J: energyN_J(n),
      r_A: radiusN(n),
    })
  }
  return levels
})

// ═══════════════════════════════════════════════
// SECTION 4: POZO DE POTENCIAL
// ═══════════════════════════════════════════════
const pozoN = ref(1)
const pozoZ = ref(1)
const pozoN0 = ref(1)
const pozoNf = ref(2)
const pozoInverseMode = ref('H')
const pozoInverseValue = ref('')

const pozoCalc = computed(() => {
  const n = parseInt(pozoN.value) || 1
  if (n < 1) return null
  const H_J = -RH_J / (n * n)
  const Ep_J = -2 * RH_J / (n * n)
  const Ek_J = RH_J / (n * n)
  const r_m = a0_m * n * n
  return {
    n,
    H_J, H_eV: H_J * eV_per_J,
    Ep_J, Ep_eV: Ep_J * eV_per_J,
    Ek_J, Ek_eV: Ek_J * eV_per_J,
    r_m, r_A: r_m * 1e10,
  }
})

const pozoTransition = computed(() => {
  const n0 = parseInt(pozoN0.value) || 1
  const nf = parseInt(pozoNf.value) || 2
  if (n0 === nf || n0 < 1 || nf < 1) return null

  const H0 = -RH_J / (n0 * n0)
  const Hf = -RH_J / (nf * nf)
  const Ep0 = -2 * RH_J / (n0 * n0)
  const Epf = -2 * RH_J / (nf * nf)
  const Ek0 = RH_J / (n0 * n0)
  const Ekf = RH_J / (nf * nf)
  const r0 = a0_m * n0 * n0
  const rf = a0_m * nf * nf

  return {
    n0, nf,
    deltaH_J: Hf - H0, deltaH_eV: (Hf - H0) * eV_per_J,
    deltaEp_J: Epf - Ep0, deltaEp_eV: (Epf - Ep0) * eV_per_J,
    deltaEk_J: Ekf - Ek0, deltaEk_eV: (Ekf - Ek0) * eV_per_J,
    deltaR_m: rf - r0, deltaR_A: (rf - r0) * 1e10,
  }
})

const pozoTable = computed(() => {
  const rows = []
  for (let n = 1; n <= 10; n++) {
    const H = -RH_J / (n * n)
    const Ep = -2 * RH_J / (n * n)
    const Ek = RH_J / (n * n)
    const r = a0_m * n * n
    rows.push({
      n, H, Ep, Ek, r,
      H_eV: H * eV_per_J,
      Ep_eV: Ep * eV_per_J,
      Ek_eV: Ek * eV_per_J,
    })
  }
  return rows
})

const pozoInverseResult = computed(() => {
  const val = parseFloat(pozoInverseValue.value)
  if (isNaN(val) || val === 0) return null
  const mode = pozoInverseMode.value
  let n2

  if (mode === 'H') {
    if (val >= 0) return { error: 'El Hamiltoniano debe ser negativo' }
    n2 = -RH_J / val
  } else if (mode === 'Ep') {
    if (val >= 0) return { error: 'La energia potencial debe ser negativa' }
    n2 = -2 * RH_J / val
  } else if (mode === 'r') {
    if (val <= 0) return { error: 'El radio debe ser positivo' }
    n2 = (val * 1e-10) / a0_m
  }

  const n = Math.sqrt(n2)
  const nRound = Math.round(n)
  const isInteger = Math.abs(n - nRound) < 0.05

  return {
    n_exact: n,
    n_round: nRound,
    isQuantized: isInteger,
  }
})

const ionizationCalc = computed(() => {
  const Z = parseInt(pozoZ.value) || 1
  if (Z < 1 || Z > 118) return null
  const E_J = RH_J * Z * Z
  const E_eV = E_J * eV_per_J
  const E_kJ_mol = E_J * 6.022e23 / 1000
  return { Z, E_J, E_eV, E_kJ_mol }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
        <Atom class="h-8 w-8 text-primary" />
        Atomo de Hidrogeno
      </h1>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Estudio completo del atomo de hidrogeno: modelo de Bohr, series espectrales,
        niveles de energia y pozo de potencial.
      </p>
    </div>

    <!-- Pill Navigation -->
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeSection === sec.id
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-muted/80'"
        @click="activeSection = sec.id"
      >
        <component :is="sec.icon" class="h-4 w-4" />
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 1: MODELO DE BOHR                  -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'bohr'" class="space-y-6">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- SVG Bohr Model -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Atom class="h-5 w-5" />
              Modelo de Bohr Interactivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <svg viewBox="0 0 440 440" class="w-full max-w-md mx-auto" style="background: radial-gradient(circle, hsl(var(--muted)) 0%, transparent 70%);">
              <!-- Energy levels (orbits) -->
              <circle
                v-for="n in bohrLevels"
                :key="'orbit-' + n"
                cx="220" cy="220"
                :r="orbitRadius(n)"
                fill="none"
                :stroke="bohrTransition && (n === bohrTransition.nLow || n === bohrTransition.nHigh) ? bohrTransition.color : 'hsl(var(--border))'"
                :stroke-width="bohrTransition && (n === bohrTransition.nLow || n === bohrTransition.nHigh) ? 2.5 : 1"
                :stroke-dasharray="bohrTransition && (n === bohrTransition.nLow || n === bohrTransition.nHigh) ? 'none' : '4 3'"
                :opacity="bohrTransition && (n === bohrTransition.nLow || n === bohrTransition.nHigh) ? 1 : 0.5"
              />

              <!-- Level labels -->
              <text
                v-for="n in bohrLevels"
                :key="'label-' + n"
                :x="220 + orbitRadius(n) - 8"
                :y="215"
                font-size="11"
                font-weight="600"
                fill="hsl(var(--muted-foreground))"
              >
                n={{ n }}
              </text>

              <!-- Energy labels -->
              <text
                v-for="n in bohrLevels"
                :key="'energy-' + n"
                :x="220"
                :y="220 - orbitRadius(n) + 14"
                font-size="9"
                fill="hsl(var(--muted-foreground))"
                text-anchor="middle"
                opacity="0.7"
              >
                {{ energyN(n).toFixed(2) }} eV
              </text>

              <!-- Nucleus -->
              <circle cx="220" cy="220" r="12" fill="hsl(var(--primary))" opacity="0.9" />
              <text x="220" y="224" font-size="9" fill="hsl(var(--primary-foreground))" text-anchor="middle" font-weight="bold">H+</text>

              <!-- Electron on initial orbit -->
              <template v-if="bohrTransition">
                <circle
                  :cx="220 + orbitRadius(bohrTransition.n1) * Math.cos(-Math.PI / 4)"
                  :cy="220 + orbitRadius(bohrTransition.n1) * Math.sin(-Math.PI / 4)"
                  r="7"
                  fill="#3b82f6"
                  stroke="white"
                  stroke-width="1.5"
                />
                <text
                  :x="220 + orbitRadius(bohrTransition.n1) * Math.cos(-Math.PI / 4)"
                  :y="220 + orbitRadius(bohrTransition.n1) * Math.sin(-Math.PI / 4) + 3.5"
                  font-size="8"
                  fill="white"
                  text-anchor="middle"
                  font-weight="bold"
                >e</text>

                <!-- Transition arrow -->
                <line
                  :x1="220 + orbitRadius(bohrTransition.n1) * Math.cos(Math.PI / 6)"
                  :y1="220 + orbitRadius(bohrTransition.n1) * Math.sin(Math.PI / 6)"
                  :x2="220 + orbitRadius(bohrTransition.n2) * Math.cos(Math.PI / 6)"
                  :y2="220 + orbitRadius(bohrTransition.n2) * Math.sin(Math.PI / 6)"
                  :stroke="bohrTransition.color"
                  stroke-width="3"
                  stroke-linecap="round"
                  :marker-end="'url(#arrowhead)'"
                />

                <!-- Photon wave indicator -->
                <g :transform="`translate(${220 + orbitRadius(bohrTransition.nHigh) + 20}, 120)`">
                  <path
                    d="M0,0 Q5,-10 10,0 Q15,10 20,0 Q25,-10 30,0 Q35,10 40,0 Q45,-10 50,0"
                    fill="none"
                    :stroke="bohrTransition.color"
                    stroke-width="2.5"
                  />
                  <text x="25" y="18" font-size="10" :fill="bohrTransition.color" text-anchor="middle" font-weight="600">
                    {{ bohrTransition.isEmission ? 'foton emitido' : 'foton absorbido' }}
                  </text>
                  <text x="25" y="30" font-size="9" :fill="bohrTransition.color" text-anchor="middle">
                    {{ bohrTransition.lambda.toFixed(1) }} nm
                  </text>
                </g>
              </template>

              <!-- Arrow marker definition -->
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    :fill="bohrTransition ? bohrTransition.color : 'hsl(var(--primary))'"
                  />
                </marker>
              </defs>
            </svg>
          </CardContent>
        </Card>

        <!-- Controls & Results -->
        <div class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Seleccionar Transicion</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label>Nivel inicial (n<sub>i</sub>)</Label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="n in 7"
                      :key="'n1-' + n"
                      class="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                      :class="bohr.n1 === n
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'"
                      @click="bohr.n1 = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>
                <div class="space-y-2">
                  <Label>Nivel final (n<sub>f</sub>)</Label>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="n in 7"
                      :key="'n2-' + n"
                      class="w-9 h-9 rounded-lg text-sm font-semibold transition-all"
                      :class="bohr.n2 === n
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground'"
                      @click="bohr.n2 = n"
                    >
                      {{ n }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Type indicator -->
              <div v-if="bohrTransition" class="flex flex-wrap items-center gap-2">
                <Badge :class="bohrTransition.isEmission ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'" variant="outline">
                  <component :is="bohrTransition.isEmission ? ArrowDown : ArrowUp" class="h-3 w-3 mr-1" />
                  {{ bohrTransition.isEmission ? 'Emision' : 'Absorcion' }}
                </Badge>
                <Badge variant="outline">{{ bohrTransition.serie }}</Badge>
                <Badge variant="outline" :style="{ borderColor: bohrTransition.color, color: bohrTransition.color }">
                  {{ bohrTransition.range }}
                </Badge>
              </div>

              <div v-if="!bohrTransition" class="text-sm text-muted-foreground italic p-4 text-center border rounded-lg border-dashed">
                Selecciona dos niveles diferentes para ver la transicion
              </div>
            </CardContent>
          </Card>

          <!-- Results -->
          <Card v-if="bohrTransition">
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Calculator class="h-5 w-5" />
                Resultados de la Transicion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 rounded-lg bg-muted/50">
                    <div class="text-xs text-muted-foreground">E<sub>inicial</sub> (n={{ bohrTransition.n1 }})</div>
                    <div class="font-semibold">{{ bohrTransition.E_initial.toFixed(4) }} eV</div>
                  </div>
                  <div class="p-3 rounded-lg bg-muted/50">
                    <div class="text-xs text-muted-foreground">E<sub>final</sub> (n={{ bohrTransition.n2 }})</div>
                    <div class="font-semibold">{{ bohrTransition.E_final.toFixed(4) }} eV</div>
                  </div>
                </div>

                <div class="p-3 rounded-lg border-2" :style="{ borderColor: bohrTransition.color + '40' }">
                  <div class="text-xs text-muted-foreground mb-1">Energia del foton |ΔE|</div>
                  <div class="font-bold text-lg">{{ bohrTransition.deltaE_eV.toFixed(4) }} eV</div>
                  <div class="text-sm text-muted-foreground">= {{ sci(bohrTransition.deltaE_J) }} J</div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div class="p-3 rounded-lg bg-muted/50">
                    <div class="text-xs text-muted-foreground">Longitud de onda (λ)</div>
                    <div class="font-semibold" :style="{ color: bohrTransition.color }">{{ bohrTransition.lambda.toFixed(2) }} nm</div>
                  </div>
                  <div class="p-3 rounded-lg bg-muted/50">
                    <div class="text-xs text-muted-foreground">Frecuencia (ν)</div>
                    <div class="font-semibold">{{ sci(bohrTransition.nu) }} Hz</div>
                  </div>
                </div>

                <!-- Formulas used -->
                <div class="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground space-y-1">
                  <div class="font-semibold text-foreground mb-1">Formulas utilizadas:</div>
                  <div>E<sub>n</sub> = -13.6 / n<sup>2</sup> eV</div>
                  <div>1/λ = R<sub>∞</sub>(1/n<sub>f</sub><sup>2</sup> - 1/n<sub>i</sub><sup>2</sup>), R<sub>∞</sub> = 1.097 x 10<sup>7</sup> m<sup>-1</sup></div>
                  <div>ν = c / λ, E = hν</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: SERIES ESPECTRALES              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'series'" class="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Waves class="h-5 w-5" />
            Series Espectrales del Hidrogeno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">
            Las series espectrales del hidrogeno corresponden a transiciones electronicas hacia un nivel final comun.
            Haz clic en cualquier transicion para ver el calculo completo.
          </p>

          <div class="space-y-6">
            <div v-for="serie in seriesData" :key="serie.name">
              <div class="flex flex-wrap items-center gap-3 mb-3">
                <h3 class="font-bold text-lg">Serie de {{ serie.name }}</h3>
                <Badge variant="outline">n<sub>f</sub> = {{ serie.nf }}</Badge>
                <Badge :style="{ backgroundColor: serie.color + '20', color: serie.color, borderColor: serie.color + '40' }" variant="outline">
                  {{ serie.region }}
                </Badge>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="text-left py-2 px-3 font-medium text-muted-foreground">Transicion</th>
                      <th class="text-right py-2 px-3 font-medium text-muted-foreground">λ (nm)</th>
                      <th class="text-right py-2 px-3 font-medium text-muted-foreground">ν (Hz)</th>
                      <th class="text-right py-2 px-3 font-medium text-muted-foreground">ΔE (eV)</th>
                      <th class="text-center py-2 px-3 font-medium text-muted-foreground">Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="ni in serie.transitions"
                      :key="ni"
                      class="border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors"
                      :class="selectedTransition && selectedTransition.ni === ni && selectedTransition.nf === serie.nf ? 'bg-muted' : ''"
                      @click="selectTransition(serie.nf, ni)"
                    >
                      <td class="py-2 px-3 font-mono">
                        {{ ni }} → {{ serie.nf }}
                      </td>
                      <td class="py-2 px-3 text-right font-mono">
                        <span
                          :style="{ color: seriesTransitionData(serie.nf, ni).visible ? seriesTransitionData(serie.nf, ni).color : 'inherit', fontWeight: seriesTransitionData(serie.nf, ni).visible ? '700' : '400' }"
                        >
                          {{ seriesTransitionData(serie.nf, ni).lambda.toFixed(1) }}
                        </span>
                      </td>
                      <td class="py-2 px-3 text-right font-mono text-xs">{{ sci(seriesTransitionData(serie.nf, ni).nu) }}</td>
                      <td class="py-2 px-3 text-right font-mono">{{ seriesTransitionData(serie.nf, ni).deltaE.toFixed(3) }}</td>
                      <td class="py-2 px-3 text-center">
                        <div
                          v-if="seriesTransitionData(serie.nf, ni).visible"
                          class="inline-block w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          :style="{ backgroundColor: seriesTransitionData(serie.nf, ni).color }"
                          :title="'Color visible: ' + seriesTransitionData(serie.nf, ni).lambda.toFixed(1) + ' nm'"
                        />
                        <span v-else class="text-xs text-muted-foreground">
                          {{ wavelengthRange(seriesTransitionData(serie.nf, ni).lambda) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Selected transition detail -->
      <Card v-if="selectedTransition">
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Info class="h-5 w-5" />
            Calculo Detallado: {{ selectedTransition.ni }} → {{ selectedTransition.nf }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">E<sub>{{ selectedTransition.ni }}</sub> = -13.6 / {{ selectedTransition.ni }}<sup>2</sup></div>
                <div class="font-semibold">{{ energyN(selectedTransition.ni).toFixed(4) }} eV</div>
              </div>
              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">E<sub>{{ selectedTransition.nf }}</sub> = -13.6 / {{ selectedTransition.nf }}<sup>2</sup></div>
                <div class="font-semibold">{{ energyN(selectedTransition.nf).toFixed(4) }} eV</div>
              </div>
              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">|ΔE| = |E<sub>{{ selectedTransition.nf }}</sub> - E<sub>{{ selectedTransition.ni }}</sub>|</div>
                <div class="font-bold text-lg">{{ selectedTransition.deltaE.toFixed(4) }} eV</div>
                <div class="text-xs text-muted-foreground">= {{ sci(selectedTransition.deltaE / eV_per_J) }} J</div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="p-3 rounded-lg border-2" :style="{ borderColor: selectedTransition.color + '40' }">
                <div class="text-xs text-muted-foreground">Longitud de onda (λ)</div>
                <div class="font-bold text-lg" :style="{ color: selectedTransition.visible ? selectedTransition.color : 'inherit' }">
                  {{ selectedTransition.lambda.toFixed(2) }} nm
                </div>
              </div>
              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">Frecuencia (ν = c / λ)</div>
                <div class="font-semibold">{{ sci(selectedTransition.nu) }} Hz</div>
              </div>
              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">Region del espectro</div>
                <div class="font-semibold flex items-center gap-2">
                  {{ wavelengthRange(selectedTransition.lambda) }}
                  <div
                    v-if="selectedTransition.visible"
                    class="w-5 h-5 rounded-full"
                    :style="{ backgroundColor: selectedTransition.color }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Step-by-step -->
          <div class="mt-4 p-4 rounded-lg bg-muted/30 text-sm space-y-1">
            <div class="font-semibold mb-2">Procedimiento paso a paso:</div>
            <div>1. 1/λ = R<sub>∞</sub> (1/{{ selectedTransition.nf }}<sup>2</sup> - 1/{{ selectedTransition.ni }}<sup>2</sup>)</div>
            <div>2. 1/λ = 1.097 x 10<sup>7</sup> ({{ (1/(selectedTransition.nf * selectedTransition.nf)).toFixed(4) }} - {{ (1/(selectedTransition.ni * selectedTransition.ni)).toFixed(4) }})</div>
            <div>3. 1/λ = {{ sci(R_inf * (1/(selectedTransition.nf * selectedTransition.nf) - 1/(selectedTransition.ni * selectedTransition.ni))) }} m<sup>-1</sup></div>
            <div>4. λ = {{ selectedTransition.lambda.toFixed(2) }} nm</div>
            <div>5. ν = c / λ = {{ sci(selectedTransition.nu) }} Hz</div>
            <div>6. E = hν = {{ sci(selectedTransition.deltaE / eV_per_J) }} J = {{ selectedTransition.deltaE.toFixed(4) }} eV</div>
          </div>
        </CardContent>
      </Card>

      <!-- Balmer visible spectrum visualization -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Espectro Visible - Serie de Balmer</CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">
            La serie de Balmer es la unica que produce lineas en la region visible del espectro electromagnetico.
          </p>
          <div class="relative h-16 rounded-lg overflow-hidden" style="background: linear-gradient(to right, #6d28d9, #4338ca, #2563eb, #0891b2, #16a34a, #65a30d, #ca8a04, #ea580c, #dc2626);">
            <!-- Spectral lines -->
            <div
              v-for="ni in [3, 4, 5, 6, 7]"
              :key="'balmer-' + ni"
              class="absolute top-0 bottom-0 w-1"
              :style="{
                left: ((wavelengthNm(2, ni) - 380) / (750 - 380) * 100) + '%',
                backgroundColor: wavelengthToColor(wavelengthNm(2, ni)),
                boxShadow: '0 0 6px 2px ' + wavelengthToColor(wavelengthNm(2, ni)),
              }"
            >
              <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap text-muted-foreground">
                {{ wavelengthNm(2, ni).toFixed(0) }}
              </div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-muted-foreground mt-8">
            <span>380 nm (Violeta)</span>
            <span>550 nm (Verde)</span>
            <span>750 nm (Rojo)</span>
          </div>

          <!-- Named Balmer lines -->
          <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="(line, idx) in [
              { ni: 3, name: 'H-alpha (roja)' },
              { ni: 4, name: 'H-beta (azul-verde)' },
              { ni: 5, name: 'H-gamma (azul)' },
              { ni: 6, name: 'H-delta (violeta)' },
            ]" :key="idx" class="p-3 rounded-lg border text-center">
              <div
                class="w-8 h-8 rounded-full mx-auto mb-2"
                :style="{ backgroundColor: wavelengthToColor(wavelengthNm(2, line.ni)) }"
              />
              <div class="font-semibold text-sm">{{ line.name }}</div>
              <div class="text-xs text-muted-foreground">{{ line.ni }} → 2</div>
              <div class="text-xs font-mono">{{ wavelengthNm(2, line.ni).toFixed(1) }} nm</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 3: NIVELES DE ENERGIA              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'niveles'" class="space-y-6">

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Energy Level Diagram -->
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <BarChart3 class="h-5 w-5" />
              Diagrama de Niveles de Energia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <svg viewBox="0 0 350 500" class="w-full max-w-sm mx-auto">
              <!-- Y axis -->
              <line x1="60" y1="30" x2="60" y2="460" stroke="hsl(var(--border))" stroke-width="1" />
              <text x="30" y="250" font-size="11" fill="hsl(var(--muted-foreground))" text-anchor="middle" transform="rotate(-90, 30, 250)">Energia (eV)</text>

              <!-- Ionization level (E=0) -->
              <line x1="55" y1="40" x2="300" y2="40" stroke="hsl(var(--muted-foreground))" stroke-width="1" stroke-dasharray="6 3" />
              <text x="310" y="44" font-size="10" fill="hsl(var(--muted-foreground))">n = inf</text>
              <text x="55" y="32" font-size="10" fill="hsl(var(--muted-foreground))" text-anchor="end">0.00 eV</text>

              <!-- Energy levels -->
              <template v-for="level in energyLevels" :key="'level-' + level.n">
                <line
                  :x1="70"
                  :y1="40 + (-level.E_eV / 13.6) * 400"
                  :x2="280"
                  :y2="40 + (-level.E_eV / 13.6) * 400"
                  stroke="hsl(var(--primary))"
                  stroke-width="2.5"
                />
                <!-- n label (right) -->
                <text
                  :x="290"
                  :y="40 + (-level.E_eV / 13.6) * 400 + 4"
                  font-size="11"
                  font-weight="600"
                  fill="hsl(var(--foreground))"
                >
                  n = {{ level.n }}
                </text>
                <!-- Energy label (left) -->
                <text
                  :x="55"
                  :y="40 + (-level.E_eV / 13.6) * 400 + 4"
                  font-size="9"
                  fill="hsl(var(--muted-foreground))"
                  text-anchor="end"
                >
                  {{ level.E_eV.toFixed(2) }}
                </text>
              </template>

              <!-- Ionization energy arrow -->
              <line x1="175" y1="42" x2="175" y2="438" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2" />
              <polygon points="175,42 171,52 179,52" fill="#ef4444" />
              <text x="185" y="240" font-size="10" fill="#ef4444" font-weight="600">
                E_ion = 13.6 eV
              </text>
            </svg>
          </CardContent>
        </Card>

        <!-- Calculator -->
        <div class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <Calculator class="h-5 w-5" />
                Calculadora de Nivel n
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label>Numero cuantico principal (n)</Label>
                <Input v-model="nivelesInput" type="number" min="1" max="100" />
              </div>

              <div v-if="nivelCalc" class="space-y-3">
                <div class="p-3 rounded-lg bg-muted/50">
                  <div class="text-xs text-muted-foreground">Energia E<sub>{{ nivelCalc.n }}</sub> = -13.6 / {{ nivelCalc.n }}<sup>2</sup></div>
                  <div class="font-bold text-lg">{{ nivelCalc.E_eV.toFixed(6) }} eV</div>
                  <div class="text-sm text-muted-foreground">= {{ sci(nivelCalc.E_J) }} J</div>
                </div>

                <div class="p-3 rounded-lg bg-muted/50">
                  <div class="text-xs text-muted-foreground">Radio r<sub>{{ nivelCalc.n }}</sub> = a<sub>0</sub> x {{ nivelCalc.n }}<sup>2</sup> = 0.529 x {{ nivelCalc.n * nivelCalc.n }}</div>
                  <div class="font-bold text-lg">{{ nivelCalc.r_A.toFixed(3) }} A</div>
                  <div class="text-sm text-muted-foreground">= {{ sci(nivelCalc.r_m) }} m</div>
                </div>

                <div class="p-3 rounded-lg bg-muted/50">
                  <div class="text-xs text-muted-foreground">Velocidad orbital v<sub>{{ nivelCalc.n }}</sub></div>
                  <div class="font-semibold">v<sub>n</sub> = v<sub>1</sub> / n = 2.188 x 10<sup>6</sup> / {{ nivelCalc.n }}</div>
                  <div class="font-bold">= {{ sci(2.188e6 / nivelCalc.n) }} m/s</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Energy table -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg">Tabla de Niveles</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="text-center py-2 px-2 font-medium text-muted-foreground">n</th>
                      <th class="text-right py-2 px-2 font-medium text-muted-foreground">E (eV)</th>
                      <th class="text-right py-2 px-2 font-medium text-muted-foreground">r (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="level in energyLevels" :key="level.n" class="border-b border-border/50">
                      <td class="py-1.5 px-2 text-center font-semibold">{{ level.n }}</td>
                      <td class="py-1.5 px-2 text-right font-mono">{{ level.E_eV.toFixed(4) }}</td>
                      <td class="py-1.5 px-2 text-right font-mono">{{ level.r_A.toFixed(3) }}</td>
                    </tr>
                    <tr class="border-t-2">
                      <td class="py-1.5 px-2 text-center font-semibold">inf</td>
                      <td class="py-1.5 px-2 text-right font-mono">0.0000</td>
                      <td class="py-1.5 px-2 text-right font-mono">inf</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div class="text-sm font-semibold text-red-500">Energia de Ionizacion</div>
                <div class="text-xs text-muted-foreground mt-1">
                  Energia para remover el electron desde n=1 a n=inf
                </div>
                <div class="font-bold mt-1">{{ ionizationEnergy_eV }} eV = {{ sci(ionizationEnergy_J) }} J</div>
                <div class="text-sm text-muted-foreground">= {{ (ionizationEnergy_J * 6.022e23 / 1000).toFixed(1) }} kJ/mol</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 4: POZO DE POTENCIAL               -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'pozo'" class="space-y-6">

      <!-- Constants reference -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Info class="h-5 w-5" />
            Constantes Fundamentales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div class="p-2 rounded bg-muted/50">
              <div class="text-xs text-muted-foreground">R<sub>H</sub> (Energia de Rydberg)</div>
              <div class="font-mono font-semibold">2.1799 x 10<sup>-18</sup> J</div>
              <div class="font-mono text-xs text-muted-foreground">= 13.6 eV</div>
            </div>
            <div class="p-2 rounded bg-muted/50">
              <div class="text-xs text-muted-foreground">a<sub>0</sub> (Radio de Bohr)</div>
              <div class="font-mono font-semibold">5.2918 x 10<sup>-11</sup> m</div>
              <div class="font-mono text-xs text-muted-foreground">= 0.529 A</div>
            </div>
            <div class="p-2 rounded bg-muted/50">
              <div class="text-xs text-muted-foreground">h (Planck)</div>
              <div class="font-mono font-semibold">6.626 x 10<sup>-34</sup> J s</div>
            </div>
            <div class="p-2 rounded bg-muted/50">
              <div class="text-xs text-muted-foreground">c (Velocidad de la luz)</div>
              <div class="font-mono font-semibold">2.998 x 10<sup>8</sup> m/s</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Calculator by level -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Calculator class="h-5 w-5" />
              Energias por Nivel n
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label>Nivel cuantico n</Label>
              <Input v-model="pozoN" type="number" min="1" max="100" />
            </div>

            <div v-if="pozoCalc" class="space-y-3">
              <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div class="text-xs text-muted-foreground">Hamiltoniano H = -R<sub>H</sub> / n<sup>2</sup></div>
                <div class="font-bold text-lg">{{ sci(pozoCalc.H_J) }} J</div>
                <div class="text-sm text-muted-foreground">= {{ pozoCalc.H_eV.toFixed(4) }} eV</div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div class="text-xs text-muted-foreground">E<sub>p</sub> = -2R<sub>H</sub> / n<sup>2</sup></div>
                  <div class="font-bold">{{ sci(pozoCalc.Ep_J) }} J</div>
                  <div class="text-xs text-muted-foreground">= {{ pozoCalc.Ep_eV.toFixed(4) }} eV</div>
                </div>
                <div class="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div class="text-xs text-muted-foreground">E<sub>k</sub> = R<sub>H</sub> / n<sup>2</sup></div>
                  <div class="font-bold">{{ sci(pozoCalc.Ek_J) }} J</div>
                  <div class="text-xs text-muted-foreground">= {{ pozoCalc.Ek_eV.toFixed(4) }} eV</div>
                </div>
              </div>

              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">Radio r<sub>{{ pozoCalc.n }}</sub> = a<sub>0</sub> x n<sup>2</sup></div>
                <div class="font-semibold">{{ sci(pozoCalc.r_m) }} m = {{ pozoCalc.r_A.toFixed(3) }} A</div>
              </div>

              <div class="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                <div class="font-semibold text-foreground mb-1">Relaciones importantes:</div>
                <div>H = E<sub>p</sub> + E<sub>k</sub> (Energia total)</div>
                <div>E<sub>p</sub> = 2H (Teorema del virial)</div>
                <div>E<sub>k</sub> = -H</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Transition calculator -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg flex items-center gap-2">
              <Zap class="h-5 w-5" />
              Calculadora de Transiciones
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nivel inicial (n<sub>0</sub>)</Label>
                <Input v-model="pozoN0" type="number" min="1" max="100" />
              </div>
              <div class="space-y-2">
                <Label>Nivel final (n<sub>f</sub>)</Label>
                <Input v-model="pozoNf" type="number" min="1" max="100" />
              </div>
            </div>

            <div v-if="pozoTransition" class="space-y-3">
              <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div class="text-xs text-muted-foreground">DeltaH = H<sub>f</sub> - H<sub>0</sub></div>
                <div class="font-bold">{{ sci(pozoTransition.deltaH_J) }} J</div>
                <div class="text-xs text-muted-foreground">= {{ pozoTransition.deltaH_eV.toFixed(4) }} eV</div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div class="text-xs text-muted-foreground">DeltaE<sub>p</sub></div>
                  <div class="font-bold text-sm">{{ sci(pozoTransition.deltaEp_J) }} J</div>
                  <div class="text-xs text-muted-foreground">= {{ pozoTransition.deltaEp_eV.toFixed(4) }} eV</div>
                </div>
                <div class="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div class="text-xs text-muted-foreground">DeltaE<sub>k</sub></div>
                  <div class="font-bold text-sm">{{ sci(pozoTransition.deltaEk_J) }} J</div>
                  <div class="text-xs text-muted-foreground">= {{ pozoTransition.deltaEk_eV.toFixed(4) }} eV</div>
                </div>
              </div>

              <div class="p-3 rounded-lg bg-muted/50">
                <div class="text-xs text-muted-foreground">Delta-r = r<sub>f</sub> - r<sub>0</sub></div>
                <div class="font-semibold">{{ sci(pozoTransition.deltaR_m) }} m = {{ pozoTransition.deltaR_A.toFixed(3) }} A</div>
              </div>
            </div>

            <div v-else class="text-sm text-muted-foreground italic text-center p-4 border rounded-lg border-dashed">
              Ingresa dos niveles diferentes para calcular la transicion
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Inverse calculator & Ionization -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Calculadora Inversa: Encontrar n</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label>Tipo de dato</Label>
              <div class="flex gap-2">
                <button
                  v-for="mode in [
                    { id: 'H', label: 'Hamiltoniano (J)' },
                    { id: 'Ep', label: 'Ep (J)' },
                    { id: 'r', label: 'Radio (A)' },
                  ]"
                  :key="mode.id"
                  class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  :class="pozoInverseMode === mode.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'"
                  @click="pozoInverseMode = mode.id"
                >
                  {{ mode.label }}
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <Label>
                Valor
                <span class="text-muted-foreground text-xs ml-1">
                  ({{ pozoInverseMode === 'H' ? 'en Joules, ej: -2.18e-18' : pozoInverseMode === 'Ep' ? 'en Joules, ej: -4.36e-18' : 'en Angstroms, ej: 0.529' }})
                </span>
              </Label>
              <Input v-model="pozoInverseValue" type="text" placeholder="Ingresa el valor..." />
            </div>

            <div v-if="pozoInverseResult">
              <div v-if="pozoInverseResult.error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-500">
                {{ pozoInverseResult.error }}
              </div>
              <div v-else class="p-3 rounded-lg bg-muted/50 space-y-1">
                <div class="text-xs text-muted-foreground">Resultado:</div>
                <div class="font-bold text-lg">n = {{ pozoInverseResult.n_exact.toFixed(4) }}</div>
                <div v-if="pozoInverseResult.isQuantized" class="flex items-center gap-2">
                  <Badge class="bg-green-500/10 text-green-500 border-green-500/30" variant="outline">
                    Nivel cuantizado: n = {{ pozoInverseResult.n_round }}
                  </Badge>
                </div>
                <div v-else class="text-xs text-amber-500">
                  El valor no corresponde exactamente a un nivel cuantizado (n debe ser entero)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Ionization for hydrogen-like atoms -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Energia de Ionizacion (Atomos Hidrogenoides)</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <p class="text-sm text-muted-foreground">
              Para atomos con un solo electron y numero atomico Z:
              E<sub>ion</sub> = R<sub>H</sub> x Z<sup>2</sup>
            </p>

            <div class="space-y-2">
              <Label>Numero atomico Z</Label>
              <Input v-model="pozoZ" type="number" min="1" max="118" />
            </div>

            <div v-if="ionizationCalc" class="space-y-3">
              <div class="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <div class="text-xs text-muted-foreground">E<sub>ion</sub> = R<sub>H</sub> x {{ ionizationCalc.Z }}<sup>2</sup> = {{ sci(RH_J) }} x {{ ionizationCalc.Z * ionizationCalc.Z }}</div>
                <div class="font-bold text-lg">{{ sci(ionizationCalc.E_J) }} J</div>
                <div class="text-sm text-muted-foreground">= {{ ionizationCalc.E_eV.toFixed(2) }} eV</div>
                <div class="text-sm text-muted-foreground">= {{ ionizationCalc.E_kJ_mol.toFixed(1) }} kJ/mol</div>
              </div>

              <div class="text-xs text-muted-foreground">
                Ejemplos de atomos hidrogenoides: H (Z=1), He<sup>+</sup> (Z=2), Li<sup>2+</sup> (Z=3), Be<sup>3+</sup> (Z=4)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Full table n=1..10 -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Tabla Completa de Energias (n = 1 a 10)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-center py-2 px-2 font-medium text-muted-foreground">n</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">H (J)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">H (eV)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">E<sub>p</sub> (J)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">E<sub>p</sub> (eV)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">E<sub>k</sub> (J)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">E<sub>k</sub> (eV)</th>
                  <th class="text-right py-2 px-2 font-medium text-muted-foreground">r (m)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in pozoTable" :key="row.n" class="border-b border-border/50 hover:bg-muted/30">
                  <td class="py-1.5 px-2 text-center font-semibold">{{ row.n }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ sci(row.H, 4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ row.H_eV.toFixed(4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ sci(row.Ep, 4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ row.Ep_eV.toFixed(4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ sci(row.Ek, 4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ row.Ek_eV.toFixed(4) }}</td>
                  <td class="py-1.5 px-2 text-right font-mono text-xs">{{ sci(row.r, 4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

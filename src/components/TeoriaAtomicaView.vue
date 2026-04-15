<script setup>
import { ref, computed, reactive } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Atom, Waves, Zap, FlaskConical, Orbit, Flame } from 'lucide-vue-next'

const activeSection = ref('modelos')
const sections = [
  { id: 'modelos', label: 'Modelos Atomicos', icon: Atom },
  { id: 'cuanticos', label: 'Numeros Cuanticos', icon: FlaskConical },
  { id: 'configuracion', label: 'Config. Electronica', icon: Orbit },
  { id: 'espectro', label: 'Espectro y Fotoelectrico', icon: Waves },
  { id: 'bohr', label: 'Bohr y Espectros', icon: Zap },
  { id: 'pozo', label: 'Pozo de Potencial', icon: Flame },
]

// ═══════════════════════════════════════════════
// SECTION 1: Modelos Atomicos
// ═══════════════════════════════════════════════
const expandedModel = ref(null)
const modelos = [
  {
    id: 'dalton', nombre: 'Dalton', anio: 1808, color: '#8B7355',
    descCorta: 'Esfera solida e indivisible',
    descLarga: 'Los atomos son esferas solidas, indivisibles e indestructibles. Cada elemento tiene atomos identicos en masa y propiedades. Los compuestos se forman por combinacion de atomos en proporciones fijas.',
    descubrimiento: 'Ley de proporciones definidas y multiples',
    limitacion: 'No explica la existencia de particulas subatomicas ni los fenomenos electricos',
  },
  {
    id: 'thomson', nombre: 'Thomson', anio: 1897, color: '#4A90D9',
    descCorta: 'Modelo del budin de pasas',
    descLarga: 'El atomo es una esfera de carga positiva con electrones (negativos) incrustados, como pasas en un budin. Demostro la existencia del electron con tubos de rayos catodicos.',
    descubrimiento: 'Descubrimiento del electron (relacion carga/masa)',
    limitacion: 'No explica el nucleo ni la distribucion real de la carga positiva',
  },
  {
    id: 'rutherford', nombre: 'Rutherford', anio: 1911, color: '#E8A838',
    descCorta: 'Modelo nuclear',
    descLarga: 'El atomo tiene un nucleo pequeno y denso con carga positiva, y los electrones giran alrededor en un espacio mayormente vacio. Descubierto con el experimento de la lamina de oro.',
    descubrimiento: 'Nucleo atomico (experimento de lamina de oro)',
    limitacion: 'Segun la fisica clasica, electrones orbitando deberian emitir radiacion y colapsar',
  },
  {
    id: 'bohr', nombre: 'Bohr', anio: 1913, color: '#50C878',
    descCorta: 'Orbitas planetarias cuantizadas',
    descLarga: 'Los electrones giran en orbitas circulares fijas (niveles de energia). Solo absorben o emiten energia al saltar entre niveles. Explica el espectro del hidrogeno.',
    descubrimiento: 'Niveles de energia cuantizados, explica espectro de H',
    limitacion: 'Solo funciona bien para hidrogeno. No explica atomos multielectronicos',
  },
  {
    id: 'cuantica', nombre: 'Mecanica Cuantica', anio: 1926, color: '#9B59B6',
    descCorta: 'Nube electronica y orbitales',
    descLarga: 'Los electrones no tienen trayectorias definidas. Se describen con funciones de onda (Schrodinger) que dan probabilidades de encontrar al electron. Los orbitales son regiones de probabilidad (s, p, d, f).',
    descubrimiento: 'Ecuacion de Schrodinger, principio de incertidumbre de Heisenberg',
    limitacion: 'Modelo actual aceptado, en constante refinamiento',
  },
]

// ═══════════════════════════════════════════════
// SECTION 2: Numeros Cuanticos
// ═══════════════════════════════════════════════
const qn = reactive({ n: 1, l: 0, ml: 0, ms: 0.5 })
const orbitalLetters = { 0: 's', 1: 'p', 2: 'd', 3: 'f' }

const validLValues = computed(() => {
  const vals = []
  for (let i = 0; i < qn.n; i++) vals.push(i)
  return vals
})
const validMlValues = computed(() => {
  const vals = []
  for (let i = -qn.l; i <= qn.l; i++) vals.push(i)
  return vals
})
const orbitalName = computed(() => `${qn.n}${orbitalLetters[qn.l] || '?'}`)
const maxElectronsSubnivel = computed(() => 2 * (2 * qn.l + 1))

// Validador de numeros cuanticos
const qnValidator = reactive({ n: '', l: '', ml: '', ms: '' })
const qnValidation = computed(() => {
  const n = parseInt(qnValidator.n)
  const l = parseInt(qnValidator.l)
  const ml = parseInt(qnValidator.ml)
  const ms = parseFloat(qnValidator.ms)
  if ([n, l, ml].some(v => isNaN(v)) || isNaN(ms)) return { valid: null, msg: 'Ingresa los 4 numeros cuanticos' }
  if (n < 1 || n > 7) return { valid: false, msg: 'n debe estar entre 1 y 7' }
  if (l < 0 || l >= n) return { valid: false, msg: `l debe estar entre 0 y ${n - 1} (n-1)` }
  if (ml < -l || ml > l) return { valid: false, msg: `ml debe estar entre ${-l} y ${l}` }
  if (ms !== 0.5 && ms !== -0.5) return { valid: false, msg: 'ms debe ser +1/2 o -1/2' }
  return { valid: true, msg: `Valido: electron en orbital ${n}${orbitalLetters[l] || '?'}, ml=${ml}, spin ${ms > 0 ? 'arriba' : 'abajo'}` }
})

const subnivelTable = [
  { n: 1, l: 0, nombre: '1s', orbitales: 1, maxE: 2 },
  { n: 2, l: 0, nombre: '2s', orbitales: 1, maxE: 2 },
  { n: 2, l: 1, nombre: '2p', orbitales: 3, maxE: 6 },
  { n: 3, l: 0, nombre: '3s', orbitales: 1, maxE: 2 },
  { n: 3, l: 1, nombre: '3p', orbitales: 3, maxE: 6 },
  { n: 3, l: 2, nombre: '3d', orbitales: 5, maxE: 10 },
  { n: 4, l: 0, nombre: '4s', orbitales: 1, maxE: 2 },
  { n: 4, l: 1, nombre: '4p', orbitales: 3, maxE: 6 },
  { n: 4, l: 2, nombre: '4d', orbitales: 5, maxE: 10 },
  { n: 4, l: 3, nombre: '4f', orbitales: 7, maxE: 14 },
]

// ═══════════════════════════════════════════════
// SECTION 3: Configuracion Electronica
// ═══════════════════════════════════════════════
const aufbauOrder = ['1s','2s','2p','3s','3p','4s','3d','4p','5s','4d','5p','6s','4f','5d','6p','7s','5f','6d','7p']
const maxElectrons = { s: 2, p: 6, d: 10, f: 14 }
const exceptions = {
  24: { config: [['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['3d',5],['4s',1]], nota: 'Cr: 3d\u2075 4s\u00B9 (medio lleno mas estable)' },
  29: { config: [['1s',2],['2s',2],['2p',6],['3s',2],['3p',6],['3d',10],['4s',1]], nota: 'Cu: 3d\u00B9\u2070 4s\u00B9 (lleno mas estable)' },
}

const elementSymbols = {
  1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',
  11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',
  19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',
  27:'Co',28:'Ni',29:'Cu',30:'Zn',31:'Ga',32:'Ge',33:'As',34:'Se',
  35:'Br',36:'Kr'
}
const elementNames = {
  1:'Hidrogeno',2:'Helio',3:'Litio',4:'Berilio',5:'Boro',6:'Carbono',7:'Nitrogeno',8:'Oxigeno',9:'Fluor',10:'Neon',
  11:'Sodio',12:'Magnesio',13:'Aluminio',14:'Silicio',15:'Fosforo',16:'Azufre',17:'Cloro',18:'Argon',
  19:'Potasio',20:'Calcio',21:'Escandio',22:'Titanio',23:'Vanadio',24:'Cromo',25:'Manganeso',26:'Hierro',
  27:'Cobalto',28:'Niquel',29:'Cobre',30:'Zinc',31:'Galio',32:'Germanio',33:'Arsenico',34:'Selenio',
  35:'Bromo',36:'Kripton'
}
const symbolToZ = computed(() => {
  const map = {}
  for (const [z, sym] of Object.entries(elementSymbols)) map[sym.toLowerCase()] = parseInt(z)
  return map
})

const configInput = ref('6')
const configZ = computed(() => {
  const raw = configInput.value.trim()
  const num = parseInt(raw)
  if (!isNaN(num) && num >= 1 && num <= 36) return num
  const z = symbolToZ.value[raw.toLowerCase()]
  return z && z >= 1 && z <= 36 ? z : null
})

function buildConfig(z) {
  if (exceptions[z]) return exceptions[z].config
  let remaining = z
  const result = []
  for (const orb of aufbauOrder) {
    if (remaining <= 0) break
    const type = orb.slice(-1)
    const max = maxElectrons[type]
    const fill = Math.min(remaining, max)
    result.push([orb, fill])
    remaining -= fill
  }
  return result
}

const electronConfig = computed(() => {
  if (!configZ.value) return null
  return buildConfig(configZ.value)
})

const superscripts = { 0:'\u2070',1:'\u00B9',2:'\u00B2',3:'\u00B3',4:'\u2074',5:'\u2075',6:'\u2076',7:'\u2077',8:'\u2078',9:'\u2079',10:'\u00B9\u2070',11:'\u00B9\u00B9',12:'\u00B9\u00B2',13:'\u00B9\u00B3',14:'\u00B9\u2074' }

const configString = computed(() => {
  if (!electronConfig.value) return ''
  return electronConfig.value.map(([orb, count]) => `${orb}${superscripts[count] || count}`).join(' ')
})

const nobleGases = { 2:'He', 10:'Ne', 18:'Ar', 36:'Kr' }
const nobleGasConfig = computed(() => {
  if (!electronConfig.value || !configZ.value) return ''
  const z = configZ.value
  let coreZ = 0
  let coreSym = ''
  for (const [gz, sym] of Object.entries(nobleGases)) {
    const gzn = parseInt(gz)
    if (gzn < z && gzn > coreZ) { coreZ = gzn; coreSym = sym }
  }
  if (!coreZ) return configString.value
  const coreConfig = buildConfig(coreZ)
  const full = electronConfig.value
  const valence = full.slice(coreConfig.length)
  if (valence.length === 0) return `[${coreSym}]`
  return `[${coreSym}] ` + valence.map(([orb, count]) => `${orb}${superscripts[count] || count}`).join(' ')
})

const isException = computed(() => configZ.value && exceptions[configZ.value])

function getOrbitalBoxes(orbName, electronCount) {
  const type = orbName.slice(-1)
  const numOrbitals = type === 's' ? 1 : type === 'p' ? 3 : type === 'd' ? 5 : 7
  const boxes = Array.from({ length: numOrbitals }, () => ({ up: false, down: false }))
  let remaining = electronCount
  // Hund: fill up first
  for (let i = 0; i < numOrbitals && remaining > 0; i++) {
    boxes[i].up = true; remaining--
  }
  for (let i = 0; i < numOrbitals && remaining > 0; i++) {
    boxes[i].down = true; remaining--
  }
  return boxes
}

// ═══════════════════════════════════════════════
// SECTION 4: Espectro y Efecto Fotoelectrico
// ═══════════════════════════════════════════════
const h = 6.626e-34
const c = 3e8
const specCalc = reactive({ freq: '5e14', wavelength: '', energy: '' })
const specFromFreq = computed(() => {
  const nu = parseFloat(specCalc.freq)
  if (!isFinite(nu) || nu <= 0) return null
  return { E: h * nu, lambda: c / nu, nu }
})
const specFromLambda = computed(() => {
  const lam = parseFloat(specCalc.wavelength)
  if (!isFinite(lam) || lam <= 0) return null
  const lamM = lam * 1e-9
  return { E: h * c / lamM, nu: c / lamM, lambda: lam }
})

const Rydberg = 1.097e7
const rydCalc = reactive({ n1: '1', n2: '2' })
const rydResult = computed(() => {
  const n1 = parseInt(rydCalc.n1), n2 = parseInt(rydCalc.n2)
  if (!n1 || !n2 || n1 >= n2 || n1 < 1) return null
  const invLambda = Rydberg * (1 / (n1 * n1) - 1 / (n2 * n2))
  const lam = 1 / invLambda
  const nu = c / lam
  const E = h * nu
  return { lambda: lam, nu, E, invLambda }
})

// Efecto fotoelectrico
const photoelectric = reactive({ freq: '8e14', workFunction: '3.5' })
const photoResult = computed(() => {
  const nu = parseFloat(photoelectric.freq)
  const phi_eV = parseFloat(photoelectric.workFunction)
  if (!isFinite(nu) || !isFinite(phi_eV) || nu <= 0 || phi_eV <= 0) return null
  const phi_J = phi_eV * 1.602e-19
  const E_photon = h * nu
  const threshold = phi_J / h
  const ejected = nu > threshold
  const KE = ejected ? E_photon - phi_J : 0
  return { E_photon, phi_J, threshold, ejected, KE, KE_eV: KE / 1.602e-19 }
})

const spectrumBands = [
  { name: 'Radio', min: 1e-1, max: 1e4, color: '#EF4444', range: '> 0.1 m' },
  { name: 'Microondas', min: 1e-3, max: 1e-1, color: '#F97316', range: '1mm - 0.1m' },
  { name: 'Infrarrojo', min: 7e-7, max: 1e-3, color: '#EAB308', range: '700nm - 1mm' },
  { name: 'Visible', min: 3.8e-7, max: 7e-7, color: 'linear-gradient(to right,#8B00FF,#0000FF,#00FF00,#FFFF00,#FF7F00,#FF0000)', range: '380-700nm' },
  { name: 'Ultravioleta', min: 1e-8, max: 3.8e-7, color: '#8B5CF6', range: '10-380nm' },
  { name: 'Rayos X', min: 1e-11, max: 1e-8, color: '#3B82F6', range: '0.01-10nm' },
  { name: 'Rayos Gamma', min: 0, max: 1e-11, color: '#6366F1', range: '< 0.01nm' },
]

// ═══════════════════════════════════════════════
// SECTION 5: Bohr y Espectros de Hidrogeno
// ═══════════════════════════════════════════════
const bohrN1 = ref(2)
const bohrN2 = ref(4)
const bohrResult = computed(() => {
  const n1 = bohrN1.value, n2 = bohrN2.value
  if (n1 >= n2 || n1 < 1 || n2 < 2) return null
  const E1 = -13.6 / (n1 * n1)
  const E2 = -13.6 / (n2 * n2)
  const deltaE_eV = E2 - E1
  const deltaE_J = Math.abs(deltaE_eV) * 1.602e-19
  const lambda = h * c / deltaE_J
  const nu = c / lambda
  let serie = 'Desconocida'
  if (n1 === 1) serie = 'Lyman (UV)'
  else if (n1 === 2) serie = 'Balmer (Visible)'
  else if (n1 === 3) serie = 'Paschen (IR)'
  else if (n1 === 4) serie = 'Brackett (IR lejano)'
  else if (n1 === 5) serie = 'Pfund (IR lejano)'
  return { E1, E2, deltaE_eV: Math.abs(deltaE_eV), deltaE_J, lambda, nu, serie }
})

function wavelengthToColor(lam) {
  const nm = lam * 1e9
  if (nm < 380) return '#8B00FF'
  if (nm < 440) return `rgb(${Math.round(255*(440-nm)/60)}, 0, 255)`
  if (nm < 490) return `rgb(0, ${Math.round(255*(nm-440)/50)}, 255)`
  if (nm < 510) return `rgb(0, 255, ${Math.round(255*(510-nm)/20)})`
  if (nm < 580) return `rgb(${Math.round(255*(nm-510)/70)}, 255, 0)`
  if (nm < 645) return `rgb(255, ${Math.round(255*(645-nm)/65)}, 0)`
  if (nm <= 700) return '#FF0000'
  return '#880000'
}

const bohrPhotonColor = computed(() => {
  if (!bohrResult.value) return '#888'
  return wavelengthToColor(bohrResult.value.lambda)
})

const seriesData = [
  { name: 'Lyman', nf: 1, region: 'Ultravioleta', transitions: [2,3,4,5,6] },
  { name: 'Balmer', nf: 2, region: 'Visible', transitions: [3,4,5,6] },
  { name: 'Paschen', nf: 3, region: 'Infrarrojo', transitions: [4,5,6] },
]

function sci(num, digits = 3) {
  if (!isFinite(num)) return '---'
  return num.toExponential(digits)
}

// ═══════════════════════════════════════════════
// SECTION 6: Pozo de Potencial del Hidrógeno
// ═══════════════════════════════════════════════
const RH = 2.1799e-18 // J
const a0 = 5.2918e-11 // m
const eCharge = 1.6022e-19 // C
const eV_factor = 1.6022e-19 // J per eV

// Calculadora por nivel n
const pozoN = ref(1)
const pozoCalc = computed(() => {
  const n = pozoN.value
  if (n < 1 || !Number.isFinite(n)) return null
  const n2 = n * n
  const Ep_J = -2 * RH / n2
  const Ek_J = RH / n2
  const H_J = -RH / n2
  const Ep_eV = Ep_J / eV_factor
  const Ek_eV = Ek_J / eV_factor
  const H_eV = H_J / eV_factor
  const epsilon = Ep_J / (-eCharge) // V
  const r_m = a0 * n2
  const r_A = r_m * 1e10
  return { n, Ep_J, Ek_J, H_J, Ep_eV, Ek_eV, H_eV, epsilon, Ek_eV_abs: Math.abs(Ek_eV), r_m, r_A }
})

// Modo inverso: dado un valor, hallar n
const pozoInverseMode = ref('hamiltoniano_J')
const pozoInverseInput = ref('')
const pozoInverseResult = computed(() => {
  const val = parseFloat(pozoInverseInput.value)
  if (!isFinite(val)) return null
  const mode = pozoInverseMode.value
  let n2
  if (mode === 'hamiltoniano_J') {
    // H = -RH/n² → n² = -RH/H
    if (val >= 0) return { error: 'El Hamiltoniano debe ser negativo (dentro del pozo)' }
    n2 = -RH / val
  } else if (mode === 'hamiltoniano_eV') {
    if (val >= 0) return { error: 'El Hamiltoniano debe ser negativo' }
    const H_J = val * eV_factor
    n2 = -RH / H_J
  } else if (mode === 'potencial_V') {
    // ε = Ep/(-e) = 2RH/(n²·e) → n² = 2RH/(ε·e)
    if (val <= 0) return { error: 'El potencial electrico debe ser positivo (dentro del pozo)' }
    n2 = 2 * RH / (val * eCharge)
  } else if (mode === 'Ep_J') {
    if (val >= 0) return { error: 'La energia potencial debe ser negativa' }
    n2 = -2 * RH / val
  } else if (mode === 'distancia_A') {
    if (val <= 0) return { error: 'La distancia debe ser positiva' }
    const r_m = val * 1e-10
    n2 = r_m / a0
  }
  const n = Math.sqrt(n2)
  const nRound = Math.round(n)
  const isInteger = Math.abs(n - nRound) < 0.01
  return { n_exact: n, n_round: nRound, isInteger, n2 }
})

// Tabla de valores para múltiples n
const pozoTableNs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 50, 100]
const pozoTable = computed(() => {
  return pozoTableNs.map(n => {
    const n2 = n * n
    return {
      n,
      H_J: -RH / n2,
      Ep_J: -2 * RH / n2,
      Ek_J: RH / n2,
      H_eV: (-RH / n2) / eV_factor,
      epsilon: (-2 * RH / n2) / (-eCharge),
      Ek_eV: (RH / n2) / eV_factor,
      r_m: a0 * n2,
      r_A: a0 * n2 * 1e10,
    }
  })
})

// Calculadora de transiciones
const transN0 = ref(9)
const transNf = ref(2)
const transResult = computed(() => {
  const n0 = transN0.value, nf = transNf.value
  if (n0 < 1 || nf < 1 || n0 === nf) return null
  const dEp = 2 * RH * (1 / (n0 * n0) - 1 / (nf * nf))
  const dH = RH * (1 / (n0 * n0) - 1 / (nf * nf))
  const dEp_eV = dEp / eV_factor
  const dH_eV = dH / eV_factor
  const dEk = -dH // cambio de cinética
  const dEk_eV = dEk / eV_factor
  const r0 = a0 * n0 * n0
  const rf = a0 * nf * nf
  const dr = rf - r0
  const isEmission = nf < n0
  // Potencial eléctrico del cambio
  const d_epsilon = dH / (-eCharge)
  return { dEp, dH, dEp_eV, dH_eV, dEk, dEk_eV, r0, rf, dr, isEmission, d_epsilon, n0, nf }
})

// Ionización
const ionZ = ref(1)
const ionResult = computed(() => {
  const Z = ionZ.value
  if (Z < 1) return null
  const E_ion_J = RH * Z * Z
  const E_ion_eV = E_ion_J / eV_factor
  const V_ion = -E_ion_eV // voltios
  return { E_ion_J, E_ion_eV, V_ion, Z }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold text-primary">Teoria Atomica</h1>
      <p class="text-muted-foreground">Unidad 2 - QG1: Modelos atomicos, numeros cuanticos, configuracion electronica y espectros</p>
    </div>

    <!-- Navigation Pills -->
    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="sec in sections"
        :key="sec.id"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
        :class="activeSection === sec.id
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'"
        @click="activeSection = sec.id"
      >
        <component :is="sec.icon" class="w-4 h-4" />
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 1: Modelos Atomicos               -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'modelos'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Linea de Tiempo: Modelos Atomicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="relative">
            <!-- Vertical timeline line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

            <div v-for="(m, idx) in modelos" :key="m.id" class="relative pl-20 pb-8 last:pb-0">
              <!-- Timeline dot -->
              <div
                class="absolute left-6 w-5 h-5 rounded-full border-2 border-background cursor-pointer transition-transform hover:scale-125"
                :style="{ backgroundColor: m.color }"
                @click="expandedModel = expandedModel === m.id ? null : m.id"
              />

              <!-- Year badge -->
              <Badge class="absolute left-0 -top-1 text-xs" variant="outline">{{ m.anio }}</Badge>

              <!-- Card -->
              <Card
                class="cursor-pointer transition-all hover:shadow-md"
                :class="expandedModel === m.id ? 'ring-2 ring-primary' : ''"
                @click="expandedModel = expandedModel === m.id ? null : m.id"
              >
                <CardContent class="pt-4 pb-4">
                  <div class="flex items-start gap-4">
                    <!-- SVG Model Illustration -->
                    <div class="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                      <!-- Dalton: solid sphere -->
                      <svg v-if="m.id === 'dalton'" viewBox="0 0 60 60" class="w-16 h-16">
                        <circle cx="30" cy="30" r="25" :fill="m.color" opacity="0.8" />
                        <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3" />
                      </svg>
                      <!-- Thomson: plum pudding -->
                      <svg v-else-if="m.id === 'thomson'" viewBox="0 0 60 60" class="w-16 h-16">
                        <circle cx="30" cy="30" r="25" :fill="m.color" opacity="0.3" />
                        <circle cx="20" cy="20" r="3" fill="#EF4444" /><circle cx="38" cy="18" r="3" fill="#EF4444" />
                        <circle cx="15" cy="35" r="3" fill="#EF4444" /><circle cx="35" cy="35" r="3" fill="#EF4444" />
                        <circle cx="28" cy="28" r="3" fill="#EF4444" /><circle cx="40" cy="27" r="3" fill="#EF4444" />
                        <circle cx="30" cy="42" r="3" fill="#EF4444" />
                      </svg>
                      <!-- Rutherford: nucleus + space -->
                      <svg v-else-if="m.id === 'rutherford'" viewBox="0 0 60 60" class="w-16 h-16">
                        <circle cx="30" cy="30" r="25" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.3" />
                        <circle cx="30" cy="30" r="6" :fill="m.color" />
                        <circle cx="12" cy="18" r="2" fill="#3B82F6" /><circle cx="48" cy="38" r="2" fill="#3B82F6" />
                        <circle cx="42" cy="15" r="2" fill="#3B82F6" />
                      </svg>
                      <!-- Bohr: orbits -->
                      <svg v-else-if="m.id === 'bohr'" viewBox="0 0 60 60" class="w-16 h-16">
                        <circle cx="30" cy="30" r="5" :fill="m.color" />
                        <circle cx="30" cy="30" r="12" fill="none" :stroke="m.color" stroke-width="0.8" opacity="0.5" />
                        <circle cx="30" cy="30" r="20" fill="none" :stroke="m.color" stroke-width="0.8" opacity="0.4" />
                        <circle cx="30" cy="30" r="27" fill="none" :stroke="m.color" stroke-width="0.8" opacity="0.3" />
                        <circle cx="42" cy="30" r="2.5" fill="#3B82F6" /><circle cx="19" cy="16" r="2.5" fill="#3B82F6" />
                      </svg>
                      <!-- Mecanica cuantica: cloud -->
                      <svg v-else viewBox="0 0 60 60" class="w-16 h-16">
                        <circle cx="30" cy="30" r="4" :fill="m.color" />
                        <circle v-for="i in 30" :key="i" :cx="30 + (Math.random()-0.5)*40" :cy="30 + (Math.random()-0.5)*40" r="1.2" :fill="m.color" :opacity="0.15 + Math.random()*0.4" />
                      </svg>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-lg">{{ m.nombre }}</h3>
                        <Badge variant="secondary">{{ m.anio }}</Badge>
                      </div>
                      <p class="text-muted-foreground text-sm">{{ m.descCorta }}</p>

                      <!-- Expanded details -->
                      <div v-if="expandedModel === m.id" class="mt-3 space-y-2 animate-in fade-in duration-200">
                        <p class="text-sm">{{ m.descLarga }}</p>
                        <div class="flex flex-col gap-1 text-sm">
                          <span class="text-primary font-medium">Descubrimiento: {{ m.descubrimiento }}</span>
                          <span class="text-destructive">Limitacion: {{ m.limitacion }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: Numeros Cuanticos               -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'cuanticos'" class="space-y-6">
      <!-- Explorador interactivo -->
      <Card>
        <CardHeader>
          <CardTitle>Explorador de Numeros Cuanticos</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Controls -->
            <div class="space-y-4">
              <!-- n -->
              <div>
                <Label class="text-sm font-semibold">n (principal): {{ qn.n }}</Label>
                <input type="range" min="1" max="7" v-model.number="qn.n" class="w-full mt-1 accent-primary"
                  @input="qn.l = Math.min(qn.l, qn.n - 1); qn.ml = Math.max(-qn.l, Math.min(qn.l, qn.ml))" />
                <p class="text-xs text-muted-foreground">Nivel de energia / tamano de la capa (1-7)</p>
              </div>

              <!-- l -->
              <div>
                <Label class="text-sm font-semibold">l (azimutal): {{ qn.l }} = {{ orbitalLetters[qn.l] || '?' }}</Label>
                <div class="flex gap-2 mt-1">
                  <button
                    v-for="lv in validLValues"
                    :key="lv"
                    class="px-3 py-1 rounded text-sm transition-colors"
                    :class="qn.l === lv ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
                    @click="qn.l = lv; qn.ml = Math.max(-lv, Math.min(lv, qn.ml))"
                  >
                    {{ lv }} ({{ orbitalLetters[lv] }})
                  </button>
                </div>
                <p class="text-xs text-muted-foreground">Forma del orbital (0 a n-1)</p>
              </div>

              <!-- ml -->
              <div>
                <Label class="text-sm font-semibold">ml (magnetico): {{ qn.ml }}</Label>
                <div class="flex gap-2 mt-1 flex-wrap">
                  <button
                    v-for="mlv in validMlValues"
                    :key="mlv"
                    class="px-3 py-1 rounded text-sm transition-colors"
                    :class="qn.ml === mlv ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
                    @click="qn.ml = mlv"
                  >
                    {{ mlv >= 0 ? '+' : '' }}{{ mlv }}
                  </button>
                </div>
                <p class="text-xs text-muted-foreground">Orientacion en el espacio (-l a +l)</p>
              </div>

              <!-- ms -->
              <div>
                <Label class="text-sm font-semibold">ms (spin): {{ qn.ms > 0 ? '+1/2' : '-1/2' }}</Label>
                <div class="flex gap-2 mt-1">
                  <button
                    class="px-3 py-1 rounded text-sm transition-colors"
                    :class="qn.ms === 0.5 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
                    @click="qn.ms = 0.5"
                  >+1/2 (arriba)</button>
                  <button
                    class="px-3 py-1 rounded text-sm transition-colors"
                    :class="qn.ms === -0.5 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
                    @click="qn.ms = -0.5"
                  >-1/2 (abajo)</button>
                </div>
              </div>

              <!-- Summary -->
              <div class="p-3 rounded-lg bg-muted">
                <p class="font-mono text-sm">Orbital: <strong>{{ orbitalName }}</strong></p>
                <p class="text-sm">Max electrones en subnivel: <strong>{{ maxElectronsSubnivel }}</strong></p>
                <p class="text-sm">Numeros cuanticos: ({{ qn.n }}, {{ qn.l }}, {{ qn.ml }}, {{ qn.ms > 0 ? '+1/2' : '-1/2' }})</p>
              </div>
            </div>

            <!-- Orbital SVG visualization -->
            <div class="flex flex-col items-center">
              <p class="text-sm font-semibold mb-2">Forma del orbital {{ orbitalName }} <span class="text-muted-foreground font-normal">(ml={{ qn.ml >= 0 ? '+' : '' }}{{ qn.ml }})</span></p>
              <svg viewBox="0 0 220 220" class="w-56 h-56">
                <!-- Axes -->
                <line x1="110" y1="20" x2="110" y2="200" stroke="currentColor" opacity="0.15" stroke-width="0.8" stroke-dasharray="4 3" />
                <line x1="20" y1="110" x2="200" y2="110" stroke="currentColor" opacity="0.15" stroke-width="0.8" stroke-dasharray="4 3" />
                <text x="114" y="18" class="fill-current" opacity="0.4" font-size="10">z</text>
                <text x="203" y="114" class="fill-current" opacity="0.4" font-size="10">x</text>

                <!-- s orbital: concentric shells -->
                <template v-if="qn.l === 0">
                  <circle v-if="qn.n >= 3" cx="110" cy="110" r="70" fill="none" stroke="currentColor" opacity="0.1" stroke-width="1" stroke-dasharray="3 2" />
                  <circle v-if="qn.n >= 2" cx="110" cy="110" r="50" fill="none" stroke="currentColor" opacity="0.15" stroke-width="1" stroke-dasharray="3 2" />
                  <circle cx="110" cy="110" :r="35 + (qn.n - 1) * 10" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5" />
                  <circle cx="110" cy="110" :r="20 + (qn.n - 1) * 5" fill="currentColor" opacity="0.12" />
                  <circle cx="110" cy="110" r="3" fill="currentColor" />
                  <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">Esferica ({{ qn.n }}s)</text>
                  <text v-if="qn.n > 1" x="110" y="195" text-anchor="middle" class="fill-current" opacity="0.5" font-size="9">{{ qn.n - 1 }} nodo{{ qn.n > 2 ? 's' : '' }} radial{{ qn.n > 2 ? 'es' : '' }}</text>
                </template>

                <!-- p orbital: orientation depends on ml -->
                <template v-else-if="qn.l === 1">
                  <!-- pz: ml=0 (along z axis) -->
                  <template v-if="qn.ml === 0">
                    <ellipse cx="110" cy="60" rx="28" ry="42" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.5" />
                    <ellipse cx="110" cy="160" rx="28" ry="42" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.5" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="142" y="58" fill="#3B82F6" font-size="10" font-weight="bold">+</text>
                    <text x="142" y="168" fill="#EF4444" font-size="10" font-weight="bold">-</text>
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">p_z (ml=0)</text>
                  </template>
                  <!-- px: ml=+1 (along x axis) -->
                  <template v-else-if="qn.ml === 1">
                    <ellipse cx="60" cy="110" rx="42" ry="28" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.5" />
                    <ellipse cx="160" cy="110" rx="42" ry="28" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.5" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="55" y="78" fill="#3B82F6" font-size="10" font-weight="bold">+</text>
                    <text x="155" y="78" fill="#EF4444" font-size="10" font-weight="bold">-</text>
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">p_x (ml=+1)</text>
                  </template>
                  <!-- py: ml=-1 (along y axis, shown tilted) -->
                  <template v-else>
                    <ellipse cx="65" cy="65" rx="22" ry="38" transform="rotate(-45 65 65)" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.5" />
                    <ellipse cx="155" cy="155" rx="22" ry="38" transform="rotate(-45 155 155)" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.5" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="38" y="50" fill="#3B82F6" font-size="10" font-weight="bold">+</text>
                    <text x="168" y="170" fill="#EF4444" font-size="10" font-weight="bold">-</text>
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">p_y (ml=-1)</text>
                    <line x1="45" y1="175" x2="175" y2="45" stroke="currentColor" opacity="0.12" stroke-width="0.8" stroke-dasharray="4 3" />
                    <text x="178" y="42" class="fill-current" opacity="0.4" font-size="10">y</text>
                  </template>
                  <text x="110" y="195" text-anchor="middle" class="fill-current" opacity="0.5" font-size="9">1 nodo angular (plano)</text>
                </template>

                <!-- d orbitals: 5 orientations -->
                <template v-else-if="qn.l === 2">
                  <!-- dz²: ml=0 (donut + lobes on z) -->
                  <template v-if="qn.ml === 0">
                    <ellipse cx="110" cy="55" rx="20" ry="35" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="110" cy="165" rx="20" ry="35" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="110" cy="110" rx="40" ry="14" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" stroke-width="1.2" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">d_z² (ml=0)</text>
                  </template>
                  <!-- dxz: ml=+1 -->
                  <template v-else-if="qn.ml === 1">
                    <ellipse cx="65" cy="65" rx="18" ry="32" transform="rotate(-45 65 65)" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="155" cy="155" rx="18" ry="32" transform="rotate(-45 155 155)" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="155" cy="65" rx="18" ry="32" transform="rotate(45 155 65)" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <ellipse cx="65" cy="155" rx="18" ry="32" transform="rotate(45 65 155)" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">d_xz (ml=+1)</text>
                  </template>
                  <!-- dyz: ml=-1 -->
                  <template v-else-if="qn.ml === -1">
                    <ellipse cx="70" cy="65" rx="18" ry="30" transform="rotate(-30 70 65)" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="150" cy="155" rx="18" ry="30" transform="rotate(-30 150 155)" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="150" cy="65" rx="18" ry="30" transform="rotate(30 150 65)" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <ellipse cx="70" cy="155" rx="18" ry="30" transform="rotate(30 70 155)" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">d_yz (ml=-1)</text>
                  </template>
                  <!-- dx²-y²: ml=+2 (lobes on axes) -->
                  <template v-else-if="qn.ml === 2">
                    <ellipse cx="60" cy="110" rx="32" ry="18" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="160" cy="110" rx="32" ry="18" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />
                    <ellipse cx="110" cy="60" rx="18" ry="32" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <ellipse cx="110" cy="160" rx="18" ry="32" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">d_x²-y² (ml=+2)</text>
                  </template>
                  <!-- dxy: ml=-2 -->
                  <template v-else>
                    <ellipse cx="65" cy="65" rx="16" ry="30" transform="rotate(-45 65 65)" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" stroke-width="1.2" />
                    <ellipse cx="155" cy="155" rx="16" ry="30" transform="rotate(-45 155 155)" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" stroke-width="1.2" />
                    <ellipse cx="155" cy="65" rx="16" ry="30" transform="rotate(45 155 65)" fill="#10B981" opacity="0.25" stroke="#10B981" stroke-width="1.2" />
                    <ellipse cx="65" cy="155" rx="16" ry="30" transform="rotate(45 65 155)" fill="#10B981" opacity="0.25" stroke="#10B981" stroke-width="1.2" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">d_xy (ml=-2)</text>
                  </template>
                  <text x="110" y="195" text-anchor="middle" class="fill-current" opacity="0.5" font-size="9">2 nodos angulares</text>
                </template>

                <!-- f orbitals -->
                <template v-else>
                  <!-- fz³: ml=0 -->
                  <template v-if="qn.ml === 0">
                    <ellipse cx="110" cy="45" rx="16" ry="30" fill="#8B5CF6" opacity="0.25" stroke="#8B5CF6" stroke-width="1.2" />
                    <ellipse cx="110" cy="175" rx="16" ry="30" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1.2" />
                    <ellipse cx="110" cy="110" rx="35" ry="12" fill="#3B82F6" opacity="0.15" stroke="#3B82F6" stroke-width="1" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">f_z³ (ml=0)</text>
                  </template>
                  <!-- generic f for other ml -->
                  <template v-else>
                    <ellipse cx="60" cy="55" rx="14" ry="26" :transform="`rotate(${-30 + qn.ml * 15} 60 55)`" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" stroke-width="1" />
                    <ellipse cx="160" cy="55" rx="14" ry="26" :transform="`rotate(${30 - qn.ml * 15} 160 55)`" fill="#3B82F6" opacity="0.2" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="50" cy="120" rx="14" ry="26" :transform="`rotate(${-60 + qn.ml * 10} 50 120)`" fill="#EF4444" opacity="0.2" stroke="#EF4444" stroke-width="1" />
                    <ellipse cx="170" cy="120" rx="14" ry="26" :transform="`rotate(${60 - qn.ml * 10} 170 120)`" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" stroke-width="1" />
                    <ellipse cx="70" cy="165" rx="14" ry="22" :transform="`rotate(${20 + qn.ml * 8} 70 165)`" fill="#10B981" opacity="0.2" stroke="#10B981" stroke-width="1" />
                    <ellipse cx="150" cy="165" rx="14" ry="22" :transform="`rotate(${-20 - qn.ml * 8} 150 165)`" fill="#EC4899" opacity="0.2" stroke="#EC4899" stroke-width="1" />
                    <ellipse cx="110" cy="40" rx="11" ry="22" fill="#06B6D4" opacity="0.2" stroke="#06B6D4" stroke-width="1" />
                    <circle cx="110" cy="110" r="3" fill="currentColor" />
                    <text x="110" y="205" text-anchor="middle" class="fill-current" font-size="11">f (ml={{ qn.ml >= 0 ? '+' : '' }}{{ qn.ml }})</text>
                  </template>
                  <text x="110" y="195" text-anchor="middle" class="fill-current" opacity="0.5" font-size="9">3 nodos angulares</text>
                </template>

                <!-- Nucleus dot always -->
                <circle cx="110" cy="110" r="2.5" fill="currentColor" opacity="0.7" />
              </svg>

              <!-- Orbital info panel -->
              <div class="mt-3 w-full p-3 rounded-lg bg-muted/50 text-xs space-y-1">
                <p><strong>Subnivel:</strong> {{ orbitalName }} &mdash; {{ qn.l === 0 ? 'esferica' : qn.l === 1 ? '2 lobulos (mancuerna)' : qn.l === 2 ? '4 lobulos (trebol)' : '6-8 lobulos' }}</p>
                <p><strong>Nodos angulares:</strong> {{ qn.l }} &nbsp;|&nbsp; <strong>Nodos radiales:</strong> {{ qn.n - qn.l - 1 }} &nbsp;|&nbsp; <strong>Total:</strong> {{ qn.n - 1 }}</p>
                <p><strong>Orientacion (ml={{ qn.ml >= 0 ? '+' : '' }}{{ qn.ml }}):</strong> {{ qn.l === 0 ? 'sin orientacion (simetria esferica)' : qn.l === 1 ? (qn.ml === 0 ? 'eje z' : qn.ml === 1 ? 'eje x' : 'eje y') : qn.l === 2 ? (qn.ml === 0 ? 'eje z (con anillo)' : qn.ml === 2 ? 'ejes x/z' : qn.ml === -2 ? 'plano xy (45°)' : qn.ml === 1 ? 'plano xz (45°)' : 'plano yz (45°)') : 'orientacion compleja en 3D' }}</p>
                <p class="text-muted-foreground">Nodos = regiones donde la probabilidad de encontrar al electron es 0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Todas las orientaciones del subnivel -->
      <Card v-if="qn.l > 0">
        <CardHeader>
          <CardTitle class="text-base">Todas las orientaciones de {{ orbitalName }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap justify-center gap-4">
            <!-- p orbitals: 3 orientations -->
            <template v-if="qn.l === 1">
              <div v-for="o in [{ml:1, name:'p_x', axis:'eje x'}, {ml:0, name:'p_z', axis:'eje z'}, {ml:-1, name:'p_y', axis:'eje y'}]" :key="o.ml"
                class="flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer"
                :class="qn.ml === o.ml ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'"
                @click="qn.ml = o.ml">
                <svg viewBox="0 0 100 100" class="w-20 h-20">
                  <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" opacity="0.1" stroke-width="0.5" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" opacity="0.1" stroke-width="0.5" />
                  <template v-if="o.ml === 0">
                    <ellipse cx="50" cy="25" rx="14" ry="22" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="50" cy="75" rx="14" ry="22" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="1" />
                  </template>
                  <template v-else-if="o.ml === 1">
                    <ellipse cx="25" cy="50" rx="22" ry="14" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="75" cy="50" rx="22" ry="14" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="1" />
                  </template>
                  <template v-else>
                    <ellipse cx="30" cy="30" rx="12" ry="20" transform="rotate(-45 30 30)" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="70" cy="70" rx="12" ry="20" transform="rotate(-45 70 70)" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="1" />
                  </template>
                  <circle cx="50" cy="50" r="2" fill="currentColor" />
                </svg>
                <span class="text-xs font-mono font-semibold">{{ o.name }}</span>
                <span class="text-[10px] text-muted-foreground">{{ o.axis }}</span>
              </div>
            </template>

            <!-- d orbitals: 5 orientations -->
            <template v-else-if="qn.l === 2">
              <div v-for="o in [{ml:0, name:'d_z²'}, {ml:1, name:'d_xz'}, {ml:-1, name:'d_yz'}, {ml:2, name:'d_x²-y²'}, {ml:-2, name:'d_xy'}]" :key="o.ml"
                class="flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer"
                :class="qn.ml === o.ml ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'"
                @click="qn.ml = o.ml">
                <svg viewBox="0 0 100 100" class="w-16 h-16">
                  <template v-if="o.ml === 0">
                    <ellipse cx="50" cy="25" rx="10" ry="18" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="50" cy="75" rx="10" ry="18" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="50" cy="50" rx="20" ry="7" fill="#F59E0B" opacity="0.2" stroke="#F59E0B" stroke-width="0.8" />
                  </template>
                  <template v-else-if="o.ml === 2">
                    <ellipse cx="25" cy="50" rx="18" ry="10" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="75" cy="50" rx="18" ry="10" fill="#3B82F6" opacity="0.3" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="50" cy="25" rx="10" ry="18" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="1" />
                    <ellipse cx="50" cy="75" rx="10" ry="18" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="1" />
                  </template>
                  <template v-else>
                    <ellipse cx="30" cy="30" rx="10" ry="18" :transform="`rotate(${o.ml === 1 ? -45 : o.ml === -1 ? -30 : -45} ${o.ml === -1 ? 30 : 30} 30)`" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="70" cy="70" rx="10" ry="18" :transform="`rotate(${o.ml === 1 ? -45 : o.ml === -1 ? -30 : -45} ${o.ml === -1 ? 70 : 70} 70)`" fill="#3B82F6" opacity="0.25" stroke="#3B82F6" stroke-width="1" />
                    <ellipse cx="70" cy="30" rx="10" ry="18" :transform="`rotate(${o.ml === 1 ? 45 : o.ml === -1 ? 30 : 45} 70 30)`" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1" />
                    <ellipse cx="30" cy="70" rx="10" ry="18" :transform="`rotate(${o.ml === 1 ? 45 : o.ml === -1 ? 30 : 45} 30 70)`" fill="#EF4444" opacity="0.25" stroke="#EF4444" stroke-width="1" />
                  </template>
                  <circle cx="50" cy="50" r="2" fill="currentColor" />
                </svg>
                <span class="text-xs font-mono font-semibold">{{ o.name }}</span>
              </div>
            </template>

            <!-- f orbitals: 7 orientations -->
            <template v-else>
              <div v-for="mlv in [-3,-2,-1,0,1,2,3]" :key="mlv"
                class="flex flex-col items-center p-1.5 rounded-lg transition-colors cursor-pointer"
                :class="qn.ml === mlv ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-muted'"
                @click="qn.ml = mlv">
                <svg viewBox="0 0 80 80" class="w-12 h-12">
                  <ellipse cx="40" cy="20" rx="8" ry="14" fill="#8B5CF6" opacity="0.3" stroke="#8B5CF6" stroke-width="0.8" :transform="`rotate(${mlv * 12} 40 20)`" />
                  <ellipse cx="40" cy="60" rx="8" ry="14" fill="#EF4444" opacity="0.3" stroke="#EF4444" stroke-width="0.8" :transform="`rotate(${-mlv * 12} 40 60)`" />
                  <ellipse cx="22" cy="40" rx="14" ry="8" fill="#3B82F6" opacity="0.2" stroke="#3B82F6" stroke-width="0.8" :transform="`rotate(${mlv * 8} 22 40)`" />
                  <ellipse cx="58" cy="40" rx="14" ry="8" fill="#10B981" opacity="0.2" stroke="#10B981" stroke-width="0.8" :transform="`rotate(${-mlv * 8} 58 40)`" />
                  <circle cx="40" cy="40" r="1.5" fill="currentColor" />
                </svg>
                <span class="text-[10px] font-mono">ml={{ mlv >= 0 ? '+' : '' }}{{ mlv }}</span>
              </div>
            </template>
          </div>
          <p class="text-xs text-muted-foreground mt-3 text-center">Haz clic en una orientacion para verla en detalle arriba. Cada orbital puede tener max 2 electrones (Pauli).</p>
        </CardContent>
      </Card>

      <!-- Validador -->
      <Card>
        <CardHeader>
          <CardTitle>Validador de Numeros Cuanticos</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label>n</Label>
              <Input v-model="qnValidator.n" placeholder="1-7" type="number" />
            </div>
            <div>
              <Label>l</Label>
              <Input v-model="qnValidator.l" placeholder="0 a n-1" type="number" />
            </div>
            <div>
              <Label>ml</Label>
              <Input v-model="qnValidator.ml" placeholder="-l a +l" type="number" />
            </div>
            <div>
              <Label>ms</Label>
              <Input v-model="qnValidator.ms" placeholder="+0.5 o -0.5" />
            </div>
          </div>
          <div class="mt-3 p-3 rounded-lg" :class="qnValidation.valid === true ? 'bg-green-500/10 text-green-700 dark:text-green-400' : qnValidation.valid === false ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-muted text-muted-foreground'">
            {{ qnValidation.msg }}
          </div>
        </CardContent>
      </Card>

      <!-- Tabla de subniveles -->
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Subniveles</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2">n</th>
                  <th class="text-left p-2">l</th>
                  <th class="text-left p-2">Subnivel</th>
                  <th class="text-left p-2">ml posibles</th>
                  <th class="text-left p-2">Orbitales</th>
                  <th class="text-left p-2">Max e-</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in subnivelTable" :key="row.nombre" class="border-b border-border/50 hover:bg-muted/50">
                  <td class="p-2">{{ row.n }}</td>
                  <td class="p-2">{{ row.l }}</td>
                  <td class="p-2 font-mono font-semibold">{{ row.nombre }}</td>
                  <td class="p-2 text-muted-foreground">{{ Array.from({ length: 2 * row.l + 1 }, (_, i) => i - row.l).join(', ') }}</td>
                  <td class="p-2">{{ row.orbitales }}</td>
                  <td class="p-2 font-semibold">{{ row.maxE }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 3: Configuracion Electronica       -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'configuracion'" class="space-y-6">
      <!-- Aufbau diagram -->
      <Card>
        <CardHeader>
          <CardTitle>Diagrama de Aufbau (Regla Diagonal)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex justify-center">
            <svg viewBox="0 0 340 300" class="w-full max-w-md">
              <!-- Grid of orbitals -->
              <text v-for="(row, ri) in [
                ['1s'],
                ['2s', '2p'],
                ['3s', '3p', '3d'],
                ['4s', '4p', '4d', '4f'],
                ['5s', '5p', '5d', '5f'],
                ['6s', '6p', '6d'],
                ['7s', '7p']
              ]" :key="ri">
                <text
                  v-for="(orb, ci) in row"
                  :key="orb"
                  :x="40 + ci * 70"
                  :y="30 + ri * 38"
                  font-size="14"
                  font-weight="bold"
                  class="fill-current"
                  text-anchor="middle"
                >{{ orb }}</text>
              </text>
              <!-- Diagonal arrows -->
              <g stroke="currentColor" stroke-width="1.2" opacity="0.4" fill="none" marker-end="url(#arrowhead)">
                <line x1="40" y1="35" x2="40" y2="62" />
                <line x1="110" y1="73" x2="45" y2="97" />
                <line x1="110" y1="111" x2="45" y2="135" />
                <line x1="180" y1="149" x2="45" y2="173" />
                <line x1="180" y1="187" x2="45" y2="211" />
                <line x1="250" y1="187" x2="115" y2="211" />
              </g>
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                  <polygon points="0 0, 6 2, 0 4" fill="currentColor" opacity="0.4" />
                </marker>
              </defs>
              <!-- Aufbau order text -->
              <text x="170" y="290" text-anchor="middle" font-size="10" class="fill-current" opacity="0.6">
                Orden: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s ...
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      <!-- Interactive config generator -->
      <Card>
        <CardHeader>
          <CardTitle>Generador de Configuracion Electronica</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-3">
            <Label>Z o simbolo:</Label>
            <Input v-model="configInput" class="max-w-32" placeholder="6 o C" />
            <span v-if="configZ" class="text-sm text-muted-foreground">
              {{ elementSymbols[configZ] }} ({{ elementNames[configZ] }}), Z={{ configZ }}
            </span>
          </div>

          <div v-if="electronConfig" class="space-y-4">
            <!-- Full config -->
            <div class="p-3 rounded-lg bg-muted">
              <p class="text-sm font-semibold mb-1">Configuracion completa:</p>
              <p class="font-mono text-lg">{{ configString }}</p>
            </div>

            <!-- Noble gas shorthand -->
            <div class="p-3 rounded-lg bg-muted">
              <p class="text-sm font-semibold mb-1">Notacion de gas noble:</p>
              <p class="font-mono text-lg">{{ nobleGasConfig }}</p>
            </div>

            <!-- Exception warning -->
            <div v-if="isException" class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p class="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Excepcion: {{ isException.nota }}</p>
              <p class="text-xs text-muted-foreground mt-1">La configuracion real difiere del Aufbau porque un subnivel d medio lleno o lleno es mas estable.</p>
            </div>

            <!-- Orbital diagram -->
            <div>
              <p class="text-sm font-semibold mb-2">Diagrama de orbitales (Hund + Pauli):</p>
              <div class="flex flex-wrap gap-3">
                <div v-for="[orb, count] in electronConfig" :key="orb" class="text-center">
                  <div class="flex gap-0.5">
                    <div
                      v-for="(box, bi) in getOrbitalBoxes(orb, count)"
                      :key="bi"
                      class="w-8 h-10 border border-border rounded flex flex-col items-center justify-center text-xs"
                    >
                      <span v-if="box.up" class="text-primary leading-none">&#8593;</span>
                      <span v-if="box.down" class="text-destructive leading-none">&#8595;</span>
                    </div>
                  </div>
                  <p class="text-xs mt-1 font-mono">{{ orb }}</p>
                </div>
              </div>
              <div class="mt-3 flex gap-4 text-xs text-muted-foreground">
                <span><span class="text-primary">&#8593;</span> = ms +1/2 (Pauli: max 2 e- por orbital)</span>
                <span><span class="text-destructive">&#8595;</span> = ms -1/2 (Hund: llenar 1 e- por orbital primero)</span>
              </div>
            </div>
          </div>

          <div v-else-if="configInput.trim()" class="p-3 rounded-lg bg-red-500/10 text-red-700 dark:text-red-400 text-sm">
            Elemento no encontrado. Ingresa Z (1-36) o un simbolo valido.
          </div>
        </CardContent>
      </Card>

      <!-- Quick reference -->
      <Card>
        <CardHeader>
          <CardTitle>Referencia Rapida (Z=1 a 36)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
            <div
              v-for="z in 36"
              :key="z"
              class="p-2 rounded bg-muted/50 hover:bg-muted cursor-pointer font-mono"
              :class="exceptions[z] ? 'ring-1 ring-yellow-500/50' : ''"
              @click="configInput = String(z)"
            >
              <span class="font-semibold">{{ z }}. {{ elementSymbols[z] }}</span>
              <span v-if="exceptions[z]" class="text-yellow-600 ml-1">*</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 4: Espectro y Fotoelectrico        -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'espectro'" class="space-y-6">
      <!-- Spectrum visualization -->
      <Card>
        <CardHeader>
          <CardTitle>Espectro Electromagnetico</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex rounded-lg overflow-hidden h-12">
            <div
              v-for="band in spectrumBands"
              :key="band.name"
              class="flex-1 flex items-center justify-center text-xs text-white font-medium relative group"
              :style="{ background: band.color }"
            >
              <span class="hidden md:inline">{{ band.name }}</span>
              <div class="absolute -bottom-8 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {{ band.range }}
              </div>
            </div>
          </div>
          <div class="flex justify-between text-xs text-muted-foreground mt-6">
            <span>Frecuencia baja / longitud de onda larga</span>
            <span>Frecuencia alta / longitud de onda corta</span>
          </div>

          <!-- Visible spectrum detail -->
          <div class="mt-4">
            <p class="text-sm font-semibold mb-2">Espectro Visible (380-700 nm)</p>
            <div class="h-8 rounded-lg" style="background: linear-gradient(to right, #8B00FF, #4B0082, #0000FF, #00BFFF, #00FF00, #ADFF2F, #FFFF00, #FFA500, #FF4500, #FF0000)" />
            <div class="flex justify-between text-xs text-muted-foreground mt-1">
              <span>380 nm (violeta)</span>
              <span>520 nm (verde)</span>
              <span>700 nm (rojo)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Calculators -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- From frequency -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Calculadora: Frecuencia a Energia/Longitud</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div>
              <Label>Frecuencia (Hz)</Label>
              <Input v-model="specCalc.freq" placeholder="5e14" />
            </div>
            <div v-if="specFromFreq" class="space-y-1 text-sm p-3 bg-muted rounded-lg">
              <p><strong>E = h x v</strong> = {{ sci(specFromFreq.E) }} J</p>
              <p><strong>E</strong> = {{ sci(specFromFreq.E / 1.602e-19) }} eV</p>
              <p><strong>lambda = c / v</strong> = {{ sci(specFromFreq.lambda) }} m = {{ (specFromFreq.lambda * 1e9).toFixed(2) }} nm</p>
            </div>
          </CardContent>
        </Card>

        <!-- From wavelength -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">Calculadora: Longitud de onda a Energia</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div>
              <Label>Longitud de onda (nm)</Label>
              <Input v-model="specCalc.wavelength" placeholder="500" />
            </div>
            <div v-if="specFromLambda" class="space-y-1 text-sm p-3 bg-muted rounded-lg">
              <p><strong>v = c / lambda</strong> = {{ sci(specFromLambda.nu) }} Hz</p>
              <p><strong>E = hc / lambda</strong> = {{ sci(specFromLambda.E) }} J</p>
              <p><strong>E</strong> = {{ sci(specFromLambda.E / 1.602e-19) }} eV</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Rydberg -->
      <Card>
        <CardHeader>
          <CardTitle class="text-base">Formula de Rydberg: 1/lambda = R(1/n1 squared - 1/n2 squared)</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="flex gap-4 items-end">
            <div>
              <Label>n1 (nivel inferior)</Label>
              <Input v-model="rydCalc.n1" type="number" min="1" class="max-w-24" />
            </div>
            <div>
              <Label>n2 (nivel superior)</Label>
              <Input v-model="rydCalc.n2" type="number" min="2" class="max-w-24" />
            </div>
          </div>
          <div v-if="rydResult" class="p-3 bg-muted rounded-lg text-sm space-y-1">
            <p><strong>1/lambda</strong> = {{ sci(rydResult.invLambda) }} m-1</p>
            <p><strong>lambda</strong> = {{ sci(rydResult.lambda) }} m = {{ (rydResult.lambda * 1e9).toFixed(2) }} nm</p>
            <p><strong>v</strong> = {{ sci(rydResult.nu) }} Hz</p>
            <p><strong>E</strong> = {{ sci(rydResult.E) }} J = {{ (rydResult.E / 1.602e-19).toFixed(4) }} eV</p>
          </div>
          <p class="text-xs text-muted-foreground">R = 1.097 x 10 a la 7 m-1, h = 6.626 x 10 a la -34 J*s, c = 3 x 10 a la 8 m/s</p>
        </CardContent>
      </Card>

      <!-- Photoelectric Effect -->
      <Card>
        <CardHeader>
          <CardTitle>Efecto Fotoelectrico</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">KE = hv - Phi (energia cinetica del electron = energia del foton - funcion de trabajo)</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div>
                <Label>Frecuencia de la luz (Hz)</Label>
                <Input v-model="photoelectric.freq" placeholder="8e14" />
              </div>
              <div>
                <Label>Funcion de trabajo Phi (eV)</Label>
                <Input v-model="photoelectric.workFunction" placeholder="3.5" />
              </div>
            </div>

            <div v-if="photoResult" class="space-y-3">
              <div class="p-3 rounded-lg text-sm space-y-1" :class="photoResult.ejected ? 'bg-green-500/10' : 'bg-red-500/10'">
                <p class="font-semibold" :class="photoResult.ejected ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                  {{ photoResult.ejected ? 'Electron EXPULSADO' : 'Electron NO expulsado' }}
                </p>
                <p>E foton = {{ sci(photoResult.E_photon) }} J</p>
                <p>Phi = {{ sci(photoResult.phi_J) }} J</p>
                <p>v umbral = {{ sci(photoResult.threshold) }} Hz</p>
                <p v-if="photoResult.ejected">
                  <strong>KE = {{ sci(photoResult.KE) }} J = {{ photoResult.KE_eV.toFixed(4) }} eV</strong>
                </p>
              </div>

              <!-- Visual -->
              <svg viewBox="0 0 300 120" class="w-full max-w-sm">
                <!-- Metal surface -->
                <rect x="10" y="50" width="120" height="60" fill="#94A3B8" rx="4" />
                <text x="70" y="85" text-anchor="middle" font-size="10" fill="#1E293B">Metal</text>
                <!-- Photon -->
                <line x1="180" y1="20" x2="130" y2="55" stroke="#FBBF24" stroke-width="2" stroke-dasharray="5 3" />
                <polygon points="130,55 140,48 138,58" fill="#FBBF24" />
                <text x="190" y="18" font-size="9" fill="#FBBF24">foton (hv)</text>
                <!-- Electron -->
                <template v-if="photoResult.ejected">
                  <circle cx="115" cy="55" r="5" fill="#3B82F6" />
                  <line x1="120" y1="50" x2="180" y2="20" stroke="#3B82F6" stroke-width="1.5" marker-end="url(#arrowBlue)" />
                  <text x="190" y="35" font-size="9" fill="#3B82F6">e- (KE)</text>
                </template>
                <template v-else>
                  <circle cx="90" cy="60" r="5" fill="#EF4444" />
                  <text x="90" y="48" font-size="8" fill="#EF4444" text-anchor="middle">atrapado</text>
                </template>
                <defs>
                  <marker id="arrowBlue" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#3B82F6" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 5: Bohr y Espectros                -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'bohr'" class="space-y-6">
      <!-- Interactive Bohr Model -->
      <Card>
        <CardHeader>
          <CardTitle>Modelo de Bohr - Transiciones del Hidrogeno</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Bohr SVG -->
            <div class="flex justify-center">
              <svg viewBox="0 0 300 300" class="w-full max-w-sm">
                <!-- Energy levels as concentric circles -->
                <circle v-for="n in 6" :key="n" cx="150" cy="150" :r="20 + n * 22" fill="none" stroke="currentColor" :stroke-width="n <= Math.max(bohrN1, bohrN2) ? 1.5 : 0.5" :opacity="n <= Math.max(bohrN1, bohrN2) ? 0.6 : 0.2" />
                <!-- Level labels -->
                <text v-for="n in 6" :key="'label'+n" :x="155 + (20 + n * 22) * 0.7" :y="150 - (20 + n * 22) * 0.7" font-size="10" class="fill-current" opacity="0.6">n={{ n }}</text>
                <!-- Nucleus -->
                <circle cx="150" cy="150" r="8" fill="#EF4444" opacity="0.8" />
                <text x="150" y="153" text-anchor="middle" font-size="7" fill="white">p+</text>
                <!-- Electron on n2 -->
                <circle :cx="150 + (20 + bohrN2 * 22)" :cy="150" r="5" fill="#3B82F6" />
                <!-- Transition arrow -->
                <line
                  :x1="150 + (20 + bohrN2 * 22) - 5"
                  y1="150"
                  :x2="150 + (20 + bohrN1 * 22) + 8"
                  y2="150"
                  :stroke="bohrPhotonColor"
                  stroke-width="2"
                  marker-end="url(#arrowPhoton)"
                />
                <!-- Photon wave -->
                <text :x="150 + (20 + bohrN1 * 22) + 5" y="140" font-size="10" :fill="bohrPhotonColor">foton</text>
                <defs>
                  <marker id="arrowPhoton" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" :fill="bohrPhotonColor" />
                  </marker>
                </defs>
              </svg>
            </div>

            <!-- Controls and results -->
            <div class="space-y-4">
              <div class="flex gap-4">
                <div>
                  <Label>n1 (nivel final, menor)</Label>
                  <div class="flex gap-1 mt-1">
                    <button
                      v-for="n in 5"
                      :key="n"
                      class="w-8 h-8 rounded text-sm transition-colors"
                      :class="bohrN1 === n ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
                      @click="bohrN1 = n; if (bohrN2 <= n) bohrN2 = n + 1"
                    >{{ n }}</button>
                  </div>
                </div>
                <div>
                  <Label>n2 (nivel inicial, mayor)</Label>
                  <div class="flex gap-1 mt-1">
                    <button
                      v-for="n in [2,3,4,5,6]"
                      :key="n"
                      class="w-8 h-8 rounded text-sm transition-colors"
                      :class="bohrN2 === n ? 'bg-primary text-primary-foreground' : n <= bohrN1 ? 'bg-muted/30 text-muted-foreground/30 cursor-not-allowed' : 'bg-muted hover:bg-muted/80'"
                      :disabled="n <= bohrN1"
                      @click="n > bohrN1 && (bohrN2 = n)"
                    >{{ n }}</button>
                  </div>
                </div>
              </div>

              <div v-if="bohrResult" class="space-y-3">
                <!-- Energy levels -->
                <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
                  <p class="font-semibold">Niveles de energia (E = -13.6/n squared eV):</p>
                  <p>E{{ bohrN2 }} = {{ bohrResult.E2.toFixed(4) }} eV</p>
                  <p>E{{ bohrN1 }} = {{ bohrResult.E1.toFixed(4) }} eV</p>
                  <p class="font-semibold text-primary">Delta E = {{ bohrResult.deltaE_eV.toFixed(4) }} eV = {{ sci(bohrResult.deltaE_J) }} J</p>
                </div>

                <!-- Photon properties -->
                <div class="p-3 bg-muted rounded-lg text-sm space-y-1">
                  <p class="font-semibold">Foton emitido:</p>
                  <p>lambda = {{ sci(bohrResult.lambda) }} m = {{ (bohrResult.lambda * 1e9).toFixed(2) }} nm</p>
                  <p>v = {{ sci(bohrResult.nu) }} Hz</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span>Color:</span>
                    <div class="w-8 h-4 rounded" :style="{ backgroundColor: bohrPhotonColor }" />
                    <Badge>{{ bohrResult.serie }}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Energy level diagram -->
      <Card>
        <CardHeader>
          <CardTitle>Diagrama de Niveles de Energia del Hidrogeno</CardTitle>
        </CardHeader>
        <CardContent>
          <svg viewBox="0 0 400 250" class="w-full max-w-lg mx-auto">
            <!-- Energy levels -->
            <template v-for="n in 6" :key="n">
              <line :x1="80" :y1="230 - (1 - 1/(n*n)) * 200" :x2="320" :y2="230 - (1 - 1/(n*n)) * 200" stroke="currentColor" :stroke-width="n === 1 ? 2 : 1" opacity="0.5" />
              <text x="50" :y="234 - (1 - 1/(n*n)) * 200" font-size="11" class="fill-current" text-anchor="middle">n={{ n }}</text>
              <text x="360" :y="234 - (1 - 1/(n*n)) * 200" font-size="9" class="fill-current" opacity="0.6">{{ (-13.6/(n*n)).toFixed(2) }} eV</text>
            </template>
            <!-- Current transition arrow -->
            <line
              :x1="200"
              :y1="230 - (1 - 1/(bohrN2*bohrN2)) * 200"
              :x2="200"
              :y2="230 - (1 - 1/(bohrN1*bohrN1)) * 200"
              :stroke="bohrPhotonColor"
              stroke-width="2.5"
              marker-end="url(#arrowDown)"
            />
            <defs>
              <marker id="arrowDown" markerWidth="8" markerHeight="6" refX="4" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" :fill="bohrPhotonColor" />
              </marker>
            </defs>
            <!-- Labels -->
            <text x="200" y="15" text-anchor="middle" font-size="10" class="fill-current" opacity="0.5">E = 0 (ionizacion)</text>
            <text x="200" y="248" text-anchor="middle" font-size="10" class="fill-current" opacity="0.5">E1 = -13.60 eV (estado fundamental)</text>
          </svg>
        </CardContent>
      </Card>

      <!-- Series table -->
      <Card>
        <CardHeader>
          <CardTitle>Series de Emision del Hidrogeno</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left p-2">Serie</th>
                  <th class="text-left p-2">nf</th>
                  <th class="text-left p-2">Region</th>
                  <th class="text-left p-2">Transiciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in seriesData" :key="s.name" class="border-b border-border/50 hover:bg-muted/50">
                  <td class="p-2 font-semibold">{{ s.name }}</td>
                  <td class="p-2">{{ s.nf }}</td>
                  <td class="p-2">
                    <Badge variant="secondary">{{ s.region }}</Badge>
                  </td>
                  <td class="p-2">
                    <div class="flex flex-wrap gap-1">
                      <button
                        v-for="ni in s.transitions"
                        :key="ni"
                        class="px-2 py-0.5 rounded text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        @click="bohrN1 = s.nf; bohrN2 = ni"
                      >
                        {{ ni }} -&gt; {{ s.nf }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Constants reference -->
      <Card>
        <CardHeader>
          <CardTitle>Constantes Utiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div class="p-2 bg-muted rounded">h = 6.626 x 10 a la -34 J*s (constante de Planck)</div>
            <div class="p-2 bg-muted rounded">c = 3.00 x 10 a la 8 m/s (velocidad de la luz)</div>
            <div class="p-2 bg-muted rounded">R = 1.097 x 10 a la 7 m-1 (constante de Rydberg)</div>
            <div class="p-2 bg-muted rounded">1 eV = 1.602 x 10 a la -19 J</div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 6: Pozo de Potencial               -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'pozo'" class="space-y-6">

      <!-- Ecuaciones de referencia -->
      <Card>
        <CardHeader>
          <CardTitle>Ecuaciones del Electron del Hidrogeno (Bohr)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div class="p-3 bg-muted rounded-lg">
                <p class="text-sm font-semibold mb-1">Energia potencial electrica</p>
                <p class="font-mono text-lg">Ep = -2Rh / n<sup>2</sup></p>
              </div>
              <div class="p-3 bg-muted rounded-lg">
                <p class="text-sm font-semibold mb-1">Energia cinetica</p>
                <p class="font-mono text-lg">Ek = Rh / n<sup>2</sup></p>
              </div>
              <div class="p-3 bg-muted rounded-lg">
                <p class="text-sm font-semibold mb-1">Hamiltoniano (energia total)</p>
                <p class="font-mono text-lg">H = -Rh / n<sup>2</sup></p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="p-3 bg-muted rounded-lg">
                <p class="text-sm font-semibold mb-1">Potencial electrico</p>
                <p class="font-mono text-lg">e = Ep / q = Ep / (-e)</p>
              </div>
              <div class="p-3 bg-muted rounded-lg">
                <p class="text-sm font-semibold mb-1">Distancia al nucleo</p>
                <p class="font-mono text-lg">r = a<sub>0</sub> . n<sup>2</sup></p>
              </div>
              <div class="p-3 bg-primary/10 rounded-lg border border-primary/30">
                <p class="text-sm font-semibold mb-1">Constantes</p>
                <p class="text-sm font-mono">Rh = 2.1799 x 10<sup>-18</sup> J</p>
                <p class="text-sm font-mono">a<sub>0</sub> = 5.2918 x 10<sup>-11</sup> m</p>
                <p class="text-sm font-mono">e = 1.6022 x 10<sup>-19</sup> C</p>
                <p class="text-sm font-mono">1 eV = 1.6022 x 10<sup>-19</sup> J</p>
              </div>
            </div>
          </div>
          <div class="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p class="text-sm"><strong>Relaciones clave:</strong> Ep = -2Ek | H = -Ek | |Ep(eV)| = |e(V)| (signo opuesto) | DH = 1/2 DEp (transiciones)</p>
          </div>
        </CardContent>
      </Card>

      <!-- Calculadora por nivel n -->
      <Card>
        <CardHeader>
          <CardTitle>Calculadora: Valores para nivel n</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <Label class="text-sm font-semibold whitespace-nowrap">n =</Label>
            <input
              type="range" min="1" max="50" v-model.number="pozoN"
              class="flex-1 accent-primary"
            />
            <Input v-model.number="pozoN" type="number" min="1" class="max-w-20" />
          </div>

          <div v-if="pozoCalc" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="p-3 bg-red-500/10 rounded-lg space-y-1">
              <p class="text-sm font-semibold text-red-700 dark:text-red-400">Energia Potencial (Ep)</p>
              <p class="font-mono text-sm">{{ sci(pozoCalc.Ep_J) }} J</p>
              <p class="font-mono text-sm">{{ pozoCalc.Ep_eV.toFixed(4) }} eV</p>
            </div>
            <div class="p-3 bg-green-500/10 rounded-lg space-y-1">
              <p class="text-sm font-semibold text-green-700 dark:text-green-400">Energia Cinetica (Ek)</p>
              <p class="font-mono text-sm">{{ sci(pozoCalc.Ek_J) }} J</p>
              <p class="font-mono text-sm">{{ pozoCalc.Ek_eV.toFixed(4) }} eV</p>
            </div>
            <div class="p-3 bg-blue-500/10 rounded-lg space-y-1">
              <p class="text-sm font-semibold text-blue-700 dark:text-blue-400">Hamiltoniano (H)</p>
              <p class="font-mono text-sm">{{ sci(pozoCalc.H_J) }} J</p>
              <p class="font-mono text-sm">{{ pozoCalc.H_eV.toFixed(4) }} eV</p>
            </div>
            <div class="p-3 bg-purple-500/10 rounded-lg space-y-1">
              <p class="text-sm font-semibold text-purple-700 dark:text-purple-400">Potencial Electrico (e)</p>
              <p class="font-mono text-sm">{{ pozoCalc.epsilon.toFixed(4) }} V</p>
              <p class="text-xs text-muted-foreground">|e(V)| = |Ep(eV)| = {{ Math.abs(pozoCalc.Ep_eV).toFixed(4) }}</p>
            </div>
            <div class="p-3 bg-orange-500/10 rounded-lg space-y-1 md:col-span-2">
              <p class="text-sm font-semibold text-orange-700 dark:text-orange-400">Distancia al nucleo (r)</p>
              <p class="font-mono text-sm">{{ sci(pozoCalc.r_m) }} m = {{ pozoCalc.r_A.toFixed(4) }} A</p>
            </div>
          </div>

          <!-- Pozo de potencial SVG -->
          <div class="mt-4">
            <p class="text-sm font-semibold mb-2">Pozo de Potencial (posicion del electron en n={{ pozoN }})</p>
            <svg viewBox="0 0 400 200" class="w-full max-w-lg mx-auto">
              <!-- Eje Y -->
              <line x1="50" y1="10" x2="50" y2="190" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <text x="10" y="105" font-size="9" class="fill-current" opacity="0.5" transform="rotate(-90 10 105)">Energia (H)</text>
              <!-- Eje X (E=0) -->
              <line x1="50" y1="30" x2="380" y2="30" stroke="currentColor" stroke-width="1" opacity="0.3" stroke-dasharray="4 2" />
              <text x="385" y="33" font-size="8" class="fill-current" opacity="0.4">E=0</text>
              <!-- Curva del pozo -->
              <path
                d="M 50,30 Q 50,30 80,30 Q 150,30 180,170 Q 200,180 220,170 Q 250,30 320,30 Q 350,30 380,30"
                fill="none" stroke="#3B82F6" stroke-width="2" opacity="0.6"
              />
              <!-- Hamiltoniano curve (inner) -->
              <path
                d="M 50,30 Q 50,30 90,30 Q 155,30 185,120 Q 200,130 215,120 Q 245,30 310,30 Q 350,30 380,30"
                fill="none" stroke="#EF4444" stroke-width="2" opacity="0.6"
              />
              <!-- Nivel del electron actual -->
              <line
                :x1="120" :y1="30 + (1 - 1/(pozoN*pozoN)) * 0 + 30/(pozoN < 5 ? pozoN*pozoN : 25) * 140"
                :x2="280" :y2="30 + (1 - 1/(pozoN*pozoN)) * 0 + 30/(pozoN < 5 ? pozoN*pozoN : 25) * 140"
                stroke="#10B981" stroke-width="2" stroke-dasharray="6 3"
              />
              <circle
                :cx="200"
                :cy="30 + 30/(pozoN < 5 ? pozoN*pozoN : 25) * 140"
                r="5" fill="#10B981"
              />
              <text
                :x="290"
                :y="27 + 30/(pozoN < 5 ? pozoN*pozoN : 25) * 140"
                font-size="10" fill="#10B981" font-weight="bold"
              >n={{ pozoN }}</text>
              <!-- Labels -->
              <text x="55" y="190" font-size="9" class="fill-current" opacity="0.5">n=1 (fondo)</text>
              <text x="300" y="190" font-size="8" class="fill-current" opacity="0.4">n->inf (salida)</text>
              <text x="60" y="25" font-size="8" fill="#3B82F6">Ep</text>
              <text x="75" y="25" font-size="8" fill="#EF4444">H</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      <!-- Modo inverso -->
      <Card>
        <CardHeader>
          <CardTitle>Calculadora Inversa: Hallar n</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Dado un valor de H, e, Ep o r, calcular en que nivel n se encuentra el electron.</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in [
                { id: 'hamiltoniano_J', label: 'H (J)' },
                { id: 'hamiltoniano_eV', label: 'H (eV)' },
                { id: 'potencial_V', label: 'e (V)' },
                { id: 'Ep_J', label: 'Ep (J)' },
                { id: 'distancia_A', label: 'r (A)' },
              ]"
              :key="opt.id"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors"
              :class="pozoInverseMode === opt.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'"
              @click="pozoInverseMode = opt.id"
            >{{ opt.label }}</button>
          </div>
          <div class="flex items-center gap-3">
            <Label class="whitespace-nowrap">Valor:</Label>
            <Input v-model="pozoInverseInput" :placeholder="
              pozoInverseMode === 'hamiltoniano_J' ? '-4.4488e-20' :
              pozoInverseMode === 'hamiltoniano_eV' ? '-0.27767' :
              pozoInverseMode === 'potencial_V' ? '0.068028' :
              pozoInverseMode === 'Ep_J' ? '-1.09e-20' :
              '25.93'
            " />
          </div>
          <div v-if="pozoInverseResult">
            <div v-if="pozoInverseResult.error" class="p-3 bg-red-500/10 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {{ pozoInverseResult.error }}
            </div>
            <div v-else class="p-3 bg-muted rounded-lg space-y-1">
              <p class="text-sm">n (exacto) = <strong class="font-mono">{{ pozoInverseResult.n_exact.toFixed(4) }}</strong></p>
              <p class="text-sm" :class="pozoInverseResult.isInteger ? 'text-green-600 font-semibold' : 'text-yellow-600'">
                {{ pozoInverseResult.isInteger
                  ? `n = ${pozoInverseResult.n_round} (nivel cuantico valido)`
                  : `n no es entero — no corresponde a un nivel cuantico exacto` }}
              </p>
              <p v-if="pozoInverseResult.isInteger" class="text-sm mt-2">
                <button class="text-primary hover:underline" @click="pozoN = pozoInverseResult.n_round">
                  → Ver todos los valores para n={{ pozoInverseResult.n_round }}
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Transiciones -->
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Transiciones Electronicas</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Calcula DEp, DH, DEk, De y Dr cuando el electron cambia de nivel.</p>
          <div class="flex gap-6 items-end">
            <div>
              <Label>n inicial (n<sub>0</sub>)</Label>
              <Input v-model.number="transN0" type="number" min="1" class="max-w-20" />
            </div>
            <div class="text-2xl text-muted-foreground pb-1">→</div>
            <div>
              <Label>n final (n<sub>f</sub>)</Label>
              <Input v-model.number="transNf" type="number" min="1" class="max-w-20" />
            </div>
          </div>

          <div v-if="transResult" class="space-y-3">
            <div class="p-3 rounded-lg text-sm" :class="transResult.isEmission ? 'bg-red-500/10' : 'bg-green-500/10'">
              <p class="font-semibold" :class="transResult.isEmission ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">
                {{ transResult.isEmission ? 'EMISION — el electron pierde energia (decae)' : 'ABSORCION — el electron gana energia (asciende)' }}
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="p-3 bg-muted rounded-lg space-y-1">
                <p class="text-sm font-semibold">Cambio de Ep</p>
                <p class="font-mono text-sm">DEp = {{ sci(transResult.dEp) }} J</p>
                <p class="font-mono text-sm">DEp = {{ transResult.dEp_eV.toFixed(4) }} eV</p>
              </div>
              <div class="p-3 bg-muted rounded-lg space-y-1">
                <p class="text-sm font-semibold">Cambio del Hamiltoniano</p>
                <p class="font-mono text-sm">DH = {{ sci(transResult.dH) }} J</p>
                <p class="font-mono text-sm">DH = {{ transResult.dH_eV.toFixed(4) }} eV</p>
                <p class="text-xs text-muted-foreground">DH = 1/2 DEp ✓</p>
              </div>
              <div class="p-3 bg-muted rounded-lg space-y-1">
                <p class="text-sm font-semibold">Cambio de Ek</p>
                <p class="font-mono text-sm">DEk = {{ sci(transResult.dEk) }} J</p>
                <p class="font-mono text-sm">DEk = {{ transResult.dEk_eV.toFixed(4) }} eV</p>
                <p class="text-xs text-muted-foreground">DEk = -DH</p>
              </div>
              <div class="p-3 bg-muted rounded-lg space-y-1">
                <p class="text-sm font-semibold">Cambio de potencial electrico</p>
                <p class="font-mono text-sm">De = {{ transResult.d_epsilon.toFixed(4) }} V</p>
              </div>
              <div class="p-3 bg-muted rounded-lg space-y-1 md:col-span-2">
                <p class="text-sm font-semibold">Cambio de posicion</p>
                <p class="font-mono text-sm">r<sub>0</sub> = {{ sci(transResult.r0) }} m | r<sub>f</sub> = {{ sci(transResult.rf) }} m</p>
                <p class="font-mono text-sm">Dr = {{ sci(transResult.dr) }} m</p>
              </div>
            </div>

            <!-- Reparto de energía -->
            <div v-if="transResult.isEmission" class="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p class="text-sm font-semibold mb-1">Reparto de energia al decaer:</p>
              <p class="text-sm">1. Pierde {{ Math.abs(transResult.dEp_eV).toFixed(4) }} eV de Ep</p>
              <p class="text-sm">2. Gana {{ transResult.dEk_eV.toFixed(4) }} eV como Ek (se queda en el pozo)</p>
              <p class="text-sm">3. Radia {{ Math.abs(transResult.dH_eV).toFixed(4) }} eV como foton = |DH|</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Ionización -->
      <Card>
        <CardHeader>
          <CardTitle>Energia de Ionizacion</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">Transicion n=1 → n=∞ (el electron sale del pozo). Para hidrogenoides: E = Rh . Z<sup>2</sup></p>
          <div class="flex items-center gap-3">
            <Label>Z (carga nuclear):</Label>
            <Input v-model.number="ionZ" type="number" min="1" max="30" class="max-w-20" />
            <span class="text-sm text-muted-foreground">
              {{ ionZ === 1 ? 'H' : ionZ === 2 ? 'He⁺¹' : ionZ === 3 ? 'Li⁺²' : `Z=${ionZ} (hidrogenoide)` }}
            </span>
          </div>
          <div v-if="ionResult" class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3 bg-muted rounded-lg">
              <p class="text-sm font-semibold">E ionizacion</p>
              <p class="font-mono text-sm">{{ sci(ionResult.E_ion_J) }} J</p>
              <p class="font-mono text-sm font-bold">{{ ionResult.E_ion_eV.toFixed(4) }} eV</p>
            </div>
            <div class="p-3 bg-muted rounded-lg">
              <p class="text-sm font-semibold">Potencial de ionizacion</p>
              <p class="font-mono text-sm">{{ ionResult.V_ion.toFixed(4) }} V</p>
            </div>
            <div class="p-3 bg-muted rounded-lg">
              <p class="text-sm font-semibold">Nota</p>
              <p class="text-xs text-muted-foreground">En la transicion, toda la Ek se convierte en Ep. El electron es forzado a zona de potencial mas bajo.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Tabla completa -->
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Valores (como en el PDF)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-xs font-mono">
              <thead>
                <tr class="border-b">
                  <th class="p-2 text-left">n</th>
                  <th class="p-2 text-left">H / J</th>
                  <th class="p-2 text-left">Ep / J</th>
                  <th class="p-2 text-left">Ek / J</th>
                  <th class="p-2 text-left">H / eV</th>
                  <th class="p-2 text-left">e / V</th>
                  <th class="p-2 text-left">Ek / eV</th>
                  <th class="p-2 text-left">r / m</th>
                  <th class="p-2 text-left">r / A</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in pozoTable"
                  :key="row.n"
                  class="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
                  @click="pozoN = row.n"
                >
                  <td class="p-2 font-bold">{{ row.n }}</td>
                  <td class="p-2">{{ sci(row.H_J, 4) }}</td>
                  <td class="p-2">{{ sci(row.Ep_J, 4) }}</td>
                  <td class="p-2">{{ sci(row.Ek_J, 4) }}</td>
                  <td class="p-2">{{ row.H_eV.toFixed(4) }}</td>
                  <td class="p-2">{{ row.epsilon.toFixed(4) }}</td>
                  <td class="p-2">{{ row.Ek_eV.toFixed(4) }}</td>
                  <td class="p-2">{{ sci(row.r_m, 4) }}</td>
                  <td class="p-2">{{ row.r_A.toFixed(4) }}</td>
                </tr>
                <tr class="border-t-2 text-muted-foreground">
                  <td class="p-2 font-bold">∞</td>
                  <td class="p-2">0</td>
                  <td class="p-2">0</td>
                  <td class="p-2">0</td>
                  <td class="p-2">0</td>
                  <td class="p-2">0</td>
                  <td class="p-2">0</td>
                  <td class="p-2">∞</td>
                  <td class="p-2">∞</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="text-xs text-muted-foreground mt-2">Click en una fila para ver sus valores arriba. Las energias son negativas dentro del pozo; en n=∞ todas son 0.</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

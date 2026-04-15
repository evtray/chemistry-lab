<script setup>
import { ref, computed, reactive } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Waves, Calculator, Zap, BookOpen, ArrowRight, ArrowDown, ArrowUp, Check, X, Sun, Radio, Lightbulb, Eye } from 'lucide-vue-next'

function sci(num, digits = 3) {
  return num.toExponential(digits)
}

const h = 6.626e-34   // J·s
const c = 3e8          // m/s
const eVtoJ = 1.602e-19 // J per eV

const activeSection = ref('espectro')
const sections = [
  { id: 'espectro', label: 'Espectro EM', icon: Waves },
  { id: 'calculadora', label: 'Calculadora', icon: Calculator },
  { id: 'fotoelectrico', label: 'Efecto Fotoeléctrico', icon: Zap },
  { id: 'conceptos', label: 'Conceptos Clave', icon: BookOpen },
]

// ═══════════════════════════════════════════════
// SECTION 1: Espectro Electromagnético
// ═══════════════════════════════════════════════
const selectedRegion = ref(null)

const regiones = [
  {
    id: 'radio',
    nombre: 'Ondas de Radio',
    abrev: 'Radio',
    lambdaMin: 1e-1,
    lambdaMax: 1e4,
    freqMin: 3e4,
    freqMax: 3e9,
    energiaMin: 1.99e-29,
    energiaMax: 1.99e-24,
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 to-blue-600/20',
    borderColor: 'border-blue-500',
    ejemplos: ['Transmisiones AM/FM', 'Televisión', 'Comunicaciones de largo alcance'],
    descripcion: 'Las ondas de radio tienen las longitudes de onda más largas y las frecuencias más bajas del espectro EM. Se usan ampliamente en telecomunicaciones.',
  },
  {
    id: 'microondas',
    nombre: 'Microondas',
    abrev: 'Microondas',
    lambdaMin: 1e-3,
    lambdaMax: 1e-1,
    freqMin: 3e9,
    freqMax: 3e11,
    energiaMin: 1.99e-24,
    energiaMax: 1.99e-22,
    color: '#8B5CF6',
    bgGradient: 'from-violet-500/20 to-violet-600/20',
    borderColor: 'border-violet-500',
    ejemplos: ['Hornos de microondas', 'Radar', 'Comunicaciones satelitales', 'Wi-Fi'],
    descripcion: 'Las microondas calientan moléculas de agua en los alimentos. También se usan en radar y comunicaciones inalámbricas.',
  },
  {
    id: 'infrarrojo',
    nombre: 'Infrarrojo',
    abrev: 'IR',
    lambdaMin: 7e-7,
    lambdaMax: 1e-3,
    freqMin: 3e11,
    freqMax: 4.3e14,
    energiaMin: 1.99e-22,
    energiaMax: 2.84e-19,
    color: '#EF4444',
    bgGradient: 'from-red-500/20 to-red-600/20',
    borderColor: 'border-red-500',
    ejemplos: ['Control remoto', 'Cámaras térmicas', 'Calefacción', 'Visión nocturna'],
    descripcion: 'La radiación infrarroja es emitida por objetos calientes. No es visible al ojo humano pero se percibe como calor.',
  },
  {
    id: 'visible',
    nombre: 'Luz Visible',
    abrev: 'Visible',
    lambdaMin: 4e-7,
    lambdaMax: 7e-7,
    freqMin: 4.3e14,
    freqMax: 7.5e14,
    energiaMin: 2.84e-19,
    energiaMax: 4.97e-19,
    color: 'linear-gradient(90deg, #8B00FF, #0000FF, #00FF00, #FFFF00, #FF7F00, #FF0000)',
    isGradient: true,
    bgGradient: 'from-yellow-500/20 to-green-500/20',
    borderColor: 'border-yellow-500',
    ejemplos: ['Visión humana', 'Fotosíntesis', 'Fibra óptica', 'Iluminación'],
    descripcion: 'La única porción del espectro visible al ojo humano. Va del violeta (~400 nm) al rojo (~700 nm). El sol emite la mayor parte de su radiación en esta región.',
  },
  {
    id: 'uv',
    nombre: 'Ultravioleta',
    abrev: 'UV',
    lambdaMin: 1e-8,
    lambdaMax: 4e-7,
    freqMin: 7.5e14,
    freqMax: 3e16,
    energiaMin: 4.97e-19,
    energiaMax: 1.99e-17,
    color: '#A855F7',
    bgGradient: 'from-purple-500/20 to-purple-600/20',
    borderColor: 'border-purple-500',
    ejemplos: ['Bronceado / quemaduras solares', 'Esterilización', 'Lámparas UV', 'Fluorescencia'],
    descripcion: 'La radiación UV tiene suficiente energía para causar reacciones químicas en la piel. La capa de ozono bloquea gran parte de la UV solar.',
  },
  {
    id: 'rayosx',
    nombre: 'Rayos X',
    abrev: 'Rayos X',
    lambdaMin: 1e-11,
    lambdaMax: 1e-8,
    freqMin: 3e16,
    freqMax: 3e19,
    energiaMin: 1.99e-17,
    energiaMax: 1.99e-14,
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 to-cyan-600/20',
    borderColor: 'border-cyan-500',
    ejemplos: ['Radiografías médicas', 'Tomografía CT', 'Cristalografía', 'Seguridad en aeropuertos'],
    descripcion: 'Los rayos X pueden penetrar tejidos blandos pero son absorbidos por huesos y metales. Se usan ampliamente en medicina diagnóstica.',
  },
  {
    id: 'gamma',
    nombre: 'Rayos Gamma',
    abrev: 'Gamma (γ)',
    lambdaMin: 1e-16,
    lambdaMax: 1e-11,
    freqMin: 3e19,
    freqMax: 3e24,
    energiaMin: 1.99e-14,
    energiaMax: 1.99e-9,
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 to-emerald-600/20',
    borderColor: 'border-emerald-500',
    ejemplos: ['Radioterapia contra el cáncer', 'Descomposición nuclear', 'Astronomía de rayos gamma', 'Esterilización industrial'],
    descripcion: 'Los rayos gamma tienen la mayor energía y frecuencia del espectro. Se originan en procesos nucleares y son extremadamente penetrantes.',
  },
]

function selectRegion(region) {
  selectedRegion.value = selectedRegion.value?.id === region.id ? null : region
}

function formatLambda(val) {
  if (val >= 1) return `${val} m`
  if (val >= 1e-3) return `${val * 1e3} mm`
  if (val >= 1e-6) return `${val * 1e6} μm`
  if (val >= 1e-9) return `${val * 1e9} nm`
  if (val >= 1e-12) return `${val * 1e12} pm`
  return sci(val) + ' m'
}

// ═══════════════════════════════════════════════
// SECTION 2: Calculadora λ ↔ ν ↔ E
// ═══════════════════════════════════════════════
const calcMode = ref('lambda')
const calcInput = ref('')

const calcResults = computed(() => {
  const val = parseFloat(calcInput.value)
  if (!val || val <= 0) return null

  let lambda, freq, energy

  if (calcMode.value === 'lambda') {
    lambda = val * 1e-9
    freq = c / lambda
    energy = h * freq
  } else if (calcMode.value === 'freq') {
    freq = val
    lambda = c / freq
    energy = h * freq
  } else {
    energy = val
    freq = energy / h
    lambda = c / freq
  }

  const energyEv = energy / eVtoJ
  const lambdaNm = lambda * 1e9

  let region = 'Fuera del espectro conocido'
  let regionColor = '#666'
  for (const r of regiones) {
    if (lambda >= r.lambdaMin && lambda <= r.lambdaMax) {
      region = r.nombre
      regionColor = r.isGradient ? '#FBBF24' : r.color
      break
    }
  }

  let visibleColor = null
  if (lambdaNm >= 380 && lambdaNm <= 750) {
    visibleColor = wavelengthToColor(lambdaNm)
  }

  return {
    lambda,
    lambdaNm,
    freq,
    energy,
    energyEv,
    region,
    regionColor,
    visibleColor,
  }
})

function wavelengthToColor(nm) {
  let r = 0, g = 0, b = 0
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / (440 - 380)
    g = 0
    b = 1
  } else if (nm >= 440 && nm < 490) {
    r = 0
    g = (nm - 440) / (490 - 440)
    b = 1
  } else if (nm >= 490 && nm < 510) {
    r = 0
    g = 1
    b = -(nm - 510) / (510 - 490)
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / (580 - 510)
    g = 1
    b = 0
  } else if (nm >= 580 && nm < 645) {
    r = 1
    g = -(nm - 645) / (645 - 580)
    b = 0
  } else if (nm >= 645 && nm <= 750) {
    r = 1
    g = 0
    b = 0
  }
  let factor = 1
  if (nm >= 380 && nm < 420) factor = 0.3 + 0.7 * (nm - 380) / (420 - 380)
  else if (nm > 700 && nm <= 750) factor = 0.3 + 0.7 * (750 - nm) / (750 - 700)

  r = Math.round(255 * Math.pow(r * factor, 0.8))
  g = Math.round(255 * Math.pow(g * factor, 0.8))
  b = Math.round(255 * Math.pow(b * factor, 0.8))
  return `rgb(${r}, ${g}, ${b})`
}

const calcModes = [
  { id: 'lambda', label: 'Longitud de onda (nm)', placeholder: 'Ej: 550' },
  { id: 'freq', label: 'Frecuencia (Hz)', placeholder: 'Ej: 5.45e14' },
  { id: 'energy', label: 'Energía (J)', placeholder: 'Ej: 3.61e-19' },
]

function setCalcMode(mode) {
  calcMode.value = mode
  calcInput.value = ''
}

// ═══════════════════════════════════════════════
// SECTION 3: Efecto Fotoeléctrico
// ═══════════════════════════════════════════════
const fotoelectrico = reactive({
  frecuencia: '',
  workFunction: '',
})

const fotoResults = computed(() => {
  const nu = parseFloat(fotoelectrico.frecuencia)
  const phi_eV = parseFloat(fotoelectrico.workFunction)
  if (!nu || nu <= 0 || !phi_eV || phi_eV <= 0) return null

  const phi_J = phi_eV * eVtoJ
  const E_foton = h * nu
  const E_foton_eV = E_foton / eVtoJ
  const nu_0 = phi_J / h
  const ejected = E_foton >= phi_J
  const KE = ejected ? E_foton - phi_J : 0
  const KE_eV = KE / eVtoJ

  return {
    E_foton,
    E_foton_eV,
    nu_0,
    ejected,
    KE,
    KE_eV,
    phi_J,
    excessRatio: ejected ? ((E_foton / phi_J) * 100).toFixed(1) : 0,
  }
})

const fotoMetales = [
  { nombre: 'Cesio (Cs)', phi: 2.1 },
  { nombre: 'Potasio (K)', phi: 2.3 },
  { nombre: 'Sodio (Na)', phi: 2.75 },
  { nombre: 'Calcio (Ca)', phi: 2.87 },
  { nombre: 'Zinc (Zn)', phi: 3.63 },
  { nombre: 'Plata (Ag)', phi: 4.26 },
  { nombre: 'Cobre (Cu)', phi: 4.65 },
  { nombre: 'Platino (Pt)', phi: 5.65 },
]

function selectMetal(metal) {
  fotoelectrico.workFunction = metal.phi.toString()
}

const fotoConceptos = [
  {
    titulo: 'Fotón',
    desc: 'Paquete discreto (cuanto) de energía electromagnética. Su energía depende solo de la frecuencia: E = hν.',
    icono: '💡',
  },
  {
    titulo: 'Frecuencia Umbral (ν₀)',
    desc: 'Frecuencia mínima que debe tener la luz para arrancar un electrón del metal. ν₀ = φ/h.',
    icono: '⚡',
  },
  {
    titulo: 'Función de Trabajo (φ)',
    desc: 'Energía mínima necesaria para extraer un electrón de la superficie del metal. Es característica de cada material.',
    icono: '🔧',
  },
  {
    titulo: 'Energía Cinética (KE)',
    desc: 'Energía del electrón emitido. Es el exceso de energía después de superar la función de trabajo: KE = hν - φ.',
    icono: '🏃',
  },
]

// ═══════════════════════════════════════════════
// SECTION 4: Conceptos Clave
// ═══════════════════════════════════════════════
const conceptosExpandido = ref(null)

const conceptosClave = [
  {
    id: 'dualidad',
    titulo: 'Dualidad Onda-Partícula',
    subtitulo: 'Naturaleza de la luz',
    color: '#3B82F6',
    contenido: 'La luz se comporta tanto como onda (difracción, interferencia) como partícula (efecto fotoeléctrico, efecto Compton). Louis de Broglie extendió esta dualidad a toda la materia: λ = h/p.',
    puntos: [
      'Ondas: interferencia, difracción, polarización',
      'Partículas: efecto fotoeléctrico, efecto Compton',
      'De Broglie: λ = h/(mv) para cualquier partícula con masa',
      'Principio de complementariedad de Bohr',
    ],
  },
  {
    id: 'planck',
    titulo: 'Cuantización de Planck',
    subtitulo: 'E = nhν',
    color: '#A855F7',
    contenido: 'Max Planck (1900) propuso que la energía se emite y absorbe en paquetes discretos llamados cuantos. Esto resolvió el problema de la catástrofe ultravioleta en la radiación del cuerpo negro.',
    puntos: [
      'La energía está cuantizada: E = nhν (n = 1, 2, 3...)',
      'h = 6.626 × 10⁻³⁴ J·s (constante de Planck)',
      'Resuelve la catástrofe ultravioleta',
      'Base de toda la mecánica cuántica moderna',
    ],
  },
  {
    id: 'velocidad',
    titulo: 'Velocidad de la Luz',
    subtitulo: 'c = 3 × 10⁸ m/s',
    color: '#F59E0B',
    contenido: 'La velocidad de la luz en el vacío es una constante fundamental del universo. Es la velocidad máxima a la que puede viajar la información o la energía. Conecta longitud de onda y frecuencia.',
    puntos: [
      'c = 299,792,458 m/s ≈ 3 × 10⁸ m/s',
      'Relación: c = λν',
      'Independiente de la fuente u observador (Einstein)',
      'Velocidad máxima en el universo (relatividad especial)',
    ],
  },
  {
    id: 'einstein',
    titulo: 'Efecto Fotoeléctrico (Einstein)',
    subtitulo: 'Nobel 1921',
    color: '#EF4444',
    contenido: 'Einstein explicó el efecto fotoeléctrico proponiendo que la luz está formada por fotones con energía E = hν. Un fotón interactúa con un solo electrón, transfiriéndole toda su energía.',
    puntos: [
      'E_fotón = hν (energía del fotón)',
      'KE_max = hν - φ (energía cinética máxima)',
      'Existe una frecuencia umbral ν₀ = φ/h',
      'La intensidad afecta el número de electrones, no su energía',
    ],
  },
]

const formulas = [
  { formula: 'c = λν', desc: 'Velocidad de la luz = longitud de onda × frecuencia', vars: 'c = 3×10⁸ m/s' },
  { formula: 'E = hν', desc: 'Energía del fotón = constante de Planck × frecuencia', vars: 'h = 6.626×10⁻³⁴ J·s' },
  { formula: 'E = hc/λ', desc: 'Energía del fotón en términos de longitud de onda', vars: 'Combinación de las anteriores' },
  { formula: 'KE = hν - φ', desc: 'Energía cinética del electrón emitido (efecto fotoeléctrico)', vars: 'φ = función de trabajo' },
  { formula: 'ν₀ = φ/h', desc: 'Frecuencia umbral para el efecto fotoeléctrico', vars: 'Frecuencia mínima para emitir e⁻' },
  { formula: 'λ = h/(mv)', desc: 'Longitud de onda de De Broglie', vars: 'Dualidad onda-partícula de la materia' },
  { formula: '1 eV = 1.602×10⁻¹⁹ J', desc: 'Conversión electrón-voltio a Joules', vars: 'Unidad de energía común en física atómica' },
]

function toggleConcepto(id) {
  conceptosExpandido.value = conceptosExpandido.value === id ? null : id
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 via-green-500 to-violet-500 bg-clip-text text-transparent">
        Radiación Electromagnética
      </h1>
      <p class="text-muted-foreground text-sm max-w-2xl mx-auto">
        Estudio del espectro electromagnético, relación entre longitud de onda, frecuencia y energía, y el efecto fotoeléctrico.
      </p>
    </div>

    <!-- Tab Navigation -->
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
        <component :is="sec.icon" class="w-4 h-4" />
        {{ sec.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 1: Espectro EM                     -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'espectro'" class="space-y-6">
      <!-- Relationship arrows -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div class="space-y-1">
              <div class="text-2xl font-bold text-blue-500">λ ↑</div>
              <div class="text-xs text-muted-foreground">Longitud de onda</div>
            </div>
            <ArrowRight class="w-6 h-6 text-muted-foreground hidden sm:block" />
            <ArrowDown class="w-6 h-6 text-muted-foreground sm:hidden" />
            <div class="space-y-1">
              <div class="text-2xl font-bold text-purple-500">ν ↓</div>
              <div class="text-xs text-muted-foreground">Frecuencia</div>
            </div>
            <ArrowRight class="w-6 h-6 text-muted-foreground hidden sm:block" />
            <ArrowDown class="w-6 h-6 text-muted-foreground sm:hidden" />
            <div class="space-y-1">
              <div class="text-2xl font-bold text-red-500">E ↓</div>
              <div class="text-xs text-muted-foreground">Energía</div>
            </div>
          </div>
          <p class="text-center text-xs text-muted-foreground mt-3">
            A mayor longitud de onda, menor frecuencia y menor energía. Relación inversa: c = λν, E = hν
          </p>
        </CardContent>
      </Card>

      <!-- Spectrum Bar -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Espectro Electromagnético</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-xs text-muted-foreground mb-2 flex justify-between">
            <span>← Mayor λ, Menor E</span>
            <span>Menor λ, Mayor E →</span>
          </div>
          <div class="flex rounded-xl overflow-hidden border shadow-inner">
            <button
              v-for="region in regiones"
              :key="region.id"
              class="flex-1 py-6 px-1 text-center transition-all duration-300 hover:flex-[2] cursor-pointer relative group"
              :class="selectedRegion?.id === region.id ? 'flex-[3] ring-2 ring-white/50' : ''"
              :style="{
                background: region.isGradient ? region.color : region.color,
                minWidth: '0',
              }"
              @click="selectRegion(region)"
            >
              <div class="text-white font-semibold text-xs sm:text-sm drop-shadow-md truncate">
                {{ region.abrev }}
              </div>
              <div class="text-white/70 text-[10px] mt-1 hidden group-hover:block">
                {{ formatLambda(region.lambdaMin) }} - {{ formatLambda(region.lambdaMax) }}
              </div>
            </button>
          </div>
          <p class="text-xs text-muted-foreground text-center mt-2">
            Haz clic en una región para ver detalles
          </p>
        </CardContent>
      </Card>

      <!-- Selected Region Detail -->
      <Card v-if="selectedRegion" class="border-2" :class="selectedRegion.borderColor">
        <CardHeader>
          <CardTitle class="flex items-center gap-3">
            <div class="w-5 h-5 rounded-full shadow-lg" :style="{ background: selectedRegion.isGradient ? selectedRegion.color : selectedRegion.color }"></div>
            {{ selectedRegion.nombre }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">{{ selectedRegion.descripcion }}</p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-muted/50 rounded-lg p-3 space-y-1">
              <div class="text-xs text-muted-foreground font-medium">Longitud de Onda (λ)</div>
              <div class="text-sm font-mono font-semibold">
                {{ formatLambda(selectedRegion.lambdaMin) }} — {{ formatLambda(selectedRegion.lambdaMax) }}
              </div>
            </div>
            <div class="bg-muted/50 rounded-lg p-3 space-y-1">
              <div class="text-xs text-muted-foreground font-medium">Frecuencia (ν)</div>
              <div class="text-sm font-mono font-semibold">
                {{ sci(selectedRegion.freqMin, 2) }} — {{ sci(selectedRegion.freqMax, 2) }} Hz
              </div>
            </div>
            <div class="bg-muted/50 rounded-lg p-3 space-y-1">
              <div class="text-xs text-muted-foreground font-medium">Energía (E)</div>
              <div class="text-sm font-mono font-semibold">
                {{ sci(selectedRegion.energiaMin, 2) }} — {{ sci(selectedRegion.energiaMax, 2) }} J
              </div>
            </div>
          </div>

          <div>
            <div class="text-sm font-medium mb-2">Ejemplos en la vida real:</div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="ej in selectedRegion.ejemplos" :key="ej" variant="secondary">
                {{ ej }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Visible Light Detail -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Eye class="w-5 h-5" />
            Detalle: Luz Visible (380 - 750 nm)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="h-10 rounded-lg mb-3" style="background: linear-gradient(90deg, #8B00FF, #4B0082, #0000FF, #00FF00, #FFFF00, #FF7F00, #FF0000);"></div>
          <div class="grid grid-cols-7 gap-1 text-center text-xs">
            <div>
              <div class="w-full h-3 rounded" style="background: #8B00FF;"></div>
              <div class="mt-1">Violeta</div>
              <div class="text-muted-foreground">380-450</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #4B0082;"></div>
              <div class="mt-1">Índigo</div>
              <div class="text-muted-foreground">450-475</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #0000FF;"></div>
              <div class="mt-1">Azul</div>
              <div class="text-muted-foreground">475-495</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #00FF00;"></div>
              <div class="mt-1">Verde</div>
              <div class="text-muted-foreground">495-570</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #FFFF00;"></div>
              <div class="mt-1">Amarillo</div>
              <div class="text-muted-foreground">570-590</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #FF7F00;"></div>
              <div class="mt-1">Naranja</div>
              <div class="text-muted-foreground">590-620</div>
            </div>
            <div>
              <div class="w-full h-3 rounded" style="background: #FF0000;"></div>
              <div class="mt-1">Rojo</div>
              <div class="text-muted-foreground">620-750</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 2: Calculadora                     -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'calculadora'" class="space-y-6">
      <!-- Formulas Reference -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-wrap justify-center gap-6 text-center">
            <div class="space-y-1">
              <div class="text-xl font-mono font-bold text-blue-500">c = λν</div>
              <div class="text-xs text-muted-foreground">Velocidad de la luz</div>
            </div>
            <div class="space-y-1">
              <div class="text-xl font-mono font-bold text-purple-500">E = hν</div>
              <div class="text-xs text-muted-foreground">Energía del fotón</div>
            </div>
            <div class="space-y-1">
              <div class="text-xl font-mono font-bold text-red-500">E = hc/λ</div>
              <div class="text-xs text-muted-foreground">Energía por longitud de onda</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Calculator Input -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Calculator class="w-5 h-5" />
            Calculadora λ ↔ ν ↔ E
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="text-sm text-muted-foreground">
            Ingresa un valor y se calcularán los otros dos automáticamente.
          </div>

          <!-- Mode Selection -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="mode in calcModes"
              :key="mode.id"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
              :class="calcMode === mode.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-transparent hover:border-border'"
              @click="setCalcMode(mode.id)"
            >
              {{ mode.label }}
            </button>
          </div>

          <!-- Input -->
          <div class="flex gap-3 items-end">
            <div class="flex-1 space-y-2">
              <Label>{{ calcModes.find(m => m.id === calcMode)?.label }}</Label>
              <Input
                v-model="calcInput"
                type="text"
                :placeholder="calcModes.find(m => m.id === calcMode)?.placeholder"
                class="font-mono text-lg"
              />
            </div>
          </div>

          <!-- Results -->
          <div v-if="calcResults" class="space-y-4 pt-4 border-t">
            <!-- Region identification -->
            <div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div class="w-4 h-4 rounded-full shadow-md" :style="{ background: calcResults.regionColor }"></div>
              <span class="font-medium text-sm">Región del espectro:</span>
              <Badge variant="secondary">{{ calcResults.region }}</Badge>
            </div>

            <!-- Visible color preview -->
            <div v-if="calcResults.visibleColor" class="p-4 rounded-lg border-2 text-center space-y-2" :style="{ borderColor: calcResults.visibleColor }">
              <div class="w-full h-12 rounded-lg shadow-inner" :style="{ background: calcResults.visibleColor }"></div>
              <p class="text-xs text-muted-foreground">Color aproximado para λ = {{ calcResults.lambdaNm.toFixed(1) }} nm</p>
            </div>

            <!-- Calculated values -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-blue-500/10 rounded-lg p-4 space-y-1 border border-blue-500/20">
                <div class="text-xs text-blue-500 font-medium">Longitud de Onda (λ)</div>
                <div class="text-lg font-mono font-bold">{{ sci(calcResults.lambda) }} m</div>
                <div class="text-sm font-mono text-muted-foreground">{{ calcResults.lambdaNm.toFixed(2) }} nm</div>
              </div>
              <div class="bg-purple-500/10 rounded-lg p-4 space-y-1 border border-purple-500/20">
                <div class="text-xs text-purple-500 font-medium">Frecuencia (ν)</div>
                <div class="text-lg font-mono font-bold">{{ sci(calcResults.freq) }} Hz</div>
              </div>
              <div class="bg-red-500/10 rounded-lg p-4 space-y-1 border border-red-500/20">
                <div class="text-xs text-red-500 font-medium">Energía (E)</div>
                <div class="text-lg font-mono font-bold">{{ sci(calcResults.energy) }} J</div>
              </div>
              <div class="bg-amber-500/10 rounded-lg p-4 space-y-1 border border-amber-500/20">
                <div class="text-xs text-amber-500 font-medium">Energía (eV)</div>
                <div class="text-lg font-mono font-bold">{{ calcResults.energyEv.toFixed(4) }} eV</div>
              </div>
            </div>

            <!-- Formulas used -->
            <div class="bg-muted/30 rounded-lg p-4 space-y-2">
              <div class="text-xs font-medium text-muted-foreground">Fórmulas utilizadas:</div>
              <div v-if="calcMode === 'lambda'" class="text-sm font-mono space-y-1">
                <div>ν = c / λ = {{ sci(c) }} / {{ sci(calcResults.lambda) }} = <strong>{{ sci(calcResults.freq) }} Hz</strong></div>
                <div>E = hν = {{ sci(h) }} × {{ sci(calcResults.freq) }} = <strong>{{ sci(calcResults.energy) }} J</strong></div>
              </div>
              <div v-if="calcMode === 'freq'" class="text-sm font-mono space-y-1">
                <div>λ = c / ν = {{ sci(c) }} / {{ sci(calcResults.freq) }} = <strong>{{ sci(calcResults.lambda) }} m</strong></div>
                <div>E = hν = {{ sci(h) }} × {{ sci(calcResults.freq) }} = <strong>{{ sci(calcResults.energy) }} J</strong></div>
              </div>
              <div v-if="calcMode === 'energy'" class="text-sm font-mono space-y-1">
                <div>ν = E / h = {{ sci(calcResults.energy) }} / {{ sci(h) }} = <strong>{{ sci(calcResults.freq) }} Hz</strong></div>
                <div>λ = c / ν = {{ sci(c) }} / {{ sci(calcResults.freq) }} = <strong>{{ sci(calcResults.lambda) }} m</strong></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Constants Card -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm">Constantes Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div class="bg-muted/50 p-3 rounded-lg text-center">
              <div class="font-mono font-bold">h = 6.626 × 10⁻³⁴ J·s</div>
              <div class="text-xs text-muted-foreground mt-1">Constante de Planck</div>
            </div>
            <div class="bg-muted/50 p-3 rounded-lg text-center">
              <div class="font-mono font-bold">c = 3 × 10⁸ m/s</div>
              <div class="text-xs text-muted-foreground mt-1">Velocidad de la luz</div>
            </div>
            <div class="bg-muted/50 p-3 rounded-lg text-center">
              <div class="font-mono font-bold">1 eV = 1.602 × 10⁻¹⁹ J</div>
              <div class="text-xs text-muted-foreground mt-1">Electrón-voltio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 3: Efecto Fotoeléctrico            -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'fotoelectrico'" class="space-y-6">
      <!-- Formula header -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-wrap justify-center gap-6 text-center">
            <div class="space-y-1">
              <div class="text-lg font-mono font-bold text-yellow-500">E_fotón = hν</div>
              <div class="text-xs text-muted-foreground">Energía del fotón</div>
            </div>
            <div class="space-y-1">
              <div class="text-lg font-mono font-bold text-green-500">KE = hν - φ</div>
              <div class="text-xs text-muted-foreground">Energía cinética del e⁻</div>
            </div>
            <div class="space-y-1">
              <div class="text-lg font-mono font-bold text-cyan-500">ν₀ = φ/h</div>
              <div class="text-xs text-muted-foreground">Frecuencia umbral</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Calculator -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Zap class="w-5 h-5" />
            Calculadora del Efecto Fotoeléctrico
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Frecuencia de la luz, ν (Hz)</Label>
              <Input
                v-model="fotoelectrico.frecuencia"
                type="text"
                placeholder="Ej: 1.2e15"
                class="font-mono"
              />
            </div>
            <div class="space-y-2">
              <Label>Función de trabajo, φ (eV)</Label>
              <Input
                v-model="fotoelectrico.workFunction"
                type="text"
                placeholder="Ej: 2.3"
                class="font-mono"
              />
            </div>
          </div>

          <!-- Quick metal selection -->
          <div>
            <div class="text-sm font-medium mb-2">Selección rápida de metal:</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="metal in fotoMetales"
                :key="metal.nombre"
                class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:shadow-sm"
                :class="fotoelectrico.workFunction === metal.phi.toString()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted text-muted-foreground border-transparent'"
                @click="selectMetal(metal)"
              >
                {{ metal.nombre }} ({{ metal.phi }} eV)
              </button>
            </div>
          </div>

          <!-- Results -->
          <div v-if="fotoResults" class="space-y-4 pt-4 border-t">
            <!-- Ejection Status -->
            <div
              class="p-5 rounded-xl border-2 text-center space-y-3 transition-all"
              :class="fotoResults.ejected
                ? 'bg-green-500/10 border-green-500'
                : 'bg-red-500/10 border-red-500'"
            >
              <div class="text-4xl">{{ fotoResults.ejected ? '⚡' : '🚫' }}</div>
              <div class="text-xl font-bold" :class="fotoResults.ejected ? 'text-green-500' : 'text-red-500'">
                {{ fotoResults.ejected ? 'Electrón emitido' : 'Electrón NO emitido' }}
              </div>
              <div class="text-sm text-muted-foreground">
                <span v-if="fotoResults.ejected">
                  La energía del fotón ({{ fotoResults.E_foton_eV.toFixed(4) }} eV) supera la función de trabajo ({{ fotoelectrico.workFunction }} eV).
                  El electrón sale con energía cinética.
                </span>
                <span v-else>
                  La energía del fotón ({{ fotoResults.E_foton_eV.toFixed(4) }} eV) es insuficiente para superar la función de trabajo ({{ fotoelectrico.workFunction }} eV).
                  Se necesita mayor frecuencia.
                </span>
              </div>
            </div>

            <!-- Energy bar visualization -->
            <div class="bg-muted/30 rounded-lg p-4 space-y-3">
              <div class="text-sm font-medium">Diagrama de energía:</div>
              <div class="relative h-8 bg-muted rounded-full overflow-hidden">
                <div
                  class="absolute h-full rounded-full transition-all duration-500"
                  :class="fotoResults.ejected ? 'bg-green-500' : 'bg-red-500'"
                  :style="{ width: Math.min(parseFloat(fotoResults.excessRatio), 200) / 2 + '%' }"
                ></div>
                <div
                  class="absolute h-full border-r-2 border-dashed border-yellow-500"
                  style="left: 50%;"
                ></div>
              </div>
              <div class="flex justify-between text-xs text-muted-foreground">
                <span>0 eV</span>
                <span class="text-yellow-500 font-medium">φ = {{ fotoelectrico.workFunction }} eV</span>
                <span>E_fotón = {{ fotoResults.E_foton_eV.toFixed(3) }} eV</span>
              </div>
            </div>

            <!-- Calculated values -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-yellow-500/10 rounded-lg p-4 space-y-1 border border-yellow-500/20">
                <div class="text-xs text-yellow-500 font-medium">Energía del Fotón (E)</div>
                <div class="text-lg font-mono font-bold">{{ sci(fotoResults.E_foton) }} J</div>
                <div class="text-sm font-mono text-muted-foreground">{{ fotoResults.E_foton_eV.toFixed(4) }} eV</div>
              </div>
              <div class="bg-cyan-500/10 rounded-lg p-4 space-y-1 border border-cyan-500/20">
                <div class="text-xs text-cyan-500 font-medium">Frecuencia Umbral (ν₀)</div>
                <div class="text-lg font-mono font-bold">{{ sci(fotoResults.nu_0) }} Hz</div>
                <div class="text-sm font-mono text-muted-foreground">λ₀ = {{ sci(c / fotoResults.nu_0) }} m</div>
              </div>
              <div class="rounded-lg p-4 space-y-1 border" :class="fotoResults.ejected ? 'bg-green-500/10 border-green-500/20' : 'bg-muted/50 border-transparent'">
                <div class="text-xs font-medium" :class="fotoResults.ejected ? 'text-green-500' : 'text-muted-foreground'">Energía Cinética (KE)</div>
                <div class="text-lg font-mono font-bold">
                  {{ fotoResults.ejected ? sci(fotoResults.KE) + ' J' : '—' }}
                </div>
                <div class="text-sm font-mono text-muted-foreground" v-if="fotoResults.ejected">
                  {{ fotoResults.KE_eV.toFixed(4) }} eV
                </div>
              </div>
              <div class="bg-muted/50 rounded-lg p-4 space-y-1 border border-transparent">
                <div class="text-xs text-muted-foreground font-medium">Función de Trabajo (φ)</div>
                <div class="text-lg font-mono font-bold">{{ fotoelectrico.workFunction }} eV</div>
                <div class="text-sm font-mono text-muted-foreground">{{ sci(fotoResults.phi_J) }} J</div>
              </div>
            </div>

            <!-- Formulas used -->
            <div class="bg-muted/30 rounded-lg p-4 space-y-2">
              <div class="text-xs font-medium text-muted-foreground">Cálculos paso a paso:</div>
              <div class="text-sm font-mono space-y-1">
                <div>E_fotón = hν = ({{ sci(h) }})({{ sci(parseFloat(fotoelectrico.frecuencia)) }}) = <strong>{{ sci(fotoResults.E_foton) }} J</strong></div>
                <div>E_fotón = {{ fotoResults.E_foton_eV.toFixed(4) }} eV</div>
                <div>ν₀ = φ/h = ({{ fotoelectrico.workFunction }} × {{ sci(eVtoJ) }}) / {{ sci(h) }} = <strong>{{ sci(fotoResults.nu_0) }} Hz</strong></div>
                <div v-if="fotoResults.ejected">KE = hν - φ = {{ fotoResults.E_foton_eV.toFixed(4) }} - {{ fotoelectrico.workFunction }} = <strong>{{ fotoResults.KE_eV.toFixed(4) }} eV</strong></div>
                <div v-else>hν &lt; φ → No hay emisión de electrones</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Key Concepts -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Conceptos del Efecto Fotoeléctrico</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="concepto in fotoConceptos"
              :key="concepto.titulo"
              class="bg-muted/50 rounded-lg p-4 space-y-2 border hover:border-primary/30 transition-colors"
            >
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ concepto.icono }}</span>
                <span class="font-semibold text-sm">{{ concepto.titulo }}</span>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ concepto.desc }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Important observations -->
      <Card class="border-yellow-500/30">
        <CardHeader>
          <CardTitle class="text-lg flex items-center gap-2">
            <Lightbulb class="w-5 h-5 text-yellow-500" />
            Observaciones Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>La energía cinética del electrón depende de la <strong class="text-foreground">frecuencia</strong> de la luz, no de su intensidad.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Aumentar la <strong class="text-foreground">intensidad</strong> aumenta el número de electrones emitidos, no su energía.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>Si ν &lt; ν₀, no se emiten electrones sin importar cuán intensa sea la luz.</span>
            </li>
            <li class="flex items-start gap-2">
              <Check class="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>La emisión de electrones es <strong class="text-foreground">instantánea</strong> si la frecuencia supera el umbral.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- SECTION 4: Conceptos Clave                 -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeSection === 'conceptos'" class="space-y-6">
      <!-- Concept Cards -->
      <div class="grid grid-cols-1 gap-4">
        <Card
          v-for="concepto in conceptosClave"
          :key="concepto.id"
          class="border-l-4 cursor-pointer transition-all hover:shadow-md"
          :style="{ borderLeftColor: concepto.color }"
          @click="toggleConcepto(concepto.id)"
        >
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-lg">{{ concepto.titulo }}</CardTitle>
                <p class="text-sm text-muted-foreground mt-0.5">{{ concepto.subtitulo }}</p>
              </div>
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300"
                :class="conceptosExpandido === concepto.id ? 'rotate-180' : ''"
                :style="{ background: concepto.color + '22' }"
              >
                <ArrowDown class="w-4 h-4" :style="{ color: concepto.color }" />
              </div>
            </div>
          </CardHeader>
          <CardContent v-if="conceptosExpandido === concepto.id" class="space-y-3">
            <p class="text-sm text-muted-foreground leading-relaxed">{{ concepto.contenido }}</p>
            <ul class="space-y-1.5">
              <li
                v-for="punto in concepto.puntos"
                :key="punto"
                class="flex items-start gap-2 text-sm"
              >
                <div class="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" :style="{ background: concepto.color }"></div>
                <span>{{ punto }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <!-- Formulas Reference Table -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Tabla de Fórmulas</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 px-3 font-semibold">Fórmula</th>
                  <th class="text-left py-2 px-3 font-semibold">Descripción</th>
                  <th class="text-left py-2 px-3 font-semibold hidden sm:table-cell">Notas</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(f, idx) in formulas"
                  :key="idx"
                  class="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td class="py-2.5 px-3 font-mono font-bold text-primary whitespace-nowrap">{{ f.formula }}</td>
                  <td class="py-2.5 px-3 text-muted-foreground">{{ f.desc }}</td>
                  <td class="py-2.5 px-3 text-xs text-muted-foreground hidden sm:table-cell">{{ f.vars }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Relationship Summary -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Relación entre λ, ν y E</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <div class="text-3xl font-bold text-blue-500">λ</div>
              <div class="text-sm font-medium">Longitud de Onda</div>
              <div class="text-xs text-muted-foreground">Distancia entre crestas sucesivas. Unidad: metros (m), nanómetros (nm).</div>
            </div>
            <div class="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 space-y-2">
              <div class="text-3xl font-bold text-purple-500">ν</div>
              <div class="text-sm font-medium">Frecuencia</div>
              <div class="text-xs text-muted-foreground">Número de ciclos por segundo. Unidad: Hertz (Hz = s⁻¹).</div>
            </div>
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4 space-y-2">
              <div class="text-3xl font-bold text-red-500">E</div>
              <div class="text-sm font-medium">Energía</div>
              <div class="text-xs text-muted-foreground">Energía transportada por el fotón. Unidad: Joules (J), electrón-voltios (eV).</div>
            </div>
          </div>

          <div class="bg-muted/30 rounded-lg p-4 text-center space-y-2">
            <div class="text-sm font-medium">Relaciones fundamentales:</div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
              <span class="font-mono">λ y ν son <strong class="text-yellow-500">inversamente</strong> proporcionales</span>
              <span class="hidden sm:inline text-muted-foreground">|</span>
              <span class="font-mono">ν y E son <strong class="text-green-500">directamente</strong> proporcionales</span>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
              <span class="font-mono">λ y E son <strong class="text-yellow-500">inversamente</strong> proporcionales</span>
            </div>
            <p class="text-xs text-muted-foreground pt-2">
              Mayor frecuencia = menor longitud de onda = mayor energía. Los rayos gamma tienen la mayor energía; las ondas de radio la menor.
            </p>
          </div>
        </CardContent>
      </Card>

      <!-- Constants summary -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Constantes Fundamentales</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-muted/50 rounded-lg p-4 space-y-1">
              <div class="text-xs text-muted-foreground">Constante de Planck</div>
              <div class="font-mono font-bold">h = 6.626 × 10⁻³⁴ J·s</div>
              <div class="font-mono text-sm text-muted-foreground">h = 4.136 × 10⁻¹⁵ eV·s</div>
            </div>
            <div class="bg-muted/50 rounded-lg p-4 space-y-1">
              <div class="text-xs text-muted-foreground">Velocidad de la Luz</div>
              <div class="font-mono font-bold">c = 2.998 × 10⁸ m/s</div>
              <div class="font-mono text-sm text-muted-foreground">≈ 3 × 10⁸ m/s</div>
            </div>
            <div class="bg-muted/50 rounded-lg p-4 space-y-1">
              <div class="text-xs text-muted-foreground">Carga del Electrón</div>
              <div class="font-mono font-bold">e = 1.602 × 10⁻¹⁹ C</div>
              <div class="font-mono text-sm text-muted-foreground">1 eV = 1.602 × 10⁻¹⁹ J</div>
            </div>
            <div class="bg-muted/50 rounded-lg p-4 space-y-1">
              <div class="text-xs text-muted-foreground">Número de Avogadro</div>
              <div class="font-mono font-bold">N_A = 6.022 × 10²³ mol⁻¹</div>
              <div class="font-mono text-sm text-muted-foreground">Partículas por mol</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

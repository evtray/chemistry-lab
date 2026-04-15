<script setup>
import { ref, computed, reactive } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const activeSection = ref('conceptos')
const sections = [
  { id: 'conceptos', label: 'Conceptos', icon: '⚛️' },
  { id: 'calculadoras', label: 'Calculadoras', icon: '🧮' },
  { id: 'tarea5', label: 'Tarea 5 resuelta', icon: '📝' },
]

// ─── CONCEPTOS interactivos ───
const conceptoDemo = reactive({
  Z: 6, A: 12
})
const demoN = computed(() => conceptoDemo.A - conceptoDemo.Z)
const demoElement = computed(() => {
  const table = { 1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',27:'Co',28:'Ni',29:'Cu',30:'Zn' }
  return table[conceptoDemo.Z] || '?'
})

// Demo masa ponderada con 2 isótopos
const demoIso = reactive({ m1: 12, f1: 98.93, m2: 13.003, f2: 1.07 })
const demoAvg = computed(() => {
  const f1 = demoIso.f1 / 100, f2 = demoIso.f2 / 100
  return (demoIso.m1 * f1 + demoIso.m2 * f2).toFixed(4)
})

// ─── CALCULADORA: Masa ponderada (N isótopos) ───
const calcIsoCount = ref(3)
const calcIsos = ref([
  { masa: '', abundancia: '' },
  { masa: '', abundancia: '' },
  { masa: '', abundancia: '' },
  { masa: '', abundancia: '' },
  { masa: '', abundancia: '' }
])
const calcModoAbundancia = ref('fraccion') // fraccion, porcentaje, ppm
const calcResult = computed(() => {
  const isos = calcIsos.value.slice(0, calcIsoCount.value)
  const parsed = isos.map(iso => ({
    m: parseFloat(iso.masa),
    f: parseFloat(iso.abundancia)
  }))
  if (parsed.some(p => !Number.isFinite(p.m) || !Number.isFinite(p.f))) return null
  let divisor = 1
  if (calcModoAbundancia.value === 'porcentaje') divisor = 100
  else if (calcModoAbundancia.value === 'ppm') divisor = 1000000
  const sumF = parsed.reduce((s, p) => s + p.f / divisor, 0)
  const avg = parsed.reduce((s, p) => s + p.m * (p.f / divisor), 0) / (sumF || 1)
  return { avg, sumF, divisor, parsed }
})
const calcSteps = computed(() => {
  if (!calcResult.value) return []
  const { parsed, divisor, avg, sumF } = calcResult.value
  const label = calcModoAbundancia.value === 'fraccion' ? '' : calcModoAbundancia.value === 'porcentaje' ? '/100' : '/1000000'
  const steps = ['m̄ = Σ(mᵢ × fᵢ)' + (divisor !== 1 ? ' / Σfᵢ' : '')]
  let expr = parsed.map((p, i) => `(${p.m} × ${p.f}${label})`).join(' + ')
  steps.push(`m̄ = ${expr}`)
  const nums = parsed.map(p => (p.m * p.f / divisor).toFixed(6))
  steps.push(`m̄ = ${nums.join(' + ')}`)
  if (divisor !== 1) steps.push(`Σfᵢ = ${sumF.toFixed(6)}`)
  steps.push(`m̄ = ${avg.toFixed(4)} uma`)
  return steps
})

// ─── CALCULADORA: Hallar masa faltante ───
const faltante = reactive({
  masaMedia: '',
  isos: [
    { masa: '', abundancia: '' },
    { masa: '', abundancia: '' },
    { masa: '', abundancia: '' }
  ]
})
// El usuario deja uno con masa vacía → ese es el faltante
const faltanteResult = computed(() => {
  const mm = parseFloat(faltante.masaMedia)
  if (!Number.isFinite(mm)) return null
  const parsed = faltante.isos.map(iso => ({
    m: iso.masa === '' ? null : parseFloat(iso.masa),
    f: iso.abundancia === '' ? null : parseFloat(iso.abundancia)
  }))
  // Encontrar el que tiene masa null
  const missingIdx = parsed.findIndex(p => p.m === null || !Number.isFinite(p.m))
  if (missingIdx === -1) return null
  // El faltante también puede tener abundancia null
  const known = parsed.filter((_, i) => i !== missingIdx)
  if (known.some(k => k.m === null || !Number.isFinite(k.m) || k.f === null || !Number.isFinite(k.f))) return null

  // Si abundancia del faltante es null, calcularla: f_x = 1 - Σf_conocidas
  let fMissing = parsed[missingIdx].f
  const sumKnownF = known.reduce((s, k) => s + k.f, 0)
  if (fMissing === null || !Number.isFinite(fMissing)) {
    fMissing = 1 - sumKnownF
  }
  if (fMissing <= 0) return null
  // m̄ = Σ(mᵢfᵢ) + m_x·f_x  →  m_x = (m̄ - Σ(mᵢfᵢ)) / f_x
  const sumKnown = known.reduce((s, k) => s + k.m * k.f, 0)
  const mMissing = (mm - sumKnown) / fMissing
  return { mMissing, fMissing, sumKnown, sumKnownF, missingIdx, known, mm }
})
const faltanteSteps = computed(() => {
  if (!faltanteResult.value) return []
  const r = faltanteResult.value
  const steps = ['m̄ = m₁f₁ + m₂f₂ + ... + mₓfₓ']
  if (r.fMissing !== null) {
    steps.push(`fₓ = 1 - (${r.known.map(k => k.f).join(' + ')}) = 1 - ${r.sumKnownF.toFixed(6)} = ${r.fMissing.toFixed(6)}`)
  }
  steps.push(`Σ(mᵢfᵢ) conocidos = ${r.known.map(k => `${k.m}×${k.f}`).join(' + ')} = ${r.sumKnown.toFixed(6)}`)
  steps.push(`${r.mm} = ${r.sumKnown.toFixed(6)} + mₓ × ${r.fMissing.toFixed(6)}`)
  steps.push(`mₓ = (${r.mm} - ${r.sumKnown.toFixed(6)}) / ${r.fMissing.toFixed(6)}`)
  steps.push(`mₓ = ${r.mMissing.toFixed(4)} uma`)
  return steps
})

// ─── CALCULADORA: Identificar elemento ───
const identEl = reactive({ sumaA: '', sumaN: '' })
const identResult = computed(() => {
  const sA = parseFloat(identEl.sumaA)
  const sN = parseFloat(identEl.sumaN)
  if (!Number.isFinite(sA) || !Number.isFinite(sN)) return null
  // Suma de A = suma de (Z + N) para cada isótopo. Si hay k isótopos con mismo Z:
  // ΣA = k·Z + ΣN  →  Z = (ΣA - ΣN) / k
  // Asumimos 3 isótopos como default
  const k = parseFloat(identEl.numIsos) || 3
  const Z = (sA - sN) / k
  if (Z !== Math.round(Z) || Z <= 0 || Z > 118) return null
  const symbols = {1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',27:'Co',28:'Ni',29:'Cu',30:'Zn',31:'Ga',32:'Ge',33:'As',34:'Se',35:'Br',36:'Kr',37:'Rb',38:'Sr',39:'Y',40:'Zr',41:'Nb',42:'Mo',43:'Tc',44:'Ru',45:'Rh',46:'Pd',47:'Ag',48:'Cd',49:'In',50:'Sn',51:'Sb',52:'Te',53:'I',54:'Xe',55:'Cs',56:'Ba',57:'La',58:'Ce',59:'Pr',60:'Nd',79:'Au',80:'Hg',82:'Pb',92:'U'}
  return { Z, k, symbol: symbols[Z] || `Z=${Z}` }
})
// Add numIsos to reactive
identEl.numIsos = '3'

// ─── CALCULADORA: Sistema de ecuaciones (2 isótopos) ───
const sist2 = reactive({ masaMedia: '', m1: '', m2: '' })
const sist2Result = computed(() => {
  const mm = parseFloat(sist2.masaMedia)
  const m1 = parseFloat(sist2.m1)
  const m2 = parseFloat(sist2.m2)
  if (!Number.isFinite(mm) || !Number.isFinite(m1) || !Number.isFinite(m2)) return null
  if (m1 === m2) return null
  // m̄ = m1·f1 + m2·(1-f1)  →  f1 = (m̄ - m2) / (m1 - m2)
  const f1 = (mm - m2) / (m1 - m2)
  const f2 = 1 - f1
  return { f1, f2, mm, m1, m2 }
})
const sist2Steps = computed(() => {
  if (!sist2Result.value) return []
  const { f1, f2, mm, m1, m2 } = sist2Result.value
  return [
    'Sea f₁ = fracción del isótopo 1, f₂ = 1 - f₁',
    `m̄ = m₁·f₁ + m₂·(1 - f₁)`,
    `${mm} = ${m1}·f₁ + ${m2}·(1 - f₁)`,
    `${mm} = ${m1}·f₁ + ${m2} - ${m2}·f₁`,
    `${mm} - ${m2} = f₁·(${m1} - ${m2})`,
    `${(mm - m2).toFixed(6)} = f₁ × ${(m1 - m2).toFixed(6)}`,
    `f₁ = ${f1.toFixed(6)} (${(f1 * 100).toFixed(2)}%)`,
    `f₂ = ${f2.toFixed(6)} (${(f2 * 100).toFixed(2)}%)`
  ]
})

// ─── TAREA 5 RESUELTA ───
const activeTarea = ref(1)
const tarea5 = [
  {
    id: 1, titulo: 'Hallar masa del 3er isótopo',
    enunciado: 'Elemento X tiene 3 isótopos. Se conocen masa y abundancia de 2. Masa media = 28.0855 uma. Hallar masa del 3ro.',
    tabla: [
      { iso: 'Primero', masa: '27.9769', abundancia: '0.445' },
      { iso: 'Segundo', masa: '28.9765', abundancia: '0.405' },
      { iso: 'Tercero', masa: '?', abundancia: '?' }
    ],
    pasos: [
      { t: 'Abundancia del 3er isótopo', c: 'f₃ = 1 - 0.445 - 0.405 = 0.150' },
      { t: 'Ecuación de masa ponderada', c: 'm̄ = m₁f₁ + m₂f₂ + m₃f₃\n28.0855 = (27.9769)(0.445) + (28.9765)(0.405) + m₃(0.150)' },
      { t: 'Calcular sumandos conocidos', c: '(27.9769)(0.445) = 12.4497\n(28.9765)(0.405) = 11.7355\nSuma = 24.1852' },
      { t: 'Despejar m₃', c: '28.0855 = 24.1852 + 0.150·m₃\n0.150·m₃ = 3.9003\nm₃ = 3.9003 / 0.150' },
      { t: 'Resultado', c: 'm₃ = 26.002 uma ≈ 2.6E1 uma' }
    ],
    respuesta: '2.6E1 uma'
  },
  {
    id: 2, titulo: 'Sistema de ecuaciones con relaciones verbales',
    enunciado: 'Elemento con masa promedio 111.4927 uma y 3 isótopos G1 (98.75), G2 (103.83), G3 (masa desconocida, se resuelve con las relaciones).\nRelaciones: f(103.83) = 3·f(98.75) - 0.19 ; f(G3) = 4·f(98.75) - 0.09',
    tabla: [
      { iso: 'G1', masa: '98.75', abundancia: 'x' },
      { iso: 'G2', masa: '103.83', abundancia: '3x - 0.19' },
      { iso: 'G3', masa: 'por resolver', abundancia: '4x - 0.09' }
    ],
    pasos: [
      { t: 'Definir variable', c: 'Sea x = fracción de G1 (masa 98.75)\nf₂ = 3x - 0.19 (19% menor que triple de x)\nf₃ = 4x - 0.09 (9% menor que cuádruple de x)' },
      { t: 'Ecuación de suma = 1', c: 'x + (3x - 0.19) + (4x - 0.09) = 1\n8x - 0.28 = 1\n8x = 1.28\nx = 0.16' },
      { t: 'Calcular abundancias', c: 'f₁ = 0.16 (16%)\nf₂ = 3(0.16) - 0.19 = 0.29 (29%)\nf₃ = 4(0.16) - 0.09 = 0.55 (55%)' },
      { t: 'Verificar: hallar masa de G3', c: '111.4927 = 98.75(0.16) + 103.83(0.29) + m₃(0.55)\n111.4927 = 15.80 + 30.11 + 0.55·m₃\n0.55·m₃ = 65.58\nm₃ = 119.24 uma' },
      { t: 'Resultado', c: 'Abundancia de G2 = 29% = 2.9E1' }
    ],
    respuesta: '2.9E1 (%)'
  },
  {
    id: 3, titulo: 'Identificar elemento por sumas',
    enunciado: '3 isótopos cuyas masas (A) suman 150 y cuyos neutrones suman 66. Identificar el elemento.',
    tabla: [],
    pasos: [
      { t: 'Relación fundamental', c: 'A = Z + N para cada isótopo\nPara 3 isótopos con mismo Z:\nΣA = 3Z + ΣN' },
      { t: 'Sustituir datos', c: '150 = 3Z + 66\n3Z = 150 - 66 = 84\nZ = 28' },
      { t: 'Resultado', c: 'Z = 28 → Níquel (Ni)' }
    ],
    respuesta: 'Ni (Níquel, Z=28)'
  },
  {
    id: 4, titulo: 'Masa de Ca-40 con abundancias en ppm',
    enunciado: 'El Ca tiene 6 isótopos estables (98% de abundancia total = 990,000 ppm). Masa media de los 6 = 39.6784 u. Hallar masa de Ca-40.',
    tabla: [
      { iso: '⁴⁰Ca', masa: 'X', abundancia: 'Y ppm' },
      { iso: '⁴²Ca', masa: '41.9586', abundancia: '6470' },
      { iso: '⁴³Ca', masa: '42.9588', abundancia: '1350' },
      { iso: '⁴⁴Ca', masa: '43.9555', abundancia: '20860' },
      { iso: '⁴⁶Ca', masa: '45.9537', abundancia: '40' },
      { iso: '⁴⁸Ca', masa: '47.9525', abundancia: '1870' }
    ],
    pasos: [
      { t: 'Hallar Y (abundancia de Ca-40)', c: 'Y = 990,000 - (6470 + 1350 + 20860 + 40 + 1870)\nY = 990,000 - 30,590\nY = 959,410 ppm' },
      { t: 'Masa ponderada con ppm', c: 'm̄ = Σ(mᵢ × ppmᵢ) / Σppm\n39.6784 = [X(959410) + 41.9586(6470) + 42.9588(1350) + 43.9555(20860) + 45.9537(40) + 47.9525(1870)] / 990000' },
      { t: 'Calcular numerador conocido', c: '41.9586 × 6470 = 271,492.14\n42.9588 × 1350 = 57,994.38\n43.9555 × 20860 = 917,311.73\n45.9537 × 40 = 1,838.15\n47.9525 × 1870 = 89,671.18\nSuma = 1,338,307.58' },
      { t: 'Despejar X', c: '39.6784 × 990000 = 959410·X + 1,338,307.58\n39,281,616 = 959410·X + 1,338,307.58\n959410·X = 37,943,308.42\nX = 39.55 u' },
      { t: 'Resultado', c: 'Masa del Ca-40 = 39.55 u (4 cifras significativas)' }
    ],
    respuesta: '39.55 u'
  },
  {
    id: 5, titulo: 'Abundancia de Cr-53 en número de átomos',
    enunciado: 'Tres isótopos estables del cromo. Se da la masa de cada uno y la abundancia del Cr-54 = 7.1210E21 átomos. Hallar abundancia del Cr-53.',
    tabla: [
      { iso: '⁵²Cr', masa: '51.94051', abundancia: '?' },
      { iso: '⁵³Cr', masa: '52.94065', abundancia: '?' },
      { iso: '⁵⁴Cr', masa: '53.93880', abundancia: '7.1210×10²¹' }
    ],
    pasos: [
      { t: 'Masa atómica del Cr (tabla periódica)', c: 'm̄(Cr) = 51.9961 uma\n(Se usa el valor estándar de la tabla periódica)' },
      { t: 'Variables con fracciones', c: 'Sea f₅₂, f₅₃, f₅₄ las fracciones\nf₅₂ + f₅₃ + f₅₄ = 1  ...(1)\n51.94051·f₅₂ + 52.94065·f₅₃ + 53.93880·f₅₄ = 51.9961  ...(2)' },
      { t: 'Buscar relación con datos conocidos', c: 'El Cr tiene abundancias conocidas:\nf₅₂ ≈ 0.8379, f₅₃ ≈ 0.0950, f₅₄ ≈ 0.0237 (aprox. 2.365%)\nSi Cr-54 = 7.121E21 átomos y eso representa f₅₄ del total:\nN_total = 7.121E21 / f₅₄' },
      { t: 'Calcular con la proporción', c: 'De las ecuaciones (1) y (2) se resuelve el sistema.\nUsando f₅₄ como referencia:\nN_total = 7.121×10²¹ / 0.02365 ≈ 3.012×10²³\nN₅₃ = 0.0950 × 3.012×10²³' },
      { t: 'Resultado', c: 'N₅₃ ≈ 1.9×10²² átomos = 1.9E22' }
    ],
    respuesta: '1.9E22 átomos'
  }
]
const tareaActual = computed(() => tarea5.find(t => t.id === activeTarea.value))
const revealedTareaSteps = ref(0)
const showTareaResp = ref(false)
function selectTarea(id) {
  activeTarea.value = id
  revealedTareaSteps.value = 0
  showTareaResp.value = false
}
function revealNextTarea() {
  if (!tareaActual.value) return
  if (revealedTareaSteps.value < tareaActual.value.pasos.length) revealedTareaSteps.value++
  else showTareaResp.value = true
}

// ─── ACTIVE CALC ───
const activeCalc = ref('masaPonderada')
</script>

<template>
  <div class="space-y-4">
    <!-- Nav -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="sec in sections" :key="sec.id"
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
        :class="activeSection === sec.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'"
        @click="activeSection = sec.id"
      >
        <span class="text-sm">{{ sec.icon }}</span>{{ sec.label }}
      </button>
    </div>

    <!-- ═══════ CONCEPTOS ═══════ -->
    <div v-if="activeSection === 'conceptos'" class="space-y-4">
      <!-- Qué es un isótopo -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">¿Qué es un isótopo?</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm leading-relaxed">
            Isótopos son átomos del <strong>mismo elemento</strong> (mismo Z) pero con <strong>distinto número de neutrones</strong> (distinto A).
          </p>
          <!-- Demo interactiva -->
          <div class="rounded-xl border p-4 bg-muted/10 space-y-3">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Explora: ajusta Z y A</p>
            <div class="grid grid-cols-2 gap-4 max-w-xs">
              <div class="space-y-1">
                <Label class="text-xs">Z (protones)</Label>
                <input v-model.number="conceptoDemo.Z" type="range" min="1" max="30" class="w-full accent-primary" />
                <span class="font-mono font-bold text-sm">{{ conceptoDemo.Z }}</span>
              </div>
              <div class="space-y-1">
                <Label class="text-xs">A (masa atómica)</Label>
                <input v-model.number="conceptoDemo.A" type="range" :min="conceptoDemo.Z" :max="conceptoDemo.Z * 2 + 10" class="w-full accent-primary" />
                <span class="font-mono font-bold text-sm">{{ conceptoDemo.A }}</span>
              </div>
            </div>
            <!-- Átomo visual -->
            <div class="flex items-center gap-6 flex-wrap">
              <div class="relative w-28 h-28">
                <!-- Núcleo -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/40 flex flex-col items-center justify-center">
                    <span class="text-[9px] text-muted-foreground">p⁺={{ conceptoDemo.Z }}</span>
                    <span class="text-[9px] text-muted-foreground">n⁰={{ demoN }}</span>
                  </div>
                </div>
                <!-- Electrones (órbita simplificada) -->
                <div class="absolute inset-0 rounded-full border border-dashed border-primary/30"></div>
                <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[6px] text-white font-bold">e⁻</div>
              </div>
              <!-- Simbología -->
              <div class="space-y-1">
                <div class="flex items-baseline gap-0.5">
                  <div class="flex flex-col items-end text-xs font-mono mr-0.5">
                    <span class="font-bold">{{ conceptoDemo.A }}</span>
                    <span>{{ conceptoDemo.Z }}</span>
                  </div>
                  <span class="text-3xl font-bold text-primary">{{ demoElement }}</span>
                </div>
                <div class="text-xs space-y-0.5 font-mono">
                  <p>Z = {{ conceptoDemo.Z }} protones</p>
                  <p>N = A - Z = {{ conceptoDemo.A }} - {{ conceptoDemo.Z }} = <strong>{{ demoN }}</strong> neutrones</p>
                  <p>e⁻ = {{ conceptoDemo.Z }} (átomo neutro)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div class="rounded-lg border p-3 text-center">
              <p class="font-bold text-lg text-primary">Z</p>
              <p class="text-muted-foreground">Número atómico</p>
              <p class="mt-1">= protones = electrones (neutro)</p>
              <p class="font-medium">Define el elemento</p>
            </div>
            <div class="rounded-lg border p-3 text-center">
              <p class="font-bold text-lg text-primary">A</p>
              <p class="text-muted-foreground">Número de masa</p>
              <p class="mt-1">= Z + N (protones + neutrones)</p>
              <p class="font-medium">Diferente entre isótopos</p>
            </div>
            <div class="rounded-lg border p-3 text-center">
              <p class="font-bold text-lg text-primary">N</p>
              <p class="text-muted-foreground">Neutrones</p>
              <p class="mt-1">= A - Z</p>
              <p class="font-medium">Varía entre isótopos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Masa ponderada -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Masa atómica ponderada</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm leading-relaxed">
            La masa atómica de un elemento es el <strong>promedio ponderado</strong> de las masas de sus isótopos, pesado por su abundancia natural.
          </p>
          <div class="rounded-lg bg-muted/30 p-4 font-mono text-center">
            <p class="text-base">m̄ = m₁·f₁ + m₂·f₂ + ... + mₙ·fₙ</p>
            <p class="text-xs text-muted-foreground mt-1">donde fᵢ = fracción (0 a 1), Σfᵢ = 1</p>
          </div>

          <!-- Demo Carbono -->
          <div class="rounded-xl border p-4 bg-muted/10 space-y-3">
            <p class="text-xs font-medium text-muted-foreground uppercase tracking-wide">Demo: Carbono (ajusta abundancias)</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <Label class="text-xs">¹²C: masa = {{ demoIso.m1 }} uma</Label>
                <input v-model.number="demoIso.f1" type="range" min="0" max="100" step="0.01" class="w-full accent-primary" />
                <span class="font-mono text-sm">{{ demoIso.f1.toFixed(2) }}%</span>
              </div>
              <div class="space-y-1">
                <Label class="text-xs">¹³C: masa = {{ demoIso.m2 }} uma</Label>
                <input v-model.number="demoIso.f2" type="range" min="0" max="100" step="0.01" class="w-full accent-primary" />
                <span class="font-mono text-sm">{{ demoIso.f2.toFixed(2) }}%</span>
              </div>
            </div>
            <div class="rounded-lg bg-primary/10 p-3 text-center">
              <span class="text-xs text-muted-foreground">Masa ponderada =</span>
              <p class="font-mono font-bold text-xl text-primary">{{ demoAvg }} uma</p>
              <p class="text-[10px] text-muted-foreground">Valor real del Carbono: 12.011 uma</p>
            </div>
            <!-- Barra visual -->
            <div class="h-6 rounded-full overflow-hidden flex">
              <div class="h-full flex items-center justify-center text-[9px] font-bold text-white bg-primary/70" :style="{ width: demoIso.f1 + '%' }">¹²C {{ demoIso.f1.toFixed(1) }}%</div>
              <div class="h-full flex items-center justify-center text-[9px] font-bold text-white bg-amber-500/70" :style="{ width: demoIso.f2 + '%' }">¹³C</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Tipos de problemas -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Tipos de problemas de isótopos</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="tipo in [
              { title: 'Hallar masa faltante', desc: 'Dado m̄ y datos de n-1 isótopos, despejar la masa del que falta.', icon: '🔍' },
              { title: 'Hallar abundancia', desc: 'Con 2 isótopos: f₁ = (m̄ - m₂)/(m₁ - m₂). Con más: sistema de ecuaciones.', icon: '📊' },
              { title: 'Relaciones verbales', desc: 'Ej: «f₂ es 19% menor que el triple de f₁» → f₂ = 3f₁ - 0.19. Plantear sistema.', icon: '📝' },
              { title: 'Identificar elemento', desc: 'ΣA = k·Z + ΣN → Z = (ΣA - ΣN)/k. Buscar símbolo.', icon: '🔬' },
              { title: 'Abundancias en ppm', desc: 'ppm/10⁶ = fracción. Misma ecuación ponderada pero dividir entre Σppm.', icon: '🧪' },
              { title: 'Número de átomos', desc: 'N_i = f_i × N_total. Si dan N de un isótopo: N_total = N_i / f_i.', icon: '⚛️' }
            ]" :key="tipo.title"
              class="rounded-lg border p-3 space-y-1"
            >
              <div class="flex items-center gap-2">
                <span>{{ tipo.icon }}</span>
                <span class="font-medium text-sm">{{ tipo.title }}</span>
              </div>
              <p class="text-[10px] text-muted-foreground leading-relaxed">{{ tipo.desc }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════ CALCULADORAS ═══════ -->
    <div v-if="activeSection === 'calculadoras'" class="space-y-4">
      <div class="flex flex-wrap gap-1.5">
        <button v-for="c in [
          {id:'masaPonderada', l:'Masa ponderada'},
          {id:'masaFaltante', l:'Masa faltante'},
          {id:'abundancia2', l:'Abundancia (2 isótopos)'},
          {id:'identificar', l:'Identificar elemento'}
        ]" :key="c.id"
          class="rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all"
          :class="activeCalc === c.id ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'"
          @click="activeCalc = c.id"
        >{{ c.l }}</button>
      </div>

      <!-- Masa ponderada -->
      <Card v-if="activeCalc === 'masaPonderada'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Calculadora de masa atómica ponderada</CardTitle>
          <p class="text-sm text-muted-foreground">Ingresa masa y abundancia de cada isótopo.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-sm">m̄ = Σ(mᵢ × fᵢ)</div>
          <div class="flex items-center gap-3 flex-wrap">
            <Label class="text-xs">Isótopos:</Label>
            <input v-model.number="calcIsoCount" type="range" min="2" max="5" class="w-24 accent-primary" />
            <span class="font-mono text-sm font-bold">{{ calcIsoCount }}</span>
            <div class="flex gap-1.5 ml-auto">
              <button v-for="m in [{id:'fraccion',l:'Fracción'},{id:'porcentaje',l:'%'},{id:'ppm',l:'ppm'}]" :key="m.id"
                class="rounded border px-2 py-0.5 text-[10px] font-medium transition-all"
                :class="calcModoAbundancia === m.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
                @click="calcModoAbundancia = m.id"
              >{{ m.l }}</button>
            </div>
          </div>
          <div class="space-y-2">
            <div v-for="i in calcIsoCount" :key="i" class="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
              <span class="text-xs font-mono font-bold text-muted-foreground w-4">{{ i }}</span>
              <Input v-model="calcIsos[i-1].masa" type="number" step="any" :placeholder="'Masa (uma)'" class="h-8 font-mono text-sm" />
              <Input v-model="calcIsos[i-1].abundancia" type="number" step="any" :placeholder="calcModoAbundancia === 'fraccion' ? 'Fracción (0-1)' : calcModoAbundancia === 'porcentaje' ? '%' : 'ppm'" class="h-8 font-mono text-sm" />
            </div>
          </div>
          <div v-if="calcResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <p class="text-center font-mono font-bold text-2xl text-primary">m̄ = {{ calcResult.avg.toFixed(4) }} uma</p>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in calcSteps" :key="i" class="text-sm font-mono" :class="i === calcSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Masa faltante -->
      <Card v-if="activeCalc === 'masaFaltante'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Hallar masa del isótopo faltante</CardTitle>
          <p class="text-sm text-muted-foreground">Deja la masa del isótopo desconocido vacía. Si la abundancia también es desconocida, déjala vacía (se calcula como 1 - Σfᵢ).</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-sm">
            mₓ = (m̄ - Σmᵢfᵢ) / fₓ
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-[80px_1fr] gap-2 items-center">
              <Label class="text-xs">Masa media</Label>
              <Input v-model="faltante.masaMedia" type="number" step="any" placeholder="ej: 28.0855" class="h-8 font-mono text-sm" />
            </div>
            <div v-for="(iso, i) in faltante.isos" :key="i" class="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
              <span class="text-xs font-mono font-bold text-muted-foreground w-4">{{ i + 1 }}</span>
              <Input v-model="iso.masa" type="number" step="any" placeholder="Masa (vacío = incógnita)" class="h-8 font-mono text-sm" />
              <Input v-model="iso.abundancia" type="number" step="any" placeholder="Fracción (vacío = calcular)" class="h-8 font-mono text-sm" />
            </div>
          </div>
          <div v-if="faltanteResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <div class="text-center">
              <span class="text-xs text-muted-foreground">Masa del isótopo {{ faltanteResult.missingIdx + 1 }}</span>
              <p class="font-mono font-bold text-2xl text-primary">{{ faltanteResult.mMissing.toFixed(4) }} uma</p>
              <p class="text-xs text-muted-foreground font-mono">Abundancia: {{ faltanteResult.fMissing.toFixed(6) }} ({{ (faltanteResult.fMissing * 100).toFixed(2) }}%)</p>
            </div>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in faltanteSteps" :key="i" class="text-sm font-mono" :class="i === faltanteSteps.length - 1 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Abundancia 2 isótopos -->
      <Card v-if="activeCalc === 'abundancia2'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Abundancia de 2 isótopos</CardTitle>
          <p class="text-sm text-muted-foreground">Dado m̄ y las masas de 2 isótopos, calcula sus abundancias.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-sm">
            f₁ = (m̄ - m₂) / (m₁ - m₂) &nbsp;&nbsp;|&nbsp;&nbsp; f₂ = 1 - f₁
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="space-y-1">
              <Label class="text-xs">Masa media (uma)</Label>
              <Input v-model="sist2.masaMedia" type="number" step="any" placeholder="ej: 63.546" class="h-8 font-mono text-sm" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">m₁ (uma)</Label>
              <Input v-model="sist2.m1" type="number" step="any" placeholder="ej: 63" class="h-8 font-mono text-sm" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">m₂ (uma)</Label>
              <Input v-model="sist2.m2" type="number" step="any" placeholder="ej: 65" class="h-8 font-mono text-sm" />
            </div>
          </div>
          <div v-if="sist2Result" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <div class="grid grid-cols-2 gap-3 text-center">
              <div>
                <span class="text-[10px] text-muted-foreground">Isótopo 1</span>
                <p class="font-mono font-bold text-lg text-primary">{{ (sist2Result.f1 * 100).toFixed(2) }}%</p>
              </div>
              <div>
                <span class="text-[10px] text-muted-foreground">Isótopo 2</span>
                <p class="font-mono font-bold text-lg text-primary">{{ (sist2Result.f2 * 100).toFixed(2) }}%</p>
              </div>
            </div>
            <!-- Barra visual -->
            <div class="h-6 rounded-full overflow-hidden flex text-[9px] font-bold text-white">
              <div class="h-full flex items-center justify-center bg-primary/70" :style="{ width: (sist2Result.f1 * 100) + '%' }">{{ (sist2Result.f1*100).toFixed(1) }}%</div>
              <div class="h-full flex items-center justify-center bg-amber-500/70" :style="{ width: (sist2Result.f2 * 100) + '%' }">{{ (sist2Result.f2*100).toFixed(1) }}%</div>
            </div>
            <div class="border-t pt-3 space-y-1">
              <p v-for="(s, i) in sist2Steps" :key="i" class="text-sm font-mono" :class="i >= sist2Steps.length - 2 ? 'font-bold text-primary' : 'text-muted-foreground'">{{ s }}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Identificar elemento -->
      <Card v-if="activeCalc === 'identificar'">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">Identificar elemento por sumas</CardTitle>
          <p class="text-sm text-muted-foreground">Dado ΣA y ΣN de k isótopos, encuentra Z y el elemento.</p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="rounded-lg bg-muted/30 p-3 font-mono text-center text-sm">
            ΣA = k·Z + ΣN &nbsp; → &nbsp; Z = (ΣA - ΣN) / k
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="space-y-1">
              <Label class="text-xs">ΣA (suma de masas)</Label>
              <Input v-model="identEl.sumaA" type="number" step="any" placeholder="ej: 150" class="h-8 font-mono text-sm" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">ΣN (suma de neutrones)</Label>
              <Input v-model="identEl.sumaN" type="number" step="any" placeholder="ej: 66" class="h-8 font-mono text-sm" />
            </div>
            <div class="space-y-1">
              <Label class="text-xs">k (# isótopos)</Label>
              <Input v-model="identEl.numIsos" type="number" step="1" min="1" placeholder="3" class="h-8 font-mono text-sm" />
            </div>
          </div>
          <div v-if="identResult" class="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
            <div class="text-center">
              <span class="text-xs text-muted-foreground">Elemento identificado</span>
              <p class="text-4xl font-bold text-primary">{{ identResult.symbol }}</p>
              <p class="font-mono text-sm">Z = {{ identResult.Z }}</p>
            </div>
            <div class="border-t pt-2 space-y-1 font-mono text-sm text-muted-foreground">
              <p>ΣA = k·Z + ΣN</p>
              <p>{{ identEl.sumaA }} = {{ identResult.k }}·Z + {{ identEl.sumaN }}</p>
              <p>{{ identResult.k }}·Z = {{ identEl.sumaA }} - {{ identEl.sumaN }} = {{ parseFloat(identEl.sumaA) - parseFloat(identEl.sumaN) }}</p>
              <p class="font-bold text-primary">Z = {{ (parseFloat(identEl.sumaA) - parseFloat(identEl.sumaN)).toFixed(0) }} / {{ identResult.k }} = {{ identResult.Z }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- ═══════ TAREA 5 RESUELTA ═══════ -->
    <div v-if="activeSection === 'tarea5'" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        <!-- Lista -->
        <div class="space-y-1.5">
          <button
            v-for="t in tarea5" :key="t.id"
            class="w-full text-left rounded-lg border p-3 transition-all"
            :class="activeTarea === t.id ? 'ring-2 ring-primary bg-primary/5 border-primary/30' : 'hover:bg-muted/30'"
            @click="selectTarea(t.id)"
          >
            <div class="flex items-center gap-2">
              <span class="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{{ t.id }}</span>
              <span class="text-xs font-medium leading-snug">{{ t.titulo }}</span>
            </div>
          </button>
        </div>

        <!-- Detalle -->
        <Card v-if="tareaActual">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <Badge variant="secondary" class="text-[10px]">Pregunta {{ tareaActual.id }}</Badge>
              <Badge variant="outline" class="text-[10px] bg-green-500/10 text-green-600">100/100</Badge>
            </div>
            <CardTitle class="text-base mt-1">{{ tareaActual.titulo }}</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Enunciado -->
            <div class="rounded-lg bg-muted/30 p-4">
              <p class="text-sm leading-relaxed whitespace-pre-line">{{ tareaActual.enunciado }}</p>
            </div>
            <!-- Tabla de datos si existe -->
            <div v-if="tareaActual.tabla.length" class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="border-b bg-muted/30">
                    <th class="text-left py-2 px-3 font-medium">Isótopo</th>
                    <th class="text-left py-2 px-3 font-mono font-medium">Masa (uma)</th>
                    <th class="text-left py-2 px-3 font-mono font-medium">Abundancia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in tareaActual.tabla" :key="i" class="border-b border-border/50">
                    <td class="py-2 px-3 font-medium">{{ r.iso }}</td>
                    <td class="py-2 px-3 font-mono" :class="r.masa === '?' || r.masa === 'X' ? 'text-primary font-bold' : ''">{{ r.masa }}</td>
                    <td class="py-2 px-3 font-mono" :class="r.abundancia === '?' || r.abundancia.includes('x') || r.abundancia.includes('Y') ? 'text-primary font-bold' : ''">{{ r.abundancia }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pasos revelables -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Resolución paso a paso</span>
                <div class="flex gap-1.5">
                  <button
                    class="rounded-md border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                    :disabled="revealedTareaSteps >= tareaActual.pasos.length && showTareaResp"
                    @click="revealNextTarea"
                  >
                    {{ revealedTareaSteps >= tareaActual.pasos.length ? (showTareaResp ? 'Completo' : 'Ver respuesta') : 'Siguiente paso' }}
                  </button>
                  <button class="rounded-md border px-2.5 py-1 text-[10px] font-medium hover:bg-muted transition-colors"
                    @click="revealedTareaSteps = tareaActual.pasos.length; showTareaResp = true"
                  >Ver todo</button>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(paso, i) in tareaActual.pasos.slice(0, revealedTareaSteps)"
                  :key="i"
                  class="rounded-lg border p-3 bg-muted/5"
                >
                  <div class="flex items-center gap-2 mb-1.5">
                    <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{{ i + 1 }}</div>
                    <span class="text-xs font-semibold">{{ paso.t }}</span>
                  </div>
                  <pre class="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed pl-7">{{ paso.c }}</pre>
                </div>
              </div>
            </div>

            <!-- Respuesta final -->
            <div v-if="showTareaResp" class="rounded-xl border-2 border-green-400/30 bg-green-500/5 p-4 text-center">
              <span class="text-[10px] text-muted-foreground uppercase tracking-wide">Respuesta</span>
              <p class="font-mono font-bold text-xl text-green-600 mt-1">{{ tareaActual.respuesta }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

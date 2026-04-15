<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, RotateCcw, FlaskConical, Scale } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// TAB 1: Clasificación de la materia — Quiz
// ──────────────────────────────────────────────
const clasificacionItems = [
  { nombre: 'H₂O', tipo: 'compuesto', hint: 'Dos elementos H y O en proporción fija' },
  { nombre: 'Agua salada', tipo: 'mezcla-homogenea', hint: 'Mezcla uniforme, no se distinguen componentes' },
  { nombre: 'Fe (hierro)', tipo: 'elemento', hint: 'Un solo tipo de átomo' },
  { nombre: 'Arena y agua', tipo: 'mezcla-heterogenea', hint: 'Se distinguen dos fases claramente' },
  { nombre: 'Aire', tipo: 'mezcla-homogenea', hint: 'N₂, O₂, Ar… mezclados uniformemente' },
  { nombre: 'NaCl', tipo: 'compuesto', hint: 'Na y Cl en proporción 1:1' },
  { nombre: 'O₂', tipo: 'elemento', hint: 'Solo átomos de oxígeno' },
  { nombre: 'Vinagre', tipo: 'mezcla-homogenea', hint: 'Ácido acético + agua, uniforme' },
  { nombre: 'Granito', tipo: 'mezcla-heterogenea', hint: 'Minerales visibles distintos' },
  { nombre: 'CO₂', tipo: 'compuesto', hint: 'C y O en proporción fija 1:2' },
  { nombre: 'N₂', tipo: 'elemento', hint: 'Solo átomos de nitrógeno enlazados' },
  { nombre: 'Mezcla de arena y hierro', tipo: 'mezcla-heterogenea', hint: 'Dos componentes separables' },
]

const tiposClasificacion = [
  { id: 'elemento', label: 'Elemento', color: 'bg-blue-500' },
  { id: 'compuesto', label: 'Compuesto', color: 'bg-green-500' },
  { id: 'mezcla-homogenea', label: 'Mezcla Homogénea', color: 'bg-purple-500' },
  { id: 'mezcla-heterogenea', label: 'Mezcla Heterogénea', color: 'bg-orange-500' },
]

const quizIndex = ref(0)
const quizRespuesta = ref(null)
const quizFeedback = ref(null)
const quizScore = ref(0)
const quizShuffled = ref([...clasificacionItems].sort(() => Math.random() - 0.5))

const quizActual = computed(() => quizShuffled.value[quizIndex.value])
const quizTerminado = computed(() => quizIndex.value >= quizShuffled.value.length)

function responderClasificacion(tipo) {
  if (quizRespuesta.value !== null) return
  quizRespuesta.value = tipo
  const correcto = tipo === quizActual.value.tipo
  quizFeedback.value = correcto ? 'correct' : 'wrong'
  if (correcto) quizScore.value++
  setTimeout(() => {
    quizIndex.value++
    quizRespuesta.value = null
    quizFeedback.value = null
  }, 1400)
}

function reiniciarQuiz() {
  quizShuffled.value = [...clasificacionItems].sort(() => Math.random() - 0.5)
  quizIndex.value = 0
  quizRespuesta.value = null
  quizFeedback.value = null
  quizScore.value = 0
}

// ──────────────────────────────────────────────
// TAB 2: Propiedades — Calculadora
// ──────────────────────────────────────────────
const propMode = ref('densidad')
const propModes = [
  { id: 'densidad', label: 'Densidad (ρ = m/V)' },
  { id: 'ge', label: 'Gravedad Específica' },
]

const densM = ref('')
const densV = ref('')
const densRho = ref('')

const densResultado = computed(() => {
  const m = parseFloat(densM.value)
  const v = parseFloat(densV.value)
  const rho = parseFloat(densRho.value)
  const filled = [densM.value, densV.value, densRho.value].filter(x => x !== '').length
  if (filled !== 2) return null
  if (densM.value === '') return { variable: 'masa (m)', value: (rho * v).toFixed(4), unit: 'g', formula: `ρ × V = ${rho} × ${v}` }
  if (densV.value === '') return { variable: 'volumen (V)', value: (m / rho).toFixed(4), unit: 'mL', formula: `m / ρ = ${m} / ${rho}` }
  if (densRho.value === '') return { variable: 'densidad (ρ)', value: (m / v).toFixed(4), unit: 'g/mL', formula: `m / V = ${m} / ${v}` }
  return null
})

const geRhoSust = ref('')
const geRhoAgua = ref('0.9982')
const geResult = computed(() => {
  const rs = parseFloat(geRhoSust.value)
  const ra = parseFloat(geRhoAgua.value)
  if (!rs || !ra) return null
  const ge = rs / ra
  return {
    ge: ge.toFixed(4),
    flotacion: ge < 1 ? 'Flota en agua (GE < 1)' : ge > 1 ? 'Se hunde en agua (GE > 1)' : 'Mismo punto que el agua (GE = 1)',
    clase: ge < 1 ? 'text-blue-600' : ge > 1 ? 'text-red-600' : 'text-green-600'
  }
})

// ──────────────────────────────────────────────
// TAB 3: Soluciones — Calculadora
// ──────────────────────────────────────────────
const solMode = ref('pmm')
const solModes = [
  { id: 'pmm', label: '% m/m' },
  { id: 'pvv', label: '% v/v' },
  { id: 'dilucion', label: 'Dilución C₁V₁=C₂V₂' },
]

// %m/m
const mmMsoluto = ref('')
const mmMsolucion = ref('')
const mmPorcentaje = ref('')
const mmResult = computed(() => {
  const ms = parseFloat(mmMsoluto.value)
  const mt = parseFloat(mmMsolucion.value)
  const p = parseFloat(mmPorcentaje.value)
  const filled = [mmMsoluto.value, mmMsolucion.value, mmPorcentaje.value].filter(x => x !== '').length
  if (filled !== 2) return null
  if (mmMsoluto.value === '') return { variable: 'm_soluto', value: ((p / 100) * mt).toFixed(4), unit: 'g', formula: `(% / 100) × m_sol = (${p}/100) × ${mt}` }
  if (mmMsolucion.value === '') return { variable: 'm_solución', value: (ms / (p / 100)).toFixed(4), unit: 'g', formula: `m_soluto / (% / 100) = ${ms} / ${p / 100}` }
  if (mmPorcentaje.value === '') return { variable: '% m/m', value: ((ms / mt) * 100).toFixed(2), unit: '%', formula: `(m_soluto / m_sol) × 100 = (${ms}/${mt}) × 100` }
  return null
})

// %v/v
const vvVsoluto = ref('')
const vvVsolucion = ref('')
const vvPorcentaje = ref('')
const vvResult = computed(() => {
  const vs = parseFloat(vvVsoluto.value)
  const vt = parseFloat(vvVsolucion.value)
  const p = parseFloat(vvPorcentaje.value)
  const filled = [vvVsoluto.value, vvVsolucion.value, vvPorcentaje.value].filter(x => x !== '').length
  if (filled !== 2) return null
  if (vvVsoluto.value === '') return { variable: 'V_soluto', value: ((p / 100) * vt).toFixed(4), unit: 'mL', formula: `(% / 100) × V_sol` }
  if (vvVsolucion.value === '') return { variable: 'V_solución', value: (vs / (p / 100)).toFixed(4), unit: 'mL', formula: `V_soluto / (% / 100)` }
  if (vvPorcentaje.value === '') return { variable: '% v/v', value: ((vs / vt) * 100).toFixed(2), unit: '%', formula: `(V_soluto / V_sol) × 100` }
  return null
})

// Dilución
const dilC1 = ref('')
const dilV1 = ref('')
const dilC2 = ref('')
const dilV2 = ref('')
const dilResult = computed(() => {
  const c1 = parseFloat(dilC1.value)
  const v1 = parseFloat(dilV1.value)
  const c2 = parseFloat(dilC2.value)
  const v2 = parseFloat(dilV2.value)
  const filled = [dilC1.value, dilV1.value, dilC2.value, dilV2.value].filter(x => x !== '').length
  if (filled !== 3) return null
  if (dilC1.value === '') return { variable: 'C₁', value: (c2 * v2 / v1).toFixed(4), unit: '(mismas que C₂)', formula: `C₂ × V₂ / V₁ = ${c2} × ${v2} / ${v1}` }
  if (dilV1.value === '') return { variable: 'V₁', value: (c2 * v2 / c1).toFixed(4), unit: 'mL', formula: `C₂ × V₂ / C₁ = ${c2} × ${v2} / ${c1}` }
  if (dilC2.value === '') return { variable: 'C₂', value: (c1 * v1 / v2).toFixed(4), unit: '(mismas que C₁)', formula: `C₁ × V₁ / V₂ = ${c1} × ${v1} / ${v2}` }
  if (dilV2.value === '') return { variable: 'V₂', value: (c1 * v1 / c2).toFixed(4), unit: 'mL', formula: `C₁ × V₁ / C₂ = ${c1} × ${v1} / ${c2}` }
  return null
})

function clearField(obj, key) { obj[key] = '' }
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Materia</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 1.3 — Clasificación, propiedades y soluciones</p>
    </div>

    <Tabs default-value="quiz">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="quiz">Clasifica la Materia</TabsTrigger>
        <TabsTrigger value="propiedades">Propiedades</TabsTrigger>
        <TabsTrigger value="soluciones">Soluciones</TabsTrigger>
        <TabsTrigger value="referencia">Referencia</TabsTrigger>
      </TabsList>

      <!-- ── QUIZ DE CLASIFICACIÓN ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Selecciona el tipo correcto para cada sustancia.</p>

        <div v-if="!quizTerminado">
          <Card class="border-2" :class="{
            'border-green-400': quizFeedback === 'correct',
            'border-red-400': quizFeedback === 'wrong',
            'border-border': !quizFeedback
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ quizIndex + 1 }} / {{ quizShuffled.length }}</Badge>
                <span class="text-sm font-medium text-muted-foreground">✓ {{ quizScore }}</span>
              </div>
              <CardTitle class="text-2xl text-center py-4 font-mono">{{ quizActual.nombre }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="grid grid-cols-2 gap-2">
                <Button
                  v-for="t in tiposClasificacion"
                  :key="t.id"
                  :variant="quizRespuesta === t.id
                    ? (t.id === quizActual.tipo ? 'default' : 'destructive')
                    : quizFeedback && t.id === quizActual.tipo
                      ? 'default'
                      : 'outline'"
                  :disabled="quizRespuesta !== null"
                  class="h-12 text-sm"
                  @click="responderClasificacion(t.id)"
                >
                  {{ t.label }}
                </Button>
              </div>
              <p v-if="quizFeedback" class="text-center text-sm mt-2" :class="quizFeedback === 'correct' ? 'text-green-600' : 'text-red-600'">
                <span v-if="quizFeedback === 'correct'">✓ ¡Correcto! </span>
                <span v-else>✗ Era: {{ tiposClasificacion.find(t => t.id === quizActual.tipo)?.label }}. </span>
                {{ quizActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="quizScore / quizShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ quizScore }} / {{ quizShuffled.length }}
            </p>
            <p class="text-muted-foreground">
              {{ quizScore / quizShuffled.length >= 0.9 ? '¡Excelente dominio!' : quizScore / quizShuffled.length >= 0.7 ? '¡Buen trabajo!' : 'Repasa la clasificación de la materia.' }}
            </p>
            <Button @click="reiniciarQuiz" class="gap-2">
              <RotateCcw class="size-4" />
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── PROPIEDADES CALCULADORA ── -->
      <TabsContent value="propiedades" class="mt-4 space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="m in propModes"
            :key="m.id"
            :variant="propMode === m.id ? 'default' : 'outline'"
            size="sm"
            @click="propMode = m.id"
          >
            {{ m.label }}
          </Button>
        </div>

        <!-- Densidad -->
        <Card v-if="propMode === 'densidad'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <Scale class="size-4" /> Densidad — ρ = m / V
            </CardTitle>
            <CardDescription>Deja en blanco la variable a calcular. Ingresa exactamente 2 valores.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">Masa m (g)</label>
                <input v-model="densM" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Volumen V (mL)</label>
                <input v-model="densV" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Densidad ρ (g/mL)</label>
                <input v-model="densRho" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div v-if="densResultado" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p class="text-xs text-muted-foreground font-mono">{{ densResultado.formula }}</p>
              <p class="text-xl font-bold font-mono text-primary">
                {{ densResultado.variable }} = {{ densResultado.value }} {{ densResultado.unit }}
              </p>
            </div>
            <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 2 de las 3 variables.</p>
          </CardContent>
        </Card>

        <!-- Gravedad Específica -->
        <Card v-if="propMode === 'ge'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base flex items-center gap-2">
              <FlaskConical class="size-4" /> Gravedad Específica — GE = ρ_sust / ρ_agua
            </CardTitle>
            <CardDescription>La GE es adimensional. Se compara con ρ_agua a la misma temperatura.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-sm font-medium">ρ sustancia (g/mL)</label>
                <input v-model="geRhoSust" type="number" step="any" placeholder="ej. 0.789"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">ρ agua (g/mL)</label>
                <input v-model="geRhoAgua" type="number" step="any" placeholder="0.9982"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div v-if="geResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p class="text-xl font-bold font-mono text-primary">GE = {{ geResult.ge }}</p>
              <p class="text-sm font-medium" :class="geResult.clase">{{ geResult.flotacion }}</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── SOLUCIONES CALCULADORA ── -->
      <TabsContent value="soluciones" class="mt-4 space-y-4">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="m in solModes"
            :key="m.id"
            :variant="solMode === m.id ? 'default' : 'outline'"
            size="sm"
            @click="solMode = m.id"
          >
            {{ m.label }}
          </Button>
        </div>

        <!-- %m/m -->
        <Card v-if="solMode === 'pmm'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">% m/m = (m_soluto / m_solución) × 100</CardTitle>
            <CardDescription>Deja en blanco la variable a calcular.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">m soluto (g)</label>
                <input v-model="mmMsoluto" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">m solución (g)</label>
                <input v-model="mmMsolucion" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">% m/m</label>
                <input v-model="mmPorcentaje" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div v-if="mmResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p class="text-xs font-mono text-muted-foreground">{{ mmResult.formula }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ mmResult.variable }} = {{ mmResult.value }} {{ mmResult.unit }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- %v/v -->
        <Card v-if="solMode === 'pvv'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">% v/v = (V_soluto / V_solución) × 100</CardTitle>
            <CardDescription>Deja en blanco la variable a calcular.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1">
                <label class="text-sm font-medium">V soluto (mL)</label>
                <input v-model="vvVsoluto" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">V solución (mL)</label>
                <input v-model="vvVsolucion" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">% v/v</label>
                <input v-model="vvPorcentaje" type="number" step="any" placeholder="vacío = calcular"
                  class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div v-if="vvResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p class="text-xs font-mono text-muted-foreground">{{ vvResult.formula }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ vvResult.variable }} = {{ vvResult.value }} {{ vvResult.unit }}</p>
            </div>
          </CardContent>
        </Card>

        <!-- Dilución -->
        <Card v-if="solMode === 'dilucion'">
          <CardHeader class="pb-2">
            <CardTitle class="text-base">Dilución — C₁V₁ = C₂V₂</CardTitle>
            <CardDescription>Principio de conservación de moles. Deja en blanco la variable a calcular.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-3 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Solución madre (inicial)</p>
                <div class="space-y-1">
                  <label class="text-sm font-medium">C₁ (concentración inicial)</label>
                  <input v-model="dilC1" type="number" step="any" placeholder="vacío = calcular"
                    class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium">V₁ (volumen inicial, mL)</label>
                  <input v-model="dilV1" type="number" step="any" placeholder="vacío = calcular"
                    class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div class="space-y-3 border rounded p-3">
                <p class="text-xs font-semibold text-muted-foreground uppercase">Solución diluida (final)</p>
                <div class="space-y-1">
                  <label class="text-sm font-medium">C₂ (concentración final)</label>
                  <input v-model="dilC2" type="number" step="any" placeholder="vacío = calcular"
                    class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div class="space-y-1">
                  <label class="text-sm font-medium">V₂ (volumen final, mL)</label>
                  <input v-model="dilV2" type="number" step="any" placeholder="vacío = calcular"
                    class="w-full rounded border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
            <div v-if="dilResult" class="bg-primary/10 border border-primary/20 rounded p-3 space-y-1">
              <p class="text-xs font-mono text-muted-foreground">{{ dilResult.formula }}</p>
              <p class="text-xl font-bold text-primary font-mono">{{ dilResult.variable }} = {{ dilResult.value }} {{ dilResult.unit }}</p>
            </div>
            <p v-else class="text-xs text-muted-foreground">Ingresa exactamente 3 de las 4 variables.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── REFERENCIA ── -->
      <TabsContent value="referencia" class="mt-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Clasificación de la materia</CardTitle></CardHeader>
            <CardContent class="text-sm space-y-1 font-mono text-muted-foreground">
              <p><span class="text-foreground font-semibold">Materia</span></p>
              <p class="pl-4">├── <span class="text-blue-600">Sustancias Puras</span></p>
              <p class="pl-8">├── Elementos (un tipo de átomo)</p>
              <p class="pl-8">└── Compuestos (elementos en prop. fija)</p>
              <p class="pl-4">└── <span class="text-orange-600">Mezclas</span></p>
              <p class="pl-8">├── Homogéneas — uniformes</p>
              <p class="pl-8">└── Heterogéneas — no uniformes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Fórmulas clave</CardTitle></CardHeader>
            <CardContent class="space-y-2 text-sm font-mono">
              <div class="bg-muted rounded p-2">ρ = m / V</div>
              <div class="bg-muted rounded p-2">GE = ρ_sust / ρ_agua</div>
              <div class="bg-muted rounded p-2">%(m/m) = (m_sol / m_total) × 100</div>
              <div class="bg-muted rounded p-2">%(v/v) = (V_sol / V_total) × 100</div>
              <div class="bg-muted rounded p-2">C₁V₁ = C₂V₂  (dilución)</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Propiedades intensivas vs extensivas</CardTitle></CardHeader>
            <CardContent class="text-sm space-y-2">
              <div class="flex gap-2">
                <Badge>Intensivas</Badge>
                <span class="text-muted-foreground">No dependen de la cantidad: densidad, T, concentración, GE</span>
              </div>
              <div class="flex gap-2">
                <Badge variant="secondary">Extensivas</Badge>
                <span class="text-muted-foreground">Dependen de la cantidad: masa, volumen, energía</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader class="pb-2"><CardTitle class="text-sm">Geometrías para densidad</CardTitle></CardHeader>
            <CardContent class="space-y-1 text-sm font-mono">
              <div class="bg-muted rounded p-1.5">Cubo: V = l³</div>
              <div class="bg-muted rounded p-1.5">Paralelepípedo: V = l × a × h</div>
              <div class="bg-muted rounded p-1.5">Cilindro: V = π r² h</div>
              <div class="bg-muted rounded p-1.5">Esfera: V = (4/3) π r³</div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

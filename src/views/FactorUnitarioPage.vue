<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-vue-next'
import { problemasMezclas } from '@/data/problemasMezclasData.js'

// ─── Problemas resueltos con cadena animada ───
const problemaActivo = ref(0)
const pasoVisible = ref(0)
const problema = computed(() => problemasMezclas[problemaActivo.value])

function siguientePaso() {
  if (pasoVisible.value < problema.value.cadena.length - 1) {
    pasoVisible.value++
  }
}
function seleccionarProblema(idx) {
  problemaActivo.value = idx
  pasoVisible.value = 0
}
function mostrarTodo() {
  pasoVisible.value = problema.value.cadena.length - 1
}
function reiniciarPasos() {
  pasoVisible.value = 0
}

const categoriaColores = {
  molaridad: 'bg-blue-100 text-blue-700 border-blue-200',
  densidad: 'bg-orange-100 text-orange-700 border-orange-200',
  dilucion: 'bg-purple-100 text-purple-700 border-purple-200',
  porcentaje: 'bg-green-100 text-green-700 border-green-200',
  ppm: 'bg-teal-100 text-teal-700 border-teal-200',
  conversion: 'bg-pink-100 text-pink-700 border-pink-200',
  integrador: 'bg-red-100 text-red-700 border-red-200',
}

// ─── Teoría ───
const conceptos = [
  {
    titulo: '¿Qué es el factor unitario?',
    desc: 'Es una fracción igual a 1 que se construye a partir de una equivalencia conocida. Al multiplicar por él, la unidad indeseada se cancela (aparece en denominador) y aparece la nueva unidad en el numerador.',
    ejemplo: '1 km = 1000 m  →  Factor: (1000 m / 1 km) = 1',
    uso: 'Convierte 5 km a metros: 5 km × (1000 m / 1 km) = 5000 m'
  },
  {
    titulo: 'Análisis dimensional',
    desc: 'Técnica que rastrean las unidades como factores algebraicos a lo largo de todo el cálculo. Permite verificar que el resultado tiene las unidades correctas.',
    ejemplo: 'g_sol × (g_soluto / g_sol) × (mol / g_soluto) = mol ✓',
    uso: 'Si las unidades no cancelan correctamente, el planteamiento está mal.'
  },
  {
    titulo: 'Cadena de factores',
    desc: 'Se pueden encadenar varios factores unitarios en una sola operación. Cada factor cancela las unidades del anterior y añade las nuevas. El resultado es el producto de todos los numeradores dividido entre el producto de todos los denominadores.',
    ejemplo: 'dato × F₁ × F₂ × F₃ = resultado',
    uso: 'Ver los problemas de la pestaña "Problemas".'
  },
  {
    titulo: 'Factores unitarios en soluciones',
    desc: 'Las propiedades de las soluciones se usan directamente como factores: densidad (g/mL), %m/m (g_soluto/g_sol), %v/v (mL_soluto/mL_sol), molaridad (mol/L). Cada uno puede usarse "al derecho" o "al revés" (invertido).',
    ejemplo: 'ρ = 1.19 g/mL → factor: (1.19 g sol / 1 mL) o (1 mL / 1.19 g sol)',
    uso: 'Se elige según cuál unidad necesitas cancelar.'
  },
]

// ─── Quiz de factor unitario ───
const preguntas = [
  {
    texto: 'Para convertir de mL a L usando el factor unitario, ¿qué fracción usas?',
    opciones: ['(1000 mL / 1 L)', '(1 L / 1000 mL)', '(1 mL / 1 L)', '(100 mL / 1 L)'],
    correcta: '(1 L / 1000 mL)',
    hint: 'La unidad a eliminar (mL) va en el denominador. 1 L = 1000 mL → factor: (1 L / 1000 mL).'
  },
  {
    texto: 'Una solución es 20% m/m de NaOH. Como factor unitario, esto se expresa como:',
    opciones: ['(20 g NaOH / 100 g solución)', '(20 mL NaOH / 100 mL solución)', '(1 mol NaOH / 20 g)', '(20 g solución / 100 g NaOH)'],
    correcta: '(20 g NaOH / 100 g solución)',
    hint: '%m/m = g de soluto por cada 100 g de solución total.'
  },
  {
    texto: 'Si ρ = 1.22 g/mL, ¿qué factor unitario uso para convertir mL de solución a gramos de solución?',
    opciones: ['(1 mL / 1.22 g)', '(1.22 g / 1 mL)', '(1.22 mL / 1 g)', '(1 g / 1.22 mL)'],
    correcta: '(1.22 g / 1 mL)',
    hint: 'ρ = g/mL → (1.22 g sol / 1 mL). La mL se cancela, queda en gramos.'
  },
  {
    texto: 'Para convertir g de soluto a moles usando MM = 58.44 g/mol (NaCl), el factor es:',
    opciones: ['(58.44 g / 1 mol)', '(1 mol / 58.44 g)', '(58.44 mol / 1 g)', '(1 g / 58.44 mol)'],
    correcta: '(1 mol / 58.44 g)',
    hint: 'Quiero pasar de gramos a moles: g × (1 mol / 58.44 g) = mol. Los gramos se cancelan.'
  },
  {
    texto: 'Una solución es 3.0 M (mol/L). Para convertir L a moles, el factor es:',
    opciones: ['(1 L / 3.0 mol)', '(3.0 mol / 1 L)', '(3.0 L / 1 mol)', '(1 mol / 3.0 L)'],
    correcta: '(3.0 mol / 1 L)',
    hint: 'Molaridad 3.0 M = 3.0 mol por litro → factor: (3.0 mol / 1 L). Los litros se cancelan.'
  },
  {
    texto: 'Para ir de "g de solución" a "g de soluto" con 37% m/m, el factor invertido es:',
    opciones: ['(100 g sol / 37 g HCl)', '(37 g HCl / 100 g sol)', '(37 mol / 100 g)', '(100 mL / 37 g)'],
    correcta: '(37 g HCl / 100 g sol)',
    hint: '37% m/m = 37 g de soluto por 100 g de solución. Coloca g sol en el denominador para cancelarlos.'
  },
  {
    texto: '¿Cuál es la ventaja principal del análisis dimensional frente a simplemente usar fórmulas?',
    opciones: [
      'Es más rápido siempre',
      'Permite verificar que las unidades del resultado son correctas antes de calcular',
      'No requiere conocer las equivalencias',
      'Solo funciona para conversiones de longitud'
    ],
    correcta: 'Permite verificar que las unidades del resultado son correctas antes de calcular',
    hint: 'El análisis dimensional actúa como una "prueba de coherencia": si las unidades no cancelan bien, el planteamiento está mal.'
  },
  {
    texto: '¿Cuántos g de HCl hay en 250 mL de HCl 2.0 M? (MM_HCl = 36.46 g/mol) — Elige la cadena correcta:',
    opciones: [
      '250 mL × (1 L/1000 mL) × (2.0 mol/L) × (36.46 g/mol) = 18.23 g',
      '250 mL × (2.0 mol/L) × (36.46 g/mol) = 18230 g',
      '250 × 2.0 × 36.46 / 1000 = 18.23 g (directamente sin unidades)',
      '250 mL × (36.46 g/mol) / 2.0 = 4557.5 g'
    ],
    correcta: '250 mL × (1 L/1000 mL) × (2.0 mol/L) × (36.46 g/mol) = 18.23 g',
    hint: 'La cadena correcta convierte mL→L→mol→g. Solo esa cadena cancela todas las unidades intermedias correctamente.'
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
function reiniciarQuiz() {
  qShuffled.value = [...preguntas].sort(() => Math.random() - 0.5)
  qIdx.value = 0; qResp.value = null; qScore.value = 0
}

const pasosEstrategia = [
  'Identificar el dato de partida y su unidad',
  'Identificar la unidad del resultado (incógnita)',
  "Construir un 'camino' de unidades: dato → U₁ → U₂ → … → resultado",
  'Para cada paso, escribir el factor unitario que cancela la unidad anterior',
  'Multiplicar todos los numeradores y dividir entre todos los denominadores',
  'Verificar que las unidades del resultado son correctas',
]

// ─── Categorías de problemas ───
const categoriaFiltro = ref('todos')
const categorias = ['todos', 'molaridad', 'densidad', 'dilucion', 'porcentaje', 'ppm', 'conversion', 'integrador']
const problemasFiltrados = computed(() =>
  categoriaFiltro.value === 'todos'
    ? problemasMezclas
    : problemasMezclas.filter(p => p.categoria === categoriaFiltro.value)
)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Factor Unitario y Análisis Dimensional</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Unidad 1.2 — Resolución de problemas de mezclas y soluciones con cadenas de factores
      </p>
    </div>

    <Tabs default-value="problemas">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="problemas">Problemas Resueltos</TabsTrigger>
        <TabsTrigger value="teoria">Teoría</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>

      <!-- ── PROBLEMAS RESUELTOS ── -->
      <TabsContent value="problemas" class="mt-4 space-y-4">
        <!-- Filtro de categoría -->
        <div class="flex flex-wrap gap-1.5">
          <Button
            v-for="cat in categorias" :key="cat"
            :variant="categoriaFiltro === cat ? 'default' : 'outline'"
            size="sm"
            @click="categoriaFiltro = cat; if(problemasFiltrados.length > 0) seleccionarProblema(problemasMezclas.indexOf(problemasFiltrados[0]))"
          >
            {{ cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1) }}
          </Button>
        </div>

        <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
          <!-- Lista de problemas -->
          <div class="space-y-2">
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Problemas ({{ problemasFiltrados.length }})
            </p>
            <div class="space-y-1.5">
              <button
                v-for="(p, idx) in problemasFiltrados"
                :key="p.id"
                class="w-full text-left rounded border p-3 hover:border-primary/50 transition-colors text-sm"
                :class="problemaActivo === problemasMezclas.indexOf(p) ? 'border-primary bg-primary/5' : ''"
                @click="seleccionarProblema(problemasMezclas.indexOf(p))"
              >
                <div class="flex items-start gap-2">
                  <Badge variant="outline" class="font-mono text-xs shrink-0 mt-0.5">{{ p.id }}</Badge>
                  <div>
                    <p class="font-medium leading-tight">{{ p.titulo }}</p>
                    <Badge
                      variant="outline"
                      class="text-xs mt-1 border"
                      :class="categoriaColores[p.categoria] ?? 'bg-muted'"
                    >{{ p.categoria }}</Badge>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Problema activo con cadena paso a paso -->
          <div class="space-y-4 min-w-0">
            <Card>
              <CardHeader class="pb-3">
                <div class="flex items-start gap-2 flex-wrap">
                  <Badge class="font-mono shrink-0">Problema {{ problema.id }}</Badge>
                  <Badge
                    variant="outline"
                    class="border shrink-0"
                    :class="categoriaColores[problema.categoria] ?? 'bg-muted'"
                  >{{ problema.categoria }}</Badge>
                </div>
                <CardTitle class="text-base mt-2">{{ problema.titulo }}</CardTitle>
                <CardDescription class="text-sm mt-1 leading-relaxed">
                  {{ problema.enunciado }}
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <!-- Datos e incógnita -->
                <div class="grid gap-2 sm:grid-cols-2">
                  <div class="bg-muted/50 rounded p-3">
                    <p class="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Datos</p>
                    <ul class="space-y-0.5">
                      <li v-for="dato in problema.datos" :key="dato" class="text-sm font-mono">• {{ dato }}</li>
                    </ul>
                  </div>
                  <div class="bg-primary/5 border border-primary/20 rounded p-3">
                    <p class="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Incógnita</p>
                    <p class="text-sm font-mono font-bold text-primary">{{ problema.incognita }}</p>
                  </div>
                </div>

                <!-- Cadena de factores paso a paso -->
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <p class="text-xs font-semibold text-muted-foreground uppercase">Cadena de factores</p>
                    <div class="flex gap-2">
                      <Button variant="ghost" size="sm" class="h-7 text-xs gap-1" @click="reiniciarPasos">
                        <RotateCcw class="size-3" /> Reset
                      </Button>
                      <Button variant="ghost" size="sm" class="h-7 text-xs" @click="mostrarTodo">
                        Ver todo
                      </Button>
                    </div>
                  </div>

                  <!-- Cadena visual -->
                  <div class="overflow-x-auto pb-2">
                    <div class="flex items-center gap-1 min-w-max">
                      <template v-for="(paso, i) in problema.cadena" :key="i">
                        <!-- Paso visible -->
                        <template v-if="i <= pasoVisible">
                          <!-- Dato inicial -->
                          <div v-if="i === 0" class="flex flex-col items-center">
                            <div class="bg-primary text-primary-foreground rounded px-3 py-2 text-sm font-mono font-bold whitespace-nowrap">
                              {{ paso.valor }}
                            </div>
                            <p class="text-xs text-muted-foreground mt-1 max-w-20 text-center leading-tight">{{ paso.descripcion }}</p>
                          </div>

                          <!-- Factor unitario -->
                          <template v-if="i > 0 && paso.factor">
                            <ChevronRight class="size-4 text-muted-foreground shrink-0" />
                            <div class="flex flex-col items-center">
                              <div class="border-2 border-primary rounded px-3 py-1 text-center bg-background">
                                <!-- Cancelación de unidad anterior -->
                                <div v-if="paso.cancelaAnterior" class="text-xs text-red-500 line-through font-mono mb-0.5">
                                  {{ paso.cancelaAnterior }}
                                </div>
                                <!-- Numerador -->
                                <div class="text-sm font-mono font-semibold text-green-700 whitespace-nowrap">
                                  {{ paso.factor.num }}
                                </div>
                                <div class="border-t border-muted-foreground/40 my-0.5" />
                                <!-- Denominador -->
                                <div class="text-sm font-mono text-red-600 whitespace-nowrap">
                                  {{ paso.factor.den }}
                                </div>
                              </div>
                              <p class="text-xs text-muted-foreground mt-1 max-w-28 text-center leading-tight">{{ paso.descripcion }}</p>
                            </div>
                          </template>
                        </template>

                        <!-- Paso oculto (placeholder) -->
                        <template v-else-if="i === pasoVisible + 1">
                          <ChevronRight class="size-4 text-muted-foreground/30 shrink-0" />
                          <div class="border-2 border-dashed border-muted-foreground/30 rounded px-6 py-3 text-muted-foreground/30 text-sm">
                            ?
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>

                  <!-- Botón siguiente paso -->
                  <Button
                    v-if="pasoVisible < problema.cadena.length - 1"
                    variant="outline"
                    class="gap-2 w-full sm:w-auto"
                    @click="siguientePaso"
                  >
                    <ArrowRight class="size-4" />
                    Siguiente factor ({{ pasoVisible + 1 }} / {{ problema.cadena.length - 1 }})
                  </Button>

                  <!-- Resultado final -->
                  <div v-if="pasoVisible === problema.cadena.length - 1" class="bg-green-50 border border-green-200 rounded p-3 space-y-1">
                    <p class="text-xs font-semibold text-green-700 uppercase">Resultado</p>
                    <p class="text-xs font-mono text-muted-foreground">{{ problema.resultado }}</p>
                    <p class="text-base font-bold text-green-700 font-mono">✓ {{ problema.respuesta }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <!-- ── TEORÍA ── -->
      <TabsContent value="teoria" class="mt-4 space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <Card v-for="c in conceptos" :key="c.titulo">
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">{{ c.titulo }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2 text-sm">
              <p class="text-muted-foreground">{{ c.desc }}</p>
              <div class="bg-muted rounded p-2 font-mono text-xs space-y-0.5">
                <p class="text-muted-foreground">Ejemplo:</p>
                <p>{{ c.ejemplo }}</p>
              </div>
              <p class="text-xs border-l-2 border-primary pl-2 text-muted-foreground italic">{{ c.uso }}</p>
            </CardContent>
          </Card>
        </div>

        <!-- Tabla de factores comunes en soluciones -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Factores unitarios comunes en problemas de soluciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="overflow-x-auto">
              <table class="w-full text-sm border-collapse">
                <thead class="bg-muted/40">
                  <tr>
                    <th class="text-left py-2 px-3 font-medium">Propiedad</th>
                    <th class="text-left py-2 px-3 font-medium">Factor "al derecho"</th>
                    <th class="text-left py-2 px-3 font-medium">Factor "al revés"</th>
                    <th class="text-left py-2 px-3 font-medium hidden sm:table-cell">Uso</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="f in [
                    { prop: 'Densidad (ρ)', d: 'ρ g sol / 1 mL', r: '1 mL / ρ g sol', uso: 'mL→g (D) | g→mL (R)' },
                    { prop: '% m/m', d: 'x g soluto / 100 g sol', r: '100 g sol / x g soluto', uso: 'g sol→g soluto (D) | g soluto→g sol (R)' },
                    { prop: '% v/v', d: 'x mL soluto / 100 mL sol', r: '100 mL sol / x mL soluto', uso: 'mL sol→mL soluto (D)' },
                    { prop: 'Molaridad (M)', d: 'M mol / 1 L', r: '1 L / M mol', uso: 'L→mol (D) | mol→L (R)' },
                    { prop: 'Masa molar (MM)', d: 'MM g / 1 mol', r: '1 mol / MM g', uso: 'mol→g (D) | g→mol (R)' },
                    { prop: 'ppm (acuoso)', d: '1 mg soluto / 1 L', r: '1 L / 1 mg soluto', uso: 'L→mg (D)' },
                  ]" :key="f.prop">
                    <td class="py-2 px-3 font-medium">{{ f.prop }}</td>
                    <td class="py-2 px-3 font-mono text-xs text-green-700">{{ f.d }}</td>
                    <td class="py-2 px-3 font-mono text-xs text-red-600">{{ f.r }}</td>
                    <td class="py-2 px-3 text-xs text-muted-foreground hidden sm:table-cell">{{ f.uso }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-xs text-muted-foreground mt-2 italic">
              D = "al derecho", R = "al revés" (invertido). Eliges según qué unidad necesitas cancelar.
            </p>
          </CardContent>
        </Card>

        <!-- Estrategia para resolver -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Estrategia general de resolución</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <div v-for="(paso, i) in pasosEstrategia" :key="i" class="flex gap-2 items-start text-sm">
              <div class="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{{ i + 1 }}</div>
              <span class="text-muted-foreground pt-0.5">{{ paso }}</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Preguntas sobre factor unitario aplicado a soluciones y mezclas.</p>

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
              <CardTitle class="text-base mt-2">{{ qActual.texto }}</CardTitle>
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
                <span v-if="qResp === qActual.correcta">✓ Correcto. </span>
                <span v-else>✗ La respuesta correcta era: <strong class="font-mono">{{ qActual.correcta }}</strong>. </span>
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
              {{ qScore / qShuffled.length >= 0.875 ? '¡Dominas el factor unitario!' : qScore / qShuffled.length >= 0.625 ? '¡Buen trabajo! Repasa los problemas resueltos.' : 'Revisa la teoría y los ejemplos.' }}
            </p>
            <Button @click="reiniciarQuiz" class="gap-2">
              <RotateCcw class="size-4" /> Reintentar
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

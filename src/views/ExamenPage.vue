<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Timer, Trophy, RotateCcw, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, BookOpen
} from 'lucide-vue-next'
import { quizQuestions } from '@/data/quizData.js'
import { useProgress } from '@/composables/useProgress.js'

const { registrarQuiz } = useProgress()

// ──────────────────────────────────────────────
// Configuración del examen
// ──────────────────────────────────────────────
const LAB_CATEGORIES = ['p1', 'p2', 'p3', 'manual', 'formulas']
const todasLasPreguntas = quizQuestions.filter(q => !LAB_CATEGORIES.includes(q.practice))

const unidades = [
  { id: 'u1', label: 'Unidad 1', cats: ['u1_quimica','u1_medicion','u1_cifras','u1_factor','u1_materia','u1_propiedades','u1_soluciones'] },
  { id: 'u2', label: 'Unidad 2', cats: ['u2_nucleo','u2_isotopos','u2_foton','u2_hidrogeno','u2_fotoelectrico','u2_cuanticos','u2_configuracion','u2_problemas'] },
  { id: 'u3', label: 'Unidad 3', cats: ['u3_tabla','u3_propiedades'] },
  { id: 'u4', label: 'Unidad 4', cats: ['u4_tipos','u4_lewis','u4_oxidacion'] },
  { id: 'u5', label: 'Unidad 5', cats: ['u5_binarios','u5_ternarios'] },
  { id: 'u6', label: 'Unidad 6', cats: ['u6_composicion','u6_reaccion','u6_limitante'] },
  { id: 'u7', label: 'Unidad 7', cats: ['u7_leyes','u7_ideal','u7_estequiometria'] },
]

const config = ref({
  unidadesSeleccionadas: ['u1','u2','u3','u4','u5','u6','u7'],
  cantidadPreguntas: 20,
  tiempoMinutos: 30,
  mostrarRetroalimentacion: false,
})

const tiemposOpciones = [10, 15, 20, 30, 45, 60]
const cantidadesOpciones = [10, 15, 20, 25, 30]

function toggleUnidad(id) {
  const idx = config.value.unidadesSeleccionadas.indexOf(id)
  if (idx === -1) {
    config.value.unidadesSeleccionadas.push(id)
  } else if (config.value.unidadesSeleccionadas.length > 1) {
    config.value.unidadesSeleccionadas.splice(idx, 1)
  }
}

const preguntasDisponibles = computed(() => {
  const cats = config.value.unidadesSeleccionadas.flatMap(uid =>
    unidades.find(u => u.id === uid)?.cats ?? []
  )
  return todasLasPreguntas.filter(q => cats.includes(q.practice))
})

const maxPreguntas = computed(() => Math.min(preguntasDisponibles.value.length, 50))

// ──────────────────────────────────────────────
// Estado del examen
// ──────────────────────────────────────────────
const fase = ref('config') // config | examen | resultados
const preguntas = ref([])
const respuestas = ref({}) // { idx: selectedOption }
const idx = ref(0)
const tiempoRestante = ref(0)
let timerInterval = null

const preguntaActual = computed(() => preguntas.value[idx.value])
const totalPreguntas = computed(() => preguntas.value.length)
const respondidas = computed(() => Object.keys(respuestas.value).length)
const pctProgreso = computed(() => (respondidas.value / totalPreguntas.value) * 100)

function iniciarExamen() {
  const pool = [...preguntasDisponibles.value].sort(() => Math.random() - 0.5)
  preguntas.value = pool.slice(0, config.value.cantidadPreguntas)
  respuestas.value = {}
  idx.value = 0
  tiempoRestante.value = config.value.tiempoMinutos * 60
  fase.value = 'examen'

  timerInterval = setInterval(() => {
    tiempoRestante.value--
    if (tiempoRestante.value <= 0) terminarExamen()
  }, 1000)
}

function responder(opcion) {
  if (respuestas.value[idx.value] !== undefined) return
  respuestas.value[idx.value] = opcion
}

function terminarExamen() {
  clearInterval(timerInterval)
  fase.value = 'resultados'
  // Registrar en el progreso (guardamos por "examen" como categoría especial)
  const correctas = preguntas.value.filter((p, i) => respuestas.value[i] === p.correct).length
  registrarQuiz('examen', correctas, preguntas.value.length)
}

function reiniciar() {
  clearInterval(timerInterval)
  fase.value = 'config'
  preguntas.value = []
  respuestas.value = {}
  idx.value = 0
  tiempoRestante.value = 0
}

onUnmounted(() => clearInterval(timerInterval))

// ──────────────────────────────────────────────
// Formato de tiempo
// ──────────────────────────────────────────────
const tiempoFormato = computed(() => {
  const m = Math.floor(tiempoRestante.value / 60)
  const s = tiempoRestante.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const tiempoUrgente = computed(() => tiempoRestante.value <= 60)

// ──────────────────────────────────────────────
// Resultados y análisis
// ──────────────────────────────────────────────
const resultados = computed(() => {
  if (fase.value !== 'resultados') return null
  let correctas = 0
  const porUnidad = {}

  preguntas.value.forEach((p, i) => {
    const resp = respuestas.value[i]
    const correc = resp === p.correct
    if (correc) correctas++

    const uid = Object.entries({
      u1: ['u1_quimica','u1_medicion','u1_cifras','u1_factor','u1_materia','u1_propiedades','u1_soluciones'],
      u2: ['u2_nucleo','u2_isotopos','u2_foton','u2_hidrogeno','u2_fotoelectrico','u2_cuanticos','u2_configuracion','u2_problemas'],
      u3: ['u3_tabla','u3_propiedades'],
      u4: ['u4_tipos','u4_lewis','u4_oxidacion'],
      u5: ['u5_binarios','u5_ternarios'],
      u6: ['u6_composicion','u6_reaccion','u6_limitante'],
      u7: ['u7_leyes','u7_ideal','u7_estequiometria'],
    }).find(([, cats]) => cats.includes(p.practice))?.[0] ?? 'otras'

    if (!porUnidad[uid]) porUnidad[uid] = { total: 0, correctas: 0, label: unidades.find(u => u.id === uid)?.label ?? uid }
    porUnidad[uid].total++
    if (correc) porUnidad[uid].correctas++
  })

  const pct = Math.round((correctas / preguntas.value.length) * 100)
  const errores = preguntas.value
    .map((p, i) => ({ ...p, idx: i, resp: respuestas.value[i], correc: respuestas.value[i] === p.correct }))
    .filter(p => !p.correc)

  return { correctas, total: preguntas.value.length, pct, porUnidad, errores }
})

const colorNota = computed(() => {
  const p = resultados.value?.pct ?? 0
  if (p >= 90) return 'text-green-600'
  if (p >= 70) return 'text-blue-600'
  if (p >= 50) return 'text-yellow-600'
  return 'text-red-500'
})

const mensajeNota = computed(() => {
  const p = resultados.value?.pct ?? 0
  if (p >= 90) return '¡Excelente! Dominas el material.'
  if (p >= 70) return 'Buen resultado. Repasa los temas donde fallaste.'
  if (p >= 50) return 'Aprobado justo. Necesitas reforzar varias unidades.'
  return 'Necesitas repasar más a fondo antes del examen real.'
})

const verRespuestas = ref(false)
</script>

<template>
  <div class="space-y-6">
    <!-- ══ CONFIGURACIÓN ══ -->
    <template v-if="fase === 'config'">
      <div>
        <h1 class="text-xl font-bold flex items-center gap-2">
          <Timer class="size-5" /> Modo Examen
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          Simulacro cronometrado con preguntas de las unidades que elijas.
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2">
        <!-- Selección de unidades -->
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Unidades a evaluar</CardTitle>
            <CardDescription>Selecciona al menos una unidad.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <button
              v-for="u in unidades"
              :key="u.id"
              class="flex w-full items-center gap-3 rounded border p-2.5 hover:border-primary/50 transition-colors text-left"
              :class="config.unidadesSeleccionadas.includes(u.id)
                ? 'border-primary bg-primary/5'
                : 'border-border'"
              @click="toggleUnidad(u.id)"
            >
              <div class="flex size-5 shrink-0 items-center justify-center rounded border-2"
                :class="config.unidadesSeleccionadas.includes(u.id)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground'">
                <CheckCircle2 v-if="config.unidadesSeleccionadas.includes(u.id)" class="size-3" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ u.label }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ todasLasPreguntas.filter(q => u.cats.includes(q.practice)).length }} preguntas disponibles
                </p>
              </div>
            </button>
            <p class="text-xs text-muted-foreground pt-1">
              Total disponible: <strong>{{ preguntasDisponibles.length }}</strong> preguntas
            </p>
          </CardContent>
        </Card>

        <!-- Parámetros del examen -->
        <div class="space-y-4">
          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Número de preguntas</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="n in cantidadesOpciones" :key="n"
                  :variant="config.cantidadPreguntas === n ? 'default' : 'outline'"
                  size="sm"
                  :disabled="n > maxPreguntas"
                  @click="config.cantidadPreguntas = n"
                >{{ n }}</Button>
              </div>
              <p class="text-xs text-muted-foreground mt-2">
                Máximo disponible: {{ maxPreguntas }}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Tiempo límite</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="t in tiemposOpciones" :key="t"
                  :variant="config.tiempoMinutos === t ? 'default' : 'outline'"
                  size="sm"
                  @click="config.tiempoMinutos = t"
                >{{ t }} min</Button>
              </div>
              <p class="text-xs text-muted-foreground mt-2">
                Aprox. {{ Math.round(config.tiempoMinutos / config.cantidadPreguntas * 60) }}s por pregunta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-2">
              <CardTitle class="text-sm">Retroalimentación durante el examen</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex gap-2">
                <Button
                  :variant="config.mostrarRetroalimentacion ? 'default' : 'outline'"
                  size="sm"
                  @click="config.mostrarRetroalimentacion = true"
                >Activada</Button>
                <Button
                  :variant="!config.mostrarRetroalimentacion ? 'default' : 'outline'"
                  size="sm"
                  @click="config.mostrarRetroalimentacion = false"
                >Desactivada</Button>
              </div>
              <p class="text-xs text-muted-foreground mt-1">
                {{ config.mostrarRetroalimentacion ? 'Verás si acertaste después de cada respuesta.' : 'Modo real: sin retroalimentación hasta el final.' }}
              </p>
            </CardContent>
          </Card>

          <Button
            class="w-full gap-2 h-12 text-base"
            :disabled="preguntasDisponibles.length === 0"
            @click="iniciarExamen"
          >
            <Timer class="size-5" />
            Iniciar Examen ({{ config.cantidadPreguntas }} preguntas · {{ config.tiempoMinutos }} min)
          </Button>
        </div>
      </div>
    </template>

    <!-- ══ EXAMEN ACTIVO ══ -->
    <template v-if="fase === 'examen'">
      <!-- Barra superior -->
      <div class="flex items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur pb-3 border-b">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <span class="text-sm text-muted-foreground shrink-0">
            {{ idx + 1 }} / {{ totalPreguntas }}
          </span>
          <Progress :model-value="pctProgreso" class="flex-1" />
          <span class="text-sm text-muted-foreground shrink-0">{{ respondidas }} resp.</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-sm font-bold"
            :class="tiempoUrgente ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-muted text-foreground'"
          >
            <Timer class="size-4" />
            {{ tiempoFormato }}
          </div>
          <Button variant="outline" size="sm" @click="terminarExamen">Terminar</Button>
        </div>
      </div>

      <!-- Pregunta -->
      <Card>
        <CardHeader class="pb-3">
          <div class="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" class="font-mono text-xs">{{ idx + 1 }} / {{ totalPreguntas }}</Badge>
            <Badge variant="secondary" class="text-xs">{{ preguntaActual.practice?.split('_')[0]?.toUpperCase() }}</Badge>
          </div>
          <CardTitle class="text-base mt-2 leading-relaxed">{{ preguntaActual.question }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
          <button
            v-for="(opcion, oi) in preguntaActual.options"
            :key="oi"
            class="flex w-full items-center gap-3 rounded border p-3 text-left text-sm hover:border-primary/50 transition-all"
            :class="{
              // Sin retroalimentación
              'border-primary bg-primary/10': !config.mostrarRetroalimentacion && respuestas[idx] === oi,
              // Con retroalimentación — respondida
              'border-green-400 bg-green-50': config.mostrarRetroalimentacion && respuestas[idx] !== undefined && oi === preguntaActual.correct,
              'border-red-400 bg-red-50': config.mostrarRetroalimentacion && respuestas[idx] === oi && oi !== preguntaActual.correct,
              'opacity-50 cursor-not-allowed': respuestas[idx] !== undefined && !config.mostrarRetroalimentacion && respuestas[idx] !== oi,
            }"
            :disabled="respuestas[idx] !== undefined"
            @click="responder(oi)"
          >
            <div
              class="flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold"
              :class="{
                'border-primary bg-primary text-primary-foreground': !config.mostrarRetroalimentacion && respuestas[idx] === oi,
                'border-green-500 bg-green-500 text-white': config.mostrarRetroalimentacion && respuestas[idx] !== undefined && oi === preguntaActual.correct,
                'border-red-500 bg-red-500 text-white': config.mostrarRetroalimentacion && respuestas[idx] === oi && oi !== preguntaActual.correct,
                'border-muted-foreground/30 text-muted-foreground': respuestas[idx] === undefined || (respuestas[idx] !== oi && oi !== preguntaActual.correct),
              }"
            >{{ ['A','B','C','D'][oi] }}</div>
            <span>{{ opcion }}</span>
          </button>

          <!-- Explicación (solo con retroalimentación activada) -->
          <div
            v-if="config.mostrarRetroalimentacion && respuestas[idx] !== undefined"
            class="rounded p-3 text-sm mt-2"
            :class="respuestas[idx] === preguntaActual.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
          >
            <p class="font-medium mb-1" :class="respuestas[idx] === preguntaActual.correct ? 'text-green-700' : 'text-red-700'">
              {{ respuestas[idx] === preguntaActual.correct ? '✓ Correcto' : '✗ Incorrecto' }}
            </p>
            <p class="text-muted-foreground">{{ preguntaActual.explanation }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Navegación -->
      <div class="flex items-center justify-between gap-3">
        <Button variant="outline" :disabled="idx === 0" class="gap-1" @click="idx--">
          <ChevronLeft class="size-4" /> Anterior
        </Button>

        <!-- Mapa de preguntas -->
        <div class="flex flex-wrap gap-1 justify-center max-w-sm">
          <button
            v-for="(_, i) in preguntas"
            :key="i"
            class="size-7 text-xs rounded font-mono font-medium transition-colors"
            :class="{
              'bg-primary text-primary-foreground': i === idx,
              'bg-green-100 text-green-700': i !== idx && respuestas[i] !== undefined && (config.mostrarRetroalimentacion ? respuestas[i] === preguntas[i].correct : true),
              'bg-red-100 text-red-600': i !== idx && config.mostrarRetroalimentacion && respuestas[i] !== undefined && respuestas[i] !== preguntas[i].correct,
              'bg-muted text-muted-foreground': respuestas[i] === undefined && i !== idx,
            }"
            @click="idx = i"
          >{{ i + 1 }}</button>
        </div>

        <Button
          v-if="idx < totalPreguntas - 1"
          :disabled="respuestas[idx] === undefined"
          class="gap-1"
          @click="idx++"
        >
          Siguiente <ChevronRight class="size-4" />
        </Button>
        <Button
          v-else
          variant="default"
          class="gap-1 bg-green-600 hover:bg-green-700"
          @click="terminarExamen"
        >
          <Trophy class="size-4" /> Finalizar
        </Button>
      </div>
    </template>

    <!-- ══ RESULTADOS ══ -->
    <template v-if="fase === 'resultados' && resultados">
      <!-- Nota principal -->
      <Card class="text-center">
        <CardContent class="pt-8 pb-6 space-y-3">
          <Trophy class="size-12 mx-auto text-yellow-500" />
          <p class="text-5xl font-bold font-mono" :class="colorNota">{{ resultados.pct }}%</p>
          <p class="text-lg font-semibold">{{ resultados.correctas }} / {{ resultados.total }} correctas</p>
          <p class="text-muted-foreground">{{ mensajeNota }}</p>
          <div class="flex gap-3 justify-center pt-2">
            <Button variant="outline" class="gap-2" @click="reiniciar">
              <RotateCcw class="size-4" /> Nuevo examen
            </Button>
            <Button variant="outline" class="gap-2" @click="verRespuestas = !verRespuestas">
              <BookOpen class="size-4" /> {{ verRespuestas ? 'Ocultar' : 'Ver' }} respuestas
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Rendimiento por unidad -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm">Rendimiento por unidad</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="(datos, uid) in resultados.porUnidad"
            :key="uid"
            class="space-y-1"
          >
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{{ datos.label }}</span>
              <span class="font-mono" :class="datos.correctas/datos.total >= 0.7 ? 'text-green-600' : 'text-red-500'">
                {{ datos.correctas }} / {{ datos.total }}
                ({{ Math.round(datos.correctas / datos.total * 100) }}%)
              </span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="datos.correctas/datos.total >= 0.7 ? 'bg-green-500' : datos.correctas/datos.total >= 0.5 ? 'bg-yellow-500' : 'bg-red-400'"
                :style="{ width: `${(datos.correctas / datos.total) * 100}%` }"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Resumen de errores -->
      <div v-if="resultados.errores.length > 0">
        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm flex items-center gap-2">
              <XCircle class="size-4 text-red-500" />
              Preguntas incorrectas ({{ resultados.errores.length }})
            </CardTitle>
            <CardDescription>Repasa estos temas antes del examen real.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="err in resultados.errores"
              :key="err.idx"
              class="border rounded p-3 space-y-2"
            >
              <div class="flex items-start gap-2">
                <XCircle class="size-4 text-red-500 shrink-0 mt-0.5" />
                <p class="text-sm font-medium leading-snug">{{ err.question }}</p>
              </div>
              <div class="pl-6 space-y-1 text-sm">
                <p class="text-red-600">
                  <span class="font-medium">Tu respuesta:</span>
                  {{ err.resp !== undefined ? err.options[err.resp] : 'Sin responder' }}
                </p>
                <p class="text-green-700">
                  <span class="font-medium">Respuesta correcta:</span>
                  {{ err.options[err.correct] }}
                </p>
                <p class="text-xs text-muted-foreground bg-muted rounded px-2 py-1.5">
                  {{ err.explanation }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Respuestas completas (modo revisión) -->
      <div v-if="verRespuestas" class="space-y-3">
        <h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Revisión completa</h2>
        <Card
          v-for="(p, i) in preguntas"
          :key="i"
          class="border"
          :class="respuestas[i] === p.correct ? 'border-green-200' : 'border-red-200'"
        >
          <CardContent class="pt-4 pb-3 space-y-2">
            <div class="flex items-start gap-2">
              <CheckCircle2 v-if="respuestas[i] === p.correct" class="size-4 text-green-500 shrink-0 mt-0.5" />
              <XCircle v-else class="size-4 text-red-500 shrink-0 mt-0.5" />
              <p class="text-sm font-medium leading-snug">{{ i + 1 }}. {{ p.question }}</p>
            </div>
            <div class="pl-6 text-sm space-y-0.5">
              <p v-if="respuestas[i] !== p.correct" class="text-red-600 text-xs">
                Tu resp.: {{ respuestas[i] !== undefined ? p.options[respuestas[i]] : 'Sin responder' }}
              </p>
              <p class="text-green-700 text-xs font-medium">✓ {{ p.options[p.correct] }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ p.explanation }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>

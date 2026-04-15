<script setup>
import { ref, computed, watch } from 'vue'
import QuizCard from './QuizCard.vue'
import { quizQuestions } from '../data/quizData.js'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useProgress } from '@/composables/useProgress.js'

const { registrarQuiz } = useProgress()

const props = defineProps({
  practiceFilter: { type: String, default: 'todas' },
  moduleFilter: { type: String, default: 'todas' }
})

const LAB_CATEGORIES = ['p1', 'p2', 'p3', 'manual', 'formulas']

const filteredQuestions = computed(() => {
  if (props.practiceFilter !== 'todas') {
    return quizQuestions.filter((q) => q.practice === props.practiceFilter)
  }
  // Excluir siempre las preguntas de laboratorio
  return quizQuestions.filter((q) => !LAB_CATEGORIES.includes(q.practice))
})

const questions = ref([])
watch(
  () => props.practiceFilter,
  () => {
    const f = filteredQuestions.value
    questions.value = [...f].sort(() => Math.random() - 0.5)
  },
  { immediate: true }
)

const currentIndex = ref(0)
const answeredAt = ref({}) // { index: { selected, correct } }
const finished = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])

const score = computed(() => {
  let s = 0
  for (let i = 0; i <= currentIndex.value; i++) {
    if (answeredAt.value[i]?.correct) s++
  }
  return s
})

const totalCorrect = computed(() =>
  Object.values(answeredAt.value).filter((a) => a?.correct).length
)

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => answeredAt.value[currentIndex.value] !== undefined)
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)

function onAnswered(correct, selectedIndex) {
  answeredAt.value[currentIndex.value] = { selected: selectedIndex, correct }
  if (isLastQuestion.value) {
    finished.value = true
    // Determinar la unidad para el registro de progreso
    const practice = props.practiceFilter
    const unidadMap = {
      u1_quimica: 'u1', u1_medicion: 'u1', u1_cifras: 'u1', u1_factor: 'u1',
      u1_materia: 'u1', u1_propiedades: 'u1', u1_soluciones: 'u1',
      u2_nucleo: 'u2', u2_isotopos: 'u2', u2_foton: 'u2', u2_hidrogeno: 'u2',
      u2_fotoelectrico: 'u2', u2_cuanticos: 'u2', u2_configuracion: 'u2', u2_problemas: 'u2',
      u3_tabla: 'u3', u3_propiedades: 'u3',
      u4_tipos: 'u4', u4_lewis: 'u4', u4_oxidacion: 'u4',
      u5_binarios: 'u5', u5_ternarios: 'u5',
      u6_composicion: 'u6', u6_reaccion: 'u6', u6_limitante: 'u6',
      u7_leyes: 'u7', u7_ideal: 'u7', u7_estequiometria: 'u7',
    }
    const unidad = unidadMap[practice] ?? 'todas'
    const corr = Object.values(answeredAt.value).filter(a => a?.correct).length + (correct ? 0 : 0)
    registrarQuiz(unidad, Object.values({...answeredAt.value, [currentIndex.value]: { correct }}).filter(a => a?.correct).length, questions.value.length)
  } else {
    setTimeout(() => {
      currentIndex.value++
    }, 1500)
  }
}

function goPrev() {
  if (canGoPrev.value) currentIndex.value--
}

function goNext() {
  if (!canGoNext.value) return
  if (isLastQuestion.value) {
    finished.value = true
  } else {
    currentIndex.value++
  }
}

function restart() {
  questions.value = [...filteredQuestions.value].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
  answeredAt.value = {}
  finished.value = false
}

const percentage = computed(() =>
  finished.value && questions.value.length > 0
    ? Math.round((totalCorrect.value / questions.value.length) * 100)
    : 0
)

const practiceLabels = {
  // U1
  u1_quimica: 'U1: Química',
  u1_medicion: 'U1: Medición',
  u1_cifras: 'U1: Cifras Sig.',
  u1_factor: 'U1: Factor Unitario',
  u1_materia: 'U1: Materia',
  u1_propiedades: 'U1: Propiedades',
  u1_soluciones: 'U1: Soluciones',
  // U2
  u2_nucleo: 'U2: Núcleo',
  u2_isotopos: 'U2: Isótopos',
  u2_foton: 'U2: Fotón',
  u2_hidrogeno: 'U2: Hidrógeno',
  u2_fotoelectrico: 'U2: Fotoeléctrico',
  u2_cuanticos: 'U2: Cuánticos',
  u2_configuracion: 'U2: Config. Electrónica',
  u2_problemas: 'U2: Problemas',
  // U3
  u3_tabla: 'U3: Tabla Periódica',
  u3_propiedades: 'U3: Prop. Periódicas',
  // U4
  u4_tipos: 'U4: Tipos de Enlace',
  u4_lewis: 'U4: Lewis',
  u4_oxidacion: 'U4: N° Oxidación',
  // U5
  u5_binarios: 'U5: Binarios',
  u5_ternarios: 'U5: Ternarios',
  // U6
  u6_composicion: 'U6: Composición',
  u6_reaccion: 'U6: Reacción',
  u6_limitante: 'U6: Limitante',
  // U7
  u7_leyes: 'U7: Leyes',
  u7_ideal: 'U7: Gas Ideal',
  u7_estequiometria: 'U7: Estequiometría',
  todas: 'Todas'
}
</script>

<template>
  <div class="space-y-6">
    <p v-if="questions.length === 0" class="py-4 text-amber-600">
      No hay preguntas para este filtro. Selecciona otra opción.
    </p>

    <template v-else>
      <div v-if="!finished" class="flex items-center justify-between gap-4">
        <span class="text-sm font-medium text-muted-foreground">
          {{ practiceLabels[practiceFilter] || practiceFilter }} · {{ score }} / {{ questions.length }}
        </span>
        <Progress :model-value="((currentIndex + 1) / questions.length) * 100" class="w-32" />
      </div>

      <QuizCard
        v-if="!finished"
        :question="currentQuestion"
        :question-number="currentIndex + 1"
        :total-questions="questions.length"
        :initial-selected="answeredAt[currentIndex]?.selected"
        :initial-show-result="!!answeredAt[currentIndex]"
        @answered="onAnswered"
      />

      <div v-if="!finished" class="flex items-center justify-between gap-4 pt-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!canGoPrev"
          class="gap-1"
          @click="goPrev"
        >
          <ChevronLeft class="size-4" />
          Anterior
        </Button>
        <Button
          variant="default"
          size="sm"
          :disabled="!canGoNext"
          class="gap-1"
          @click="goNext"
        >
          Siguiente
          <ChevronRight class="size-4" />
        </Button>
      </div>

      <Card v-else>
        <CardContent class="pt-8 pb-8 text-center">
          <h2 class="text-2xl font-bold mb-2">¡Quiz completado!</h2>
          <p
            :class="[
              'text-4xl font-bold mb-4',
              percentage >= 70 ? 'text-emerald-600' : percentage >= 50 ? 'text-amber-600' : 'text-destructive'
            ]"
          >
            {{ percentage }}%
          </p>
          <p class="text-muted-foreground mb-6">
            Obtuviste {{ totalCorrect }} de {{ questions.length }} correctas
          </p>
          <Button @click="restart">
            Reintentar quiz
          </Button>
        </CardContent>
      </Card>
    </template>
  </div>
</template>

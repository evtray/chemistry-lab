<script setup>
import { ref, computed, watch } from 'vue'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const props = defineProps({
  question: Object,
  questionNumber: Number,
  totalQuestions: Number,
  initialSelected: { type: Number, default: undefined },
  initialShowResult: { type: Boolean, default: false }
})

const emit = defineEmits(['answered'])

const selected = ref(props.initialSelected ?? null)
const showResult = ref(props.initialShowResult)

// Resetear o restaurar estado al cambiar de pregunta
watch(() => props.question, () => {
  selected.value = props.initialSelected ?? null
  showResult.value = props.initialShowResult
})

watch(() => [props.initialSelected, props.initialShowResult], () => {
  selected.value = props.initialSelected ?? null
  showResult.value = props.initialShowResult
})

const isCorrect = computed(() => selected.value === props.question.correct)

function selectOption(index) {
  if (showResult.value) return
  selected.value = index
  showResult.value = true
  setTimeout(() => emit('answered', isCorrect.value, selected.value), 1500)
}

function optionClass(index) {
  if (!showResult.value) {
    return 'hover:border-primary hover:bg-primary/5'
  }
  if (index === props.question.correct) {
    return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200'
  }
  if (index === selected.value && !isCorrect.value) {
    return 'border-destructive/50 bg-destructive/10 text-destructive'
  }
  return 'opacity-60'
}
</script>

<template>
  <Card>
    <CardHeader class="bg-primary/10 py-3">
      <p class="text-sm font-medium text-primary">
        Pregunta {{ questionNumber }} de {{ totalQuestions }}
      </p>
    </CardHeader>
    <CardContent class="space-y-6 pt-6">
      <p class="text-lg font-medium leading-relaxed">
        {{ question.question }}
      </p>
      <div class="space-y-3">
        <Button
          v-for="(opt, i) in question.options"
          :key="i"
          :class="[
            'w-full justify-start h-auto py-3 font-normal',
            optionClass(i)
          ]"
          variant="outline"
          @click="selectOption(i)"
        >
          <span class="font-mono text-primary mr-2">{{ String.fromCharCode(65 + i) }}.</span>
          {{ opt }}
        </Button>
      </div>
      <div
        v-if="showResult"
        :class="[
          'rounded-lg p-4 text-sm',
          isCorrect ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
        ]"
      >
        <p class="font-semibold mb-1">{{ isCorrect ? '¡Correcto!' : 'Incorrecto' }}</p>
        <p class="opacity-90">{{ question.explanation }}</p>
      </div>
    </CardContent>
  </Card>
</template>

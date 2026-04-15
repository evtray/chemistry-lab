<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Flashcard from './Flashcard.vue'
import { flashcards as allFlashcards } from '../data/flashcardsData.js'
import { modules } from '../data/modulesConfig.js'

const LAB_CATEGORIES = ['p1', 'p2', 'p3', 'manual', 'formulas']
const flashcards = allFlashcards.filter((c) => !LAB_CATEGORIES.includes(c.category))
import { Button } from '@/components/ui/button'
import { Shuffle, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const moduleFilter = ref('todas')
const categoryFilter = ref('todas')
const shuffledCards = ref([])

const categories = computed(() => {
  if (moduleFilter.value === 'todas') {
    return [{ id: 'todas', label: 'Todas' }, ...modules.flatMap((m) => m.categories)]
  }
  const mod = modules.find((m) => m.id === moduleFilter.value)
  return mod ? [{ id: 'todas', label: 'Todas' }, ...mod.categories] : [{ id: 'todas', label: 'Todas' }]
})

const filteredCards = computed(() => {
  let list = shuffledCards.value
  if (categoryFilter.value !== 'todas') {
    list = list.filter((c) => c.category === categoryFilter.value)
  } else if (moduleFilter.value !== 'todas') {
    const mod = modules.find((m) => m.id === moduleFilter.value)
    const catIds = mod?.categories.map((c) => c.id) ?? []
    list = list.filter((c) => catIds.includes(c.category))
  }
  return list
})

const currentIndex = ref(0)
const currentCard = computed(() => filteredCards.value[currentIndex.value])

function shuffle() {
  shuffledCards.value = [...flashcards].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
}

watch([categoryFilter, moduleFilter], () => {
  currentIndex.value = 0
})

watch(
  () => filteredCards.value.length,
  () => {
    currentIndex.value = 0
  }
)

function next() {
  if (currentIndex.value < filteredCards.value.length - 1) {
    currentIndex.value++
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function selectModule(id) {
  moduleFilter.value = id
  categoryFilter.value = 'todas'
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

onMounted(() => {
  shuffle()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-muted-foreground">Unidad:</span>
        <Button
          :variant="moduleFilter === 'todas' ? 'default' : 'outline'"
          size="sm"
          @click="selectModule('todas')"
        >
          Todas
        </Button>
        <Button
          v-for="m in modules"
          :key="m.id"
          :variant="moduleFilter === m.id ? 'default' : 'outline'"
          size="sm"
          @click="selectModule(m.id)"
        >
          {{ m.label }}
        </Button>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          v-for="c in categories"
          :key="c.id"
          :variant="categoryFilter === c.id ? 'default' : 'outline'"
          size="sm"
          @click="categoryFilter = c.id"
        >
          {{ c.label }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          class="gap-1 ml-auto"
          @click="shuffle"
        >
          <Shuffle class="size-4" />
          Mezclar
        </Button>
      </div>
    </div>

    <div v-if="filteredCards.length === 0" class="py-8 text-center text-muted-foreground">
      No hay tarjetas en esta categoría
    </div>

    <template v-else>
      <Flashcard
        :card="currentCard"
        :index="currentIndex"
        :total="filteredCards.length"
      />
      <div class="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentIndex === 0"
          class="gap-1"
          @click="prev"
        >
          <ChevronLeft class="size-4" />
          Anterior
        </Button>
        <span class="flex items-center px-4 font-mono text-sm text-muted-foreground min-w-[5rem] justify-center">
          {{ currentIndex + 1 }} / {{ filteredCards.length }}
        </span>
        <Button
          variant="default"
          size="sm"
          :disabled="currentIndex === filteredCards.length - 1"
          class="gap-1"
          @click="next"
        >
          Siguiente
          <ChevronRight class="size-4" />
        </Button>
      </div>
      <p class="text-center text-xs text-muted-foreground">
        ← → para navegar · Toca la tarjeta para voltear
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import QuizView from '@/components/QuizView.vue'
import { modules } from '@/data/modulesConfig.js'

const moduleFilter = ref('todas')
const categoryFilter = ref('todas')

const categoriesForModule = computed(() => {
  if (moduleFilter.value === 'todas') {
    return [{ id: 'todas', label: 'Todas' }, ...modules.flatMap((m) => m.categories)]
  }
  const mod = modules.find((m) => m.id === moduleFilter.value)
  return mod ? [{ id: 'todas', label: 'Todas' }, ...mod.categories] : [{ id: 'todas', label: 'Todas' }]
})

function selectModule(id) {
  moduleFilter.value = id
  categoryFilter.value = 'todas'
}

function selectCategory(id) {
  categoryFilter.value = id
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-xl font-bold">Quiz</h1>

    <div class="space-y-3">
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm font-medium text-muted-foreground">Unidad:</span>
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
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-muted-foreground">Tema:</span>
        <Button
          v-for="c in categoriesForModule"
          :key="c.id"
          :variant="categoryFilter === c.id ? 'secondary' : 'outline'"
          size="sm"
          @click="selectCategory(c.id)"
        >
          {{ c.label }}
        </Button>
      </div>
    </div>

    <QuizView :practice-filter="categoryFilter" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ejerciciosIsotopos,
  ejerciciosNotacion,
  ejerciciosReaccionesNucleares,
  ejerciciosHidrogeno,
  ejerciciosTransiciones,
  ejerciciosQuarks
} from '@/data/ejerciciosData.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

const secciones = [
  { id: 'quarks', label: 'Quarks', icon: '⚛️', ejercicios: ejerciciosQuarks, desc: 'Composición de protones y neutrones' },
  { id: 'notacion', label: 'Notación', icon: '🔤', ejercicios: ejerciciosNotacion, desc: 'Simbología isotópica, p⁺, n⁰, e⁻ e iones' },
  { id: 'reacciones', label: 'Reacciones nucleares', icon: '☢️', ejercicios: ejerciciosReaccionesNucleares, desc: 'Decaimiento y cambios nucleares' },
  { id: 'isotopos', label: 'Masa atómica', icon: '⚖️', ejercicios: ejerciciosIsotopos, desc: 'Abundancia isotópica y masa elemental' },
  { id: 'hidrogeno', label: 'Átomo de H', icon: '💫', ejercicios: ejerciciosHidrogeno, desc: 'Modelo de Bohr: Eₚ, Eₖ, ℋ, ε, r' },
  { id: 'transiciones', label: 'Transiciones', icon: '🔀', ejercicios: ejerciciosTransiciones, desc: 'ΔEₚ, Δℋ, ionización' }
]

const activeSection = ref('quarks')

const currentSection = computed(() =>
  secciones.find(s => s.id === activeSection.value)
)

// Por defecto, el primer paso de cada ejercicio está expandido
const expandedSteps = ref({})

function toggleStep(secId, ejId, stepIdx) {
  const key = `${secId}-${ejId}-${stepIdx}`
  expandedSteps.value[key] = !expandedSteps.value[key]
}

function isExpanded(secId, ejId, stepIdx) {
  const key = `${secId}-${ejId}-${stepIdx}`
  // First step expanded by default
  if (expandedSteps.value[key] === undefined) return stepIdx === 0
  return expandedSteps.value[key]
}

function diffLabel(d) {
  if (d === 1) return 'Básico'
  if (d === 2) return 'Intermedio'
  return 'Avanzado'
}

function diffColor(d) {
  if (d === 1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  if (d === 2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold">Ejercicios resueltos — Teoría Atómica</h2>
      <p class="text-sm text-muted-foreground mt-1">
        Problemas resueltos paso a paso, organizados por tema y dificultad creciente.
      </p>
    </div>

    <!-- Selector de sección -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="sec in secciones"
        :key="sec.id"
        @click="activeSection = sec.id"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition-all border',
          activeSection === sec.id
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-muted/30 hover:bg-muted/60 border-transparent'
        ]"
      >
        {{ sec.icon }} {{ sec.label }}
        <span class="ml-1 text-xs opacity-70">({{ sec.ejercicios.length }})</span>
      </button>
    </div>

    <p class="text-sm text-muted-foreground" v-if="currentSection">
      {{ currentSection.desc }}
    </p>

    <!-- Ejercicios de la sección -->
    <Tabs v-if="currentSection" :default-value="String(currentSection.ejercicios[0]?.id)" :key="activeSection" class="w-full">
      <TabsList class="flex flex-wrap h-auto gap-1 p-1">
        <TabsTrigger
          v-for="ej in currentSection.ejercicios"
          :key="ej.id"
          :value="String(ej.id)"
          class="text-sm"
        >
          Ej. {{ ej.id }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="ej in currentSection.ejercicios"
        :key="ej.id"
        :value="String(ej.id)"
        class="mt-4"
      >
        <Card>
          <CardHeader>
            <div class="flex items-center gap-2 flex-wrap">
              <CardTitle class="text-base">{{ ej.titulo }}</CardTitle>
              <span
                v-if="ej.dificultad"
                :class="['text-xs px-2 py-0.5 rounded-full font-medium', diffColor(ej.dificultad)]"
              >
                {{ diffLabel(ej.dificultad) }}
              </span>
            </div>
            <ul class="text-sm text-muted-foreground space-y-1 mt-2">
              <li v-for="(dato, i) in ej.datos" :key="i" class="flex items-start gap-2">
                <span class="text-primary">•</span>
                <span>{{ dato }}</span>
              </li>
            </ul>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <p class="text-sm font-medium">Desarrollo:</p>
              <div
                v-for="(paso, idx) in ej.pasos"
                :key="idx"
                class="rounded-lg border bg-muted/30 overflow-hidden"
              >
                <button
                  type="button"
                  class="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  @click="toggleStep(activeSection, ej.id, idx)"
                >
                  <component
                    :is="isExpanded(activeSection, ej.id, idx) ? ChevronDown : ChevronRight"
                    class="size-4 shrink-0 text-muted-foreground"
                  />
                  <span class="font-medium text-sm">{{ paso.titulo }}</span>
                </button>
                <div
                  v-show="isExpanded(activeSection, ej.id, idx)"
                  class="px-4 pb-4 pt-0 text-sm whitespace-pre-line font-mono leading-relaxed"
                >
                  {{ paso.contenido }}
                </div>
              </div>
            </div>

            <div class="pt-2 border-t">
              <p class="text-sm font-medium mb-2">Respuestas:</p>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="(r, i) in ej.respuestas"
                  :key="i"
                  variant="secondary"
                  class="font-mono text-sm"
                >
                  {{ r }}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

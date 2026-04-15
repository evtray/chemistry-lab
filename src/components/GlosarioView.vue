<script setup>
import { ref, computed } from 'vue'
import { glossary } from '../data/glossaryData.js'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const unidades = [
  { id: 'u1', label: 'U1: Ciencia y Medición' },
  { id: 'u2', label: 'U2: Teoría Atómica' },
  { id: 'u3', label: 'U3: Periódica' },
  { id: 'u4', label: 'U4: Enlace' },
  { id: 'u5', label: 'U5: Nomenclatura' },
  { id: 'u6', label: 'U6: Estequiometría' },
  { id: 'u7', label: 'U7: Gases' },
]

const search = ref('')
const unitFilter = ref('todas')

const filtered = computed(() => {
  let list = glossary
  if (unitFilter.value !== 'todas') {
    list = list.filter((g) => g.category === unitFilter.value)
  }
  const q = String(search.value || '').toLowerCase().trim()
  if (!q) return list
  return list.filter(
    (g) =>
      String(g.term || '').toLowerCase().includes(q) ||
      String(g.definition || '').toLowerCase().includes(q)
  )
})

const groupedByLetter = computed(() => {
  const groups = {}
  for (const item of filtered.value) {
    const letter = (item.term[0] || '?').toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(item)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

function unitLabel(cat) {
  return unidades.find(u => u.id === cat)?.label ?? cat
}

function unitColor(cat) {
  const map = {
    u1: 'bg-blue-100 text-blue-700 border-blue-200',
    u2: 'bg-purple-100 text-purple-700 border-purple-200',
    u3: 'bg-green-100 text-green-700 border-green-200',
    u4: 'bg-orange-100 text-orange-700 border-orange-200',
    u5: 'bg-red-100 text-red-700 border-red-200',
    u6: 'bg-teal-100 text-teal-700 border-teal-200',
    u7: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  }
  return map[cat] ?? 'bg-muted text-muted-foreground'
}
</script>

<template>
  <div class="flex flex-col h-full gap-3">
    <!-- Búsqueda -->
    <Input
      v-model="search"
      type="text"
      placeholder="Buscar término o definición…"
      class="h-10 shrink-0"
    />

    <!-- Filtros por unidad -->
    <div class="flex flex-wrap gap-1.5 shrink-0">
      <Button
        :variant="unitFilter === 'todas' ? 'default' : 'outline'"
        size="sm"
        @click="unitFilter = 'todas'"
      >
        Todas ({{ glossary.length }})
      </Button>
      <Button
        v-for="u in unidades"
        :key="u.id"
        :variant="unitFilter === u.id ? 'default' : 'outline'"
        size="sm"
        @click="unitFilter = u.id"
      >
        {{ u.label.split(':')[0] }}
        <span class="ml-1 text-xs opacity-70">{{ glossary.filter(g => g.category === u.id).length }}</span>
      </Button>
    </div>

    <!-- Resultado count -->
    <p class="text-xs text-muted-foreground shrink-0">
      {{ filtered.length }} término{{ filtered.length !== 1 ? 's' : '' }}
      <span v-if="search"> para "<strong>{{ search }}</strong>"</span>
    </p>

    <!-- Lista agrupada por letra -->
    <div class="flex-1 min-h-0 overflow-y-auto rounded-lg border p-4">
      <div class="space-y-6">
        <template v-for="([letter, items]) in groupedByLetter" :key="letter">
          <div>
            <h3 class="text-sm font-bold text-primary/80 mb-2 sticky top-0 bg-background py-1 border-b">
              {{ letter }}
            </h3>
            <div class="space-y-2">
              <Card
                v-for="(item, i) in items"
                :key="`${letter}-${i}`"
                class="transition-colors hover:border-primary/30"
              >
                <CardContent class="p-3 sm:p-4">
                  <div class="flex items-start justify-between gap-2">
                    <h4 class="font-bold text-primary text-sm sm:text-base">{{ item.term }}</h4>
                    <Badge
                      v-if="item.category"
                      variant="outline"
                      class="text-xs shrink-0 border"
                      :class="unitColor(item.category)"
                    >
                      {{ item.category?.toUpperCase() }}
                    </Badge>
                  </div>
                  <p class="text-sm leading-relaxed text-muted-foreground mt-1.5">{{ item.definition }}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </template>
        <p v-if="filtered.length === 0" class="py-8 text-center text-muted-foreground">
          No se encontraron términos
        </p>
      </div>
    </div>
  </div>
</template>

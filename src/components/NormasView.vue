<script setup>
import { ref } from 'vue'
import { normasGenerales, normasSeguridad, emergencias, kitSeguridad } from '../data/normasData.js'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const tab = ref('general')

const tabs = [
  { id: 'general', label: 'Normas generales' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'emergencias', label: 'Emergencias' },
  { id: 'kit', label: 'Kit' },
]
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-wrap gap-2 shrink-0">
      <Button
        v-for="t in tabs"
        :key="t.id"
        :variant="tab === t.id ? 'default' : 'outline'"
        size="sm"
        @click="tab = t.id"
      >
        {{ t.label }}
      </Button>
    </div>

    <!-- Normas generales -->
    <div v-if="tab === 'general'" class="flex-1 min-h-0 overflow-y-auto space-y-3 mt-4">
      <Card v-for="(n, i) in normasGenerales" :key="i">
        <CardContent class="flex gap-3 p-4">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-sm text-primary">
            {{ i + 1 }}
          </span>
          <p class="text-sm">{{ n }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Seguridad -->
    <div v-else-if="tab === 'seguridad'" class="flex-1 min-h-0 overflow-y-auto space-y-3 mt-4">
      <Card v-for="(n, i) in normasSeguridad" :key="i">
        <CardContent class="flex gap-3 p-4">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 font-bold text-sm text-amber-700 dark:text-amber-400">
            {{ i + 1 }}
          </span>
          <p class="text-sm">{{ n }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Emergencias -->
    <div v-else-if="tab === 'emergencias'" class="flex-1 min-h-0 overflow-y-auto space-y-4 mt-4">
      <Card v-for="(e, i) in emergencias" :key="i" class="border-destructive/30">
        <CardContent class="p-5">
          <h4 class="mb-3 flex items-center gap-2 font-bold text-destructive">
            {{ e.titulo }}
          </h4>
          <ol class="list-inside list-decimal space-y-2 text-sm">
            <li v-for="(paso, j) in e.pasos" :key="j">{{ paso }}</li>
          </ol>
        </CardContent>
      </Card>
    </div>

    <!-- Kit -->
    <div v-else-if="tab === 'kit'" class="flex-1 min-h-0 overflow-y-auto space-y-3 mt-4">
      <p class="text-sm text-muted-foreground">Obligatorio para ingresar al laboratorio:</p>
      <Card v-for="(k, i) in kitSeguridad" :key="i">
        <CardContent class="flex gap-3 p-4">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-bold text-sm text-emerald-700 dark:text-emerald-400">
            ✓
          </span>
          <p class="text-sm">{{ k }}</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

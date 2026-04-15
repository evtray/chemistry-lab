<script setup>
import LabSimulatorView from '@/components/LabSimulatorView.vue'
</script>

<template>
  <div class="h-full flex flex-col">
    <h1 class="text-xl font-bold shrink-0 mb-4">Laboratorio</h1>
    <p class="text-sm text-muted-foreground shrink-0 mb-4">
      Tabla alcoholimétrica, conversor GE ↔ % etanol y diagrama del azeótropo
    </p>
    <div class="flex-1 min-h-0 overflow-auto">
      <LabSimulatorView />
    </div>
  </div>
</template>

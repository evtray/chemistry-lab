<script setup>
import MedicionesView from '@/components/MedicionesView.vue'
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-bold">Mediciones y Error</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Cifras significativas, error, incertidumbre, densidad y calibración volumétrica.
      </p>
    </div>
    <MedicionesView />
  </div>
</template>

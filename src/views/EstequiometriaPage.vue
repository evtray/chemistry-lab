<script setup>
import EstequiometriaView from '@/components/EstequiometriaView.vue'
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-bold">Estequiometría</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Mol, conversiones, composición porcentual, balanceo de ecuaciones, reactivo limitante y rendimiento.
      </p>
    </div>
    <EstequiometriaView />
  </div>
</template>

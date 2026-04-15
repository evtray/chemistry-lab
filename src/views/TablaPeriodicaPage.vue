<script setup>
import { ref } from 'vue'
import PeriodicTableView from '@/components/PeriodicTableView.vue'
import TablaPeriodicaReversoView from '@/components/TablaPeriodicaReversoView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-bold">Tabla periódica</h1>
      <p class="text-sm text-muted-foreground mt-1">
        Explora los 118 elementos. Filtra por categoría, busca por nombre o símbolo, y visualiza estados de la materia a distintas temperaturas.
      </p>
    </div>

    <Tabs default-value="tabla" class="w-full">
      <TabsList class="mb-4">
        <TabsTrigger value="tabla" class="gap-1.5">
          <span class="text-sm">Tabla</span>
        </TabsTrigger>
        <TabsTrigger value="reverso" class="gap-1.5">
          <span class="text-sm">Reverso / Referencia</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tabla">
        <PeriodicTableView />
      </TabsContent>
      <TabsContent value="reverso">
        <TablaPeriodicaReversoView />
      </TabsContent>
    </Tabs>
  </div>
</template>

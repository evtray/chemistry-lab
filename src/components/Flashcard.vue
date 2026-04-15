<script setup>
import { ref, watch } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const props = defineProps({
  card: Object,
  index: Number,
  total: Number
})

const isFlipped = ref(false)

const flip = () => {
  isFlipped.value = !isFlipped.value
}

// Resetear al cambiar de tarjeta
watch(() => props.card, () => {
  isFlipped.value = false
})
</script>

<template>
  <div
    class="mx-auto w-full max-w-lg cursor-pointer select-none"
    style="perspective: 1000px"
    @click="flip"
  >
    <div
      class="relative min-h-[14rem] w-full transition-transform duration-500"
      style="transform-style: preserve-3d"
      :style="{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
    >
      <Card
        class="absolute inset-0 flex flex-col items-center justify-center border-primary/40 bg-primary/5 p-8 shadow-md"
        style="backface-visibility: hidden"
      >
        <CardContent class="p-0 text-center w-full">
          <Badge variant="secondary" class="mb-4">{{ index + 1 }} / {{ total }}</Badge>
          <p class="text-xl font-semibold leading-relaxed">{{ card?.front }}</p>
          <p class="mt-6 text-sm text-muted-foreground">Toca para ver la respuesta</p>
        </CardContent>
      </Card>
      <Card
        class="absolute inset-0 flex flex-col items-center justify-center border-amber-500/40 bg-amber-500/10 p-8 shadow-md"
        style="backface-visibility: hidden; transform: rotateY(180deg)"
      >
        <CardContent class="p-0 text-center w-full">
          <Badge variant="secondary" class="mb-4">Respuesta</Badge>
          <p class="text-lg leading-relaxed">{{ card?.back }}</p>
          <p class="mt-6 text-sm text-muted-foreground">Toca para volver</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

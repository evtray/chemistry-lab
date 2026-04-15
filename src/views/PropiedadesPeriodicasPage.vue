<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Datos de propiedades periódicas (elementos Z=1-18)
// ──────────────────────────────────────────────
const elementos = [
  { z: 1, sym: 'H', nombre: 'Hidrógeno', grupo: 1, periodo: 1, bloque: 's', pi: 1312, en: 2.20, ae: 72.8, radio: 53, metalico: 0, valencia: 1 },
  { z: 2, sym: 'He', nombre: 'Helio', grupo: 18, periodo: 1, bloque: 's', pi: 2372, en: null, ae: 0, radio: 31, metalico: 0, valencia: 0 },
  { z: 3, sym: 'Li', nombre: 'Litio', grupo: 1, periodo: 2, bloque: 's', pi: 520, en: 0.98, ae: 59.6, radio: 167, metalico: 5, valencia: 1 },
  { z: 4, sym: 'Be', nombre: 'Berilio', grupo: 2, periodo: 2, bloque: 's', pi: 900, en: 1.57, ae: 0, radio: 112, metalico: 4, valencia: 2 },
  { z: 5, sym: 'B', nombre: 'Boro', grupo: 13, periodo: 2, bloque: 'p', pi: 800, en: 2.04, ae: 26.7, radio: 87, metalico: 2, valencia: 3 },
  { z: 6, sym: 'C', nombre: 'Carbono', grupo: 14, periodo: 2, bloque: 'p', pi: 1086, en: 2.55, ae: 121.8, radio: 67, metalico: 1, valencia: 4 },
  { z: 7, sym: 'N', nombre: 'Nitrógeno', grupo: 15, periodo: 2, bloque: 'p', pi: 1402, en: 3.04, ae: 0, radio: 56, metalico: 0, valencia: 3 },
  { z: 8, sym: 'O', nombre: 'Oxígeno', grupo: 16, periodo: 2, bloque: 'p', pi: 1314, en: 3.44, ae: 141, radio: 48, metalico: 0, valencia: 2 },
  { z: 9, sym: 'F', nombre: 'Flúor', grupo: 17, periodo: 2, bloque: 'p', pi: 1681, en: 3.98, ae: 328, radio: 42, metalico: 0, valencia: 1 },
  { z: 10, sym: 'Ne', nombre: 'Neón', grupo: 18, periodo: 2, bloque: 'p', pi: 2081, en: null, ae: 0, radio: 38, metalico: 0, valencia: 0 },
  { z: 11, sym: 'Na', nombre: 'Sodio', grupo: 1, periodo: 3, bloque: 's', pi: 496, en: 0.93, ae: 52.8, radio: 190, metalico: 5, valencia: 1 },
  { z: 12, sym: 'Mg', nombre: 'Magnesio', grupo: 2, periodo: 3, bloque: 's', pi: 738, en: 1.31, ae: 0, radio: 145, metalico: 5, valencia: 2 },
  { z: 13, sym: 'Al', nombre: 'Aluminio', grupo: 13, periodo: 3, bloque: 'p', pi: 577, en: 1.61, ae: 42.5, radio: 118, metalico: 4, valencia: 3 },
  { z: 14, sym: 'Si', nombre: 'Silicio', grupo: 14, periodo: 3, bloque: 'p', pi: 786, en: 1.90, ae: 133.6, radio: 111, metalico: 2, valencia: 4 },
  { z: 15, sym: 'P', nombre: 'Fósforo', grupo: 15, periodo: 3, bloque: 'p', pi: 1011, en: 2.19, ae: 72, radio: 98, metalico: 0, valencia: 3 },
  { z: 16, sym: 'S', nombre: 'Azufre', grupo: 16, periodo: 3, bloque: 'p', pi: 1000, en: 2.58, ae: 200, radio: 88, metalico: 0, valencia: 2 },
  { z: 17, sym: 'Cl', nombre: 'Cloro', grupo: 17, periodo: 3, bloque: 'p', pi: 1251, en: 3.16, ae: 349, radio: 79, metalico: 0, valencia: 1 },
  { z: 18, sym: 'Ar', nombre: 'Argón', grupo: 18, periodo: 3, bloque: 'p', pi: 1520, en: null, ae: 0, radio: 71, metalico: 0, valencia: 0 },
]

const propiedades = [
  { id: 'pi', label: 'Potencial de Ionización', unit: 'kJ/mol', key: 'pi',
    tendGrupo: 'Disminuye ↓', tendPeriodo: 'Aumenta →',
    desc: 'Energía para quitar un e⁻ al átomo. Más electrones de pantalla → menor PI.' },
  { id: 'en', label: 'Electronegatividad', unit: 'Pauling', key: 'en',
    tendGrupo: 'Disminuye ↓', tendPeriodo: 'Aumenta →',
    desc: 'Capacidad de atraer electrones de enlace. Máximo en F (4.0).' },
  { id: 'ae', label: 'Afinidad Electrónica', unit: 'kJ/mol', key: 'ae',
    tendGrupo: 'Disminuye ↓', tendPeriodo: 'Aumenta →',
    desc: 'Energía al ganar un e⁻. Máxima en halógenos.' },
  { id: 'radio', label: 'Radio Atómico', unit: 'pm', key: 'radio',
    tendGrupo: 'Aumenta ↓', tendPeriodo: 'Disminuye →',
    desc: 'Mayor n → mayor radio. Mayor Z* → menor radio.' },
]

const propSeleccionada = ref('pi')
const propInfo = computed(() => propiedades.find(p => p.id === propSeleccionada.value))

const elementoSeleccionado = ref(null)

function valorProp(el) {
  const v = el[propInfo.value.key]
  return v ?? null
}

function maxVal() {
  return Math.max(...elementos.map(e => valorProp(e) ?? 0))
}

function barColor(el) {
  const bloques = { s: 'bg-blue-500', p: 'bg-green-500', d: 'bg-orange-500', f: 'bg-purple-500' }
  return bloques[el.bloque] || 'bg-muted-foreground'
}

function barWidth(el) {
  const v = valorProp(el)
  if (v === null) return '0%'
  return `${(v / maxVal()) * 100}%`
}

// ──────────────────────────────────────────────
// Quiz de tendencias
// ──────────────────────────────────────────────
const preguntas = [
  { texto: '¿Cuál tiene mayor potencial de ionización?', opciones: ['Li', 'Na', 'K'], correcta: 'Li', hint: 'El PI disminuye al bajar en el grupo: menos carga nuclear efectiva.' },
  { texto: '¿Cuál es más electronegativo?', opciones: ['F', 'Cl', 'Br'], correcta: 'F', hint: 'F es el elemento más electronegativo de la tabla periódica (4.0 Pauling).' },
  { texto: '¿Cuál tiene mayor radio atómico?', opciones: ['Li', 'Na', 'K'], correcta: 'K', hint: 'El radio aumenta al bajar en el grupo (mayor n).' },
  { texto: '¿Cuál tiene mayor PI en el período 2?', opciones: ['Li', 'B', 'Ne'], correcta: 'Ne', hint: 'Los gases nobles tienen el PI más alto de su período.' },
  { texto: '¿Cuál tiene menor radio en el período 3?', opciones: ['Na', 'Cl', 'Ar'], correcta: 'Cl', hint: 'El radio disminuye al avanzar en el período. Ar es gas noble con datos diferentes.' },
  { texto: '¿Cuál tiene mayor afinidad electrónica?', opciones: ['Cl', 'Ar', 'Na'], correcta: 'Cl', hint: 'Los halógenos tienen altísima AE. Ar (gas noble) tiene AE ≈ 0.' },
  { texto: '¿Cuál tiene mayor carácter metálico?', opciones: ['Na', 'Mg', 'Al'], correcta: 'Na', hint: 'El carácter metálico disminuye al avanzar en el período.' },
  { texto: 'El potencial de ionización al avanzar en un período (izq→der)...', opciones: ['Aumenta', 'Disminuye', 'No cambia'], correcta: 'Aumenta', hint: 'Mayor Z efectivo → más difícil quitar e⁻ → mayor PI.' },
]

const qIdx = ref(0)
const qRespuesta = ref(null)
const qScore = ref(0)
const qShuffled = ref([...preguntas].sort(() => Math.random() - 0.5))
const qTerminado = computed(() => qIdx.value >= qShuffled.value.length)
const qActual = computed(() => qShuffled.value[qIdx.value])

function responder(opcion) {
  if (qRespuesta.value !== null) return
  qRespuesta.value = opcion
  if (opcion === qActual.value.correcta) qScore.value++
  setTimeout(() => { qIdx.value++; qRespuesta.value = null }, 1500)
}

function reiniciarQuiz() {
  qShuffled.value = [...preguntas].sort(() => Math.random() - 0.5)
  qIdx.value = 0; qRespuesta.value = null; qScore.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Propiedades Periódicas</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 3 — Tendencias del sistema periódico</p>
    </div>

    <Tabs default-value="visualizador">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="visualizador">Visualizador</TabsTrigger>
        <TabsTrigger value="quiz">Quiz de Tendencias</TabsTrigger>
        <TabsTrigger value="referencia">Tabla de Referencia</TabsTrigger>
      </TabsList>

      <!-- ── VISUALIZADOR ── -->
      <TabsContent value="visualizador" class="mt-4 space-y-4">
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="text-sm">Selecciona una propiedad</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="p in propiedades"
                :key="p.id"
                :variant="propSeleccionada === p.id ? 'default' : 'outline'"
                size="sm"
                @click="propSeleccionada = p.id"
              >
                {{ p.label }}
              </Button>
            </div>

            <div v-if="propInfo" class="bg-muted/40 rounded p-3 text-sm">
              <div class="flex gap-4 flex-wrap">
                <span><span class="font-medium">Grupo:</span> {{ propInfo.tendGrupo }}</span>
                <span><span class="font-medium">Período:</span> {{ propInfo.tendPeriodo }}</span>
              </div>
              <p class="text-muted-foreground mt-1 text-xs">{{ propInfo.desc }}</p>
            </div>

            <!-- Barras -->
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground font-medium">Z=1 a Z=18 (períodos 1, 2 y 3)</p>
              <div class="space-y-1">
                <div
                  v-for="el in elementos"
                  :key="el.z"
                  class="flex items-center gap-2 cursor-pointer group"
                  @click="elementoSeleccionado = el.z === elementoSeleccionado ? null : el.z"
                >
                  <span class="w-5 text-xs text-muted-foreground text-right shrink-0">{{ el.z }}</span>
                  <span class="w-6 text-xs font-bold font-mono shrink-0" :class="{'text-primary': elementoSeleccionado === el.z}">{{ el.sym }}</span>
                  <div class="flex-1 bg-muted rounded h-5 overflow-hidden">
                    <div
                      class="h-full rounded transition-all duration-300"
                      :class="barColor(el)"
                      :style="{ width: barWidth(el) }"
                    />
                  </div>
                  <span class="w-16 text-xs text-right font-mono shrink-0">
                    {{ valorProp(el) !== null ? `${valorProp(el)} ${propInfo.unit}` : 'N/D' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detalle del elemento seleccionado -->
            <Card v-if="elementoSeleccionado" class="border-primary/40 bg-primary/5">
              <CardContent class="pt-4 pb-3">
                <div class="flex items-start gap-4">
                  <div class="text-center">
                    <p class="text-3xl font-bold text-primary">{{ elementos.find(e => e.z === elementoSeleccionado)?.sym }}</p>
                    <p class="text-xs text-muted-foreground">Z = {{ elementoSeleccionado }}</p>
                  </div>
                  <div class="flex-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p><span class="text-muted-foreground">Nombre:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.nombre }}</p>
                    <p><span class="text-muted-foreground">Bloque:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.bloque }}</p>
                    <p><span class="text-muted-foreground">Grupo:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.grupo }}</p>
                    <p><span class="text-muted-foreground">Período:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.periodo }}</p>
                    <p><span class="text-muted-foreground">PI:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.pi }} kJ/mol</p>
                    <p><span class="text-muted-foreground">EN:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.en ?? 'N/D' }}</p>
                    <p><span class="text-muted-foreground">AE:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.ae }} kJ/mol</p>
                    <p><span class="text-muted-foreground">Radio:</span> {{ elementos.find(e => e.z === elementoSeleccionado)?.radio }} pm</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div class="flex gap-3 flex-wrap text-xs">
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-blue-500 inline-block"></span> Bloque s</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-500 inline-block"></span> Bloque p</span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Pon a prueba tu comprensión de las tendencias periódicas.</p>

        <div v-if="!qTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qRespuesta !== null && qRespuesta === qActual.correcta,
            'border-red-400': qRespuesta !== null && qRespuesta !== qActual.correcta,
            'border-border': qRespuesta === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ qIdx + 1 }} / {{ qShuffled.length }}</Badge>
                <span class="text-sm font-medium text-muted-foreground">✓ {{ qScore }}</span>
              </div>
              <CardTitle class="text-base mt-2">{{ qActual.texto }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="grid grid-cols-3 gap-2">
                <Button
                  v-for="op in qActual.opciones"
                  :key="op"
                  :variant="qRespuesta === op
                    ? (op === qActual.correcta ? 'default' : 'destructive')
                    : qRespuesta !== null && op === qActual.correcta
                      ? 'default' : 'outline'"
                  :disabled="qRespuesta !== null"
                  class="h-12 font-mono"
                  @click="responder(op)"
                >
                  {{ op }}
                </Button>
              </div>
              <p v-if="qRespuesta !== null" class="text-sm mt-2 border-l-2 pl-2"
                :class="qRespuesta === qActual.correcta ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="qRespuesta === qActual.correcta">✓ Correcto. </span>
                <span v-else>✗ La respuesta era <strong>{{ qActual.correcta }}</strong>. </span>
                {{ qActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qScore / qShuffled.length >= 0.75 ? 'text-green-600' : 'text-orange-500'">
              {{ qScore }} / {{ qShuffled.length }}
            </p>
            <p class="text-muted-foreground">{{ qScore / qShuffled.length >= 0.75 ? '¡Dominas las tendencias!' : 'Repasa el visualizador y vuelve a intentarlo.' }}</p>
            <Button @click="reiniciarQuiz" class="gap-2"><RotateCcw class="size-4" />Reintentar</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── REFERENCIA ── -->
      <TabsContent value="referencia" class="mt-4">
        <div class="overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="text-left py-2 px-3 font-medium">Propiedad</th>
                <th class="text-center py-2 px-3 font-medium">Unidad</th>
                <th class="text-center py-2 px-3 font-medium">↓ Grupo</th>
                <th class="text-center py-2 px-3 font-medium">→ Período</th>
                <th class="text-left py-2 px-3 font-medium hidden md:table-cell">Razón</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="p in propiedades" :key="p.id" class="hover:bg-muted/30">
                <td class="py-2 px-3 font-medium">{{ p.label }}</td>
                <td class="py-2 px-3 text-center font-mono text-xs">{{ p.unit }}</td>
                <td class="py-2 px-3 text-center text-sm">{{ p.tendGrupo }}</td>
                <td class="py-2 px-3 text-center text-sm">{{ p.tendPeriodo }}</td>
                <td class="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell">{{ p.desc }}</td>
              </tr>
              <tr class="hover:bg-muted/30">
                <td class="py-2 px-3 font-medium">Radio Atómico</td>
                <td class="py-2 px-3 text-center font-mono text-xs">pm</td>
                <td class="py-2 px-3 text-center text-sm">Aumenta ↓</td>
                <td class="py-2 px-3 text-center text-sm">Disminuye →</td>
                <td class="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell">Mayor n → mayor radio; Mayor Z* → menor radio</td>
              </tr>
              <tr class="hover:bg-muted/30">
                <td class="py-2 px-3 font-medium">Carácter Metálico</td>
                <td class="py-2 px-3 text-center font-mono text-xs">—</td>
                <td class="py-2 px-3 text-center text-sm">Aumenta ↓</td>
                <td class="py-2 px-3 text-center text-sm">Disminuye →</td>
                <td class="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell">Tendencia a perder e⁻ — metales en izquierda/abajo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

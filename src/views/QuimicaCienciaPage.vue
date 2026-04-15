<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-vue-next'

// ──────────────────────────────────────────────
// Línea del tiempo histórica
// ──────────────────────────────────────────────
const hitos = [
  { epoca: 'Antigüedad (~3500 a.C.)', evento: 'Alquimia egipcia y mesopotámica', desc: 'Metalurgia, tintes, perfumes. Búsqueda de la piedra filosofal (oro) y el elixir de la vida. Sin método sistemático.', color: 'border-yellow-400' },
  { epoca: '~400 a.C.', evento: 'Filósofos griegos — Teoría de los 4 elementos', desc: 'Demócrito propone el átomo (ἄτομον = indivisible). Aristóteles plantea tierra, agua, aire y fuego como elementos fundamentales.', color: 'border-amber-400' },
  { epoca: 'Siglo XVII', evento: 'Robert Boyle — "La Química como ciencia"', desc: '"The Sceptical Chymist" (1661): separa la química de la alquimia. Define elemento como sustancia que no puede descomponerse más. Ley de Boyle (1662).', color: 'border-blue-400' },
  { epoca: 'Siglo XVIII', evento: 'Antoine Lavoisier — Revolución Química', desc: 'Ley de conservación de la masa. Nomenclatura química sistemática. Identifica O₂ y H como elementos. Tabla de 33 elementos. Usa balanza para medir.', color: 'border-green-400' },
  { epoca: '1803', evento: 'John Dalton — Teoría atómica', desc: 'Los átomos son esferas sólidas e indivisibles. Cada elemento tiene átomos de masa característica. Leyes de proporciones definidas y múltiples.', color: 'border-purple-400' },
  { epoca: '1869', evento: 'Mendeleev — Tabla Periódica', desc: 'Organiza 63 elementos por masa atómica y propiedades similares. Predice elementos no descubiertos (Ga, Ge, Sc). Revoluciona la clasificación química.', color: 'border-indigo-400' },
  { epoca: 'Siglo XX', evento: 'Química Moderna', desc: 'Mecánica cuántica (Schrödinger, Heisenberg). Descubrimiento del electrón (Thomson), protón (Rutherford), neutrón (Chadwick). Síntesis de plásticos, fármacos y materiales avanzados.', color: 'border-pink-400' },
  { epoca: 'Actualidad', evento: 'Química del Siglo XXI', desc: 'Nanotecnología, bioquímica computacional, química verde (sostenible), materiales semiconductores, edición genética (CRISPR). Interdisciplinaria por naturaleza.', color: 'border-teal-400' },
]

// ──────────────────────────────────────────────
// Ramas de la química
// ──────────────────────────────────────────────
const ramas = [
  { nombre: 'Química Orgánica', desc: 'Estudio de compuestos de carbono (excepto CO, CO₂, carbonatos). Base de la química de la vida, plásticos, fármacos y combustibles.', ejemplos: 'Alcoholes, ácidos grasos, proteínas, medicamentos' },
  { nombre: 'Química Inorgánica', desc: 'Estudio de compuestos que no contienen C-H. Incluye metales, sales, óxidos y minerales.', ejemplos: 'NaCl, H₂SO₄, Fe₂O₃, semiconductores' },
  { nombre: 'Química Física', desc: 'Aplica principios de física (termodinámica, mecánica cuántica) a sistemas químicos. Estudia energía, velocidad y estructura de reacciones.', ejemplos: 'Cinética, termodinámica química, espectroscopía' },
  { nombre: 'Bioquímica', desc: 'Química de los procesos biológicos. Estudia proteínas, ADN, enzimas, metabolismo.', ejemplos: 'Síntesis de proteínas, respiración celular, fotosíntesis' },
  { nombre: 'Química Analítica', desc: 'Determina la composición (qué) y cantidad (cuánto) de sustancias en una muestra.', ejemplos: 'Cromatografía, espectroscopía, titulaciones' },
  { nombre: 'Química Industrial', desc: 'Aplica principios químicos a procesos de producción a gran escala de manera segura y económica.', ejemplos: 'Proceso Haber (NH₃), refinación de petróleo, síntesis de polímeros' },
]

// ──────────────────────────────────────────────
// Método científico — pasos interactivos
// ──────────────────────────────────────────────
const pasoActivo = ref(null)
const pasos = [
  { n: 1, nombre: 'Observación', desc: 'Recopilación de datos cualitativos y cuantitativos mediante los sentidos o instrumentos. Debe ser objetiva y reproducible.', ejemplo: '"El agua hierve a menor temperatura en la montaña."' },
  { n: 2, nombre: 'Planteamiento del problema', desc: 'Formulación de una pregunta específica, medible y relevante que guíe la investigación.', ejemplo: '"¿Afecta la altitud al punto de ebullición del agua?"' },
  { n: 3, nombre: 'Hipótesis', desc: 'Explicación tentativa y verificable de la observación. Debe expresarse como predicción: "Si… entonces…"', ejemplo: '"Si aumenta la altitud, la presión disminuye y el agua hierve a menor temperatura."' },
  { n: 4, nombre: 'Diseño experimental', desc: 'Planificación del experimento: variables (independiente, dependiente, controladas), materiales, procedimiento y controles.', ejemplo: 'Medir T_ebullición del agua a distintas altitudes manteniendo constante la pureza del agua.' },
  { n: 5, nombre: 'Experimentación', desc: 'Ejecución del experimento, recopilación de datos, control de variables y repetición para verificar reproducibilidad.', ejemplo: 'Registrar T_ebullición en 5 ciudades a distintas elevaciones, 3 repeticiones cada una.' },
  { n: 6, nombre: 'Análisis de datos', desc: 'Organización, cálculo estadístico, construcción de gráficas y tablas. Identificación de patrones y tendencias.', ejemplo: 'Gráfica: Altitud (m) vs. T_ebullición (°C). Se observa relación lineal inversa.' },
  { n: 7, nombre: 'Conclusión', desc: 'Aceptación o rechazo de la hipótesis basada en los datos. Discusión de errores, limitaciones y nuevas preguntas.', ejemplo: '"La hipótesis se confirma: cada 300 m de altitud, T_ebullición baja ~1°C."' },
  { n: 8, nombre: 'Comunicación', desc: 'Publicación en revistas científicas con revisión por pares. Permite que otros repitan el experimento y validen los resultados.', ejemplo: 'Artículo en Journal of Chemical Education con datos y metodología completa.' },
]

// ──────────────────────────────────────────────
// Quiz
// ──────────────────────────────────────────────
const preguntas = [
  { texto: '¿Qué estudia la química?', opciones: ['El movimiento de los planetas', 'La composición, estructura y transformaciones de la materia', 'Los seres vivos y sus procesos', 'La energía eléctrica'], correcta: 'La composición, estructura y transformaciones de la materia', hint: 'Química = ciencia de la materia (composición, estructura, propiedades, cambios).' },
  { texto: '¿Quién es considerado el "padre de la química moderna"?', opciones: ['Dalton', 'Boyle', 'Lavoisier', 'Mendeleev'], correcta: 'Lavoisier', hint: 'Lavoisier estableció la ley de conservación de masa y la nomenclatura química sistematica.' },
  { texto: '¿Cuál es el orden correcto del método científico?', opciones: ['Hipótesis → Observación → Experimento', 'Observación → Hipótesis → Experimento → Conclusión', 'Conclusión → Hipótesis → Experimento', 'Experimento → Observación → Hipótesis'], correcta: 'Observación → Hipótesis → Experimento → Conclusión', hint: 'Siempre comienza con la observación de un fenómeno.' },
  { texto: 'Una ley científica:', opciones: ['Explica el por qué de los fenómenos', 'Describe un patrón observado repetidamente sin explicarlo', 'Es lo mismo que una hipótesis', 'Solo aplica en laboratorio'], correcta: 'Describe un patrón observado repetidamente sin explicarlo', hint: 'Ley: describe el "qué". Teoría: explica el "por qué".' },
  { texto: '¿Cuál rama de la química estudia los compuestos de carbono?', opciones: ['Química Inorgánica', 'Química Orgánica', 'Química Analítica', 'Química Nuclear'], correcta: 'Química Orgánica', hint: 'Orgánica = compuestos C-H. Base de la química de la vida y materiales.' },
  { texto: 'Mendeleev organizó la tabla periódica principalmente por:', opciones: ['Número de neutrones', 'Masa atómica y propiedades similares', 'Radio atómico', 'Electronegatividad'], correcta: 'Masa atómica y propiedades similares', hint: 'Mendeleev (1869) ordenó los 63 elementos conocidos por masa atómica, agrupando los de propiedades similares en columnas.' },
  { texto: 'La alquimia es diferente de la química porque:', opciones: ['Usaba más reactivos', 'No tenía método sistemático ni base experimental rigurosa', 'Solo estudiaba metales', 'Era más precisa'], correcta: 'No tenía método sistemático ni base experimental rigurosa', hint: 'La alquimia buscaba objetivos mágicos (oro, elixir). La química usa el método científico.' },
]

const qIdx = ref(0)
const qResp = ref(null)
const qScore = ref(0)
const qShuffled = ref([...preguntas].sort(() => Math.random() - 0.5))
const qTerminado = computed(() => qIdx.value >= qShuffled.value.length)
const qActual = computed(() => qShuffled.value[qIdx.value])

import { computed } from 'vue'

function responder(op) {
  if (qResp.value !== null) return
  qResp.value = op
  if (op === qActual.value.correcta) qScore.value++
  setTimeout(() => { qIdx.value++; qResp.value = null }, 1600)
}
function reiniciar() {
  qShuffled.value = [...preguntas].sort(() => Math.random() - 0.5)
  qIdx.value = 0; qResp.value = null; qScore.value = 0
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-xl font-bold">Química como Ciencia</h1>
      <p class="text-sm text-muted-foreground mt-1">Unidad 1.1 — Método científico, historia y relación con otras ciencias</p>
    </div>

    <Tabs default-value="historia">
      <TabsList class="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="historia">Historia</TabsTrigger>
        <TabsTrigger value="metodo">Método Científico</TabsTrigger>
        <TabsTrigger value="ramas">Ramas y Relaciones</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
      </TabsList>

      <!-- ── HISTORIA ── -->
      <TabsContent value="historia" class="mt-4 space-y-3">
        <p class="text-sm text-muted-foreground">La química ha evolucionado durante miles de años, desde la alquimia hasta la ciencia moderna.</p>
        <div class="relative">
          <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
          <div class="space-y-4">
            <div v-for="hito in hitos" :key="hito.epoca" class="relative pl-12">
              <div class="absolute left-2.5 top-2 size-3 rounded-full border-2 border-primary bg-background" />
              <Card :class="['border-l-4', hito.color]">
                <CardHeader class="pb-1 pt-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" class="font-mono text-xs">{{ hito.epoca }}</Badge>
                    <CardTitle class="text-sm">{{ hito.evento }}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent class="pb-3">
                  <p class="text-sm text-muted-foreground">{{ hito.desc }}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- ── MÉTODO CIENTÍFICO ── -->
      <TabsContent value="metodo" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">Haz clic en cada paso para ver el detalle y un ejemplo.</p>
        <div class="grid gap-2 sm:grid-cols-2">
          <button
            v-for="paso in pasos"
            :key="paso.n"
            class="text-left rounded border p-3 hover:border-primary/50 transition-all"
            :class="pasoActivo === paso.n ? 'border-primary bg-primary/5' : ''"
            @click="pasoActivo = pasoActivo === paso.n ? null : paso.n"
          >
            <div class="flex items-center gap-2">
              <div class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {{ paso.n }}
              </div>
              <span class="font-semibold text-sm">{{ paso.nombre }}</span>
            </div>
            <div v-if="pasoActivo === paso.n" class="mt-2 space-y-2 border-t pt-2">
              <p class="text-sm text-muted-foreground">{{ paso.desc }}</p>
              <p class="text-xs bg-muted rounded p-2 italic">"{{ paso.ejemplo }}"</p>
            </div>
          </button>
        </div>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Hipótesis vs Ley vs Teoría</CardTitle>
          </CardHeader>
          <CardContent class="overflow-x-auto">
            <table class="w-full text-sm border-collapse">
              <thead><tr class="border-b bg-muted/40">
                <th class="text-left py-2 px-3">Concepto</th>
                <th class="text-left py-2 px-3">Definición</th>
                <th class="text-left py-2 px-3 hidden sm:table-cell">Ejemplo</th>
              </tr></thead>
              <tbody class="divide-y">
                <tr><td class="py-2 px-3 font-medium">Hipótesis</td><td class="py-2 px-3 text-muted-foreground text-xs">Explicación tentativa, verificable</td><td class="py-2 px-3 text-muted-foreground text-xs hidden sm:table-cell">"Si aumento T, la reacción es más rápida"</td></tr>
                <tr><td class="py-2 px-3 font-medium">Ley</td><td class="py-2 px-3 text-muted-foreground text-xs">Describe un patrón, no lo explica</td><td class="py-2 px-3 text-muted-foreground text-xs hidden sm:table-cell">Ley de Boyle: PV = constante</td></tr>
                <tr><td class="py-2 px-3 font-medium">Teoría</td><td class="py-2 px-3 text-muted-foreground text-xs">Explica el "por qué", ampliamente respaldada</td><td class="py-2 px-3 text-muted-foreground text-xs hidden sm:table-cell">Teoría atómica, Teoría cinética de los gases</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── RAMAS Y RELACIONES ── -->
      <TabsContent value="ramas" class="mt-4 space-y-4">
        <p class="text-sm text-muted-foreground">La química es interdisciplinaria y se conecta con casi todas las ciencias.</p>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="rama in ramas" :key="rama.nombre">
            <CardHeader class="pb-1">
              <CardTitle class="text-sm">{{ rama.nombre }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-1">
              <p class="text-sm text-muted-foreground">{{ rama.desc }}</p>
              <p class="text-xs font-medium text-muted-foreground">Aplicaciones: <span class="italic">{{ rama.ejemplos }}</span></p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Química y su relación con otras ciencias</CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-2">
            <div v-for="rel in [
              { ciencia: 'Física', relacion: 'Termodinámica, mecánica cuántica, espectroscopía, electrónica.' },
              { ciencia: 'Biología', relacion: 'Bioquímica: procesos metabólicos, ADN, proteínas, enzimas.' },
              { ciencia: 'Medicina', relacion: 'Fármacos, diagnóstico, toxicología, nutrición.' },
              { ciencia: 'Ingeniería', relacion: 'Materiales, procesos industriales, corrosión, energía.' },
              { ciencia: 'Geología', relacion: 'Mineralogía, geoquímica, recursos naturales.' },
              { ciencia: 'Astronomía', relacion: 'Composición de estrellas, atmósferas planetarias (espectroscopía).' },
            ]" :key="rel.ciencia" class="flex gap-2 items-start">
              <Badge variant="secondary" class="shrink-0 text-xs">{{ rel.ciencia }}</Badge>
              <span class="text-muted-foreground text-xs">{{ rel.relacion }}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardTitle class="text-sm">Química Moderna — Áreas de impacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm">
              <div v-for="area in ['Nanomateriales', 'Polímeros', 'Semiconductores', 'Fármacos', 'Química verde', 'Biocombustibles', 'Superconductores', 'Biotecnología']"
                :key="area" class="bg-muted rounded p-2 text-xs font-medium">{{ area }}</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- ── QUIZ ── -->
      <TabsContent value="quiz" class="mt-4 space-y-4">
        <div v-if="!qTerminado">
          <Card class="border-2" :class="{
            'border-green-400': qResp !== null && qResp === qActual.correcta,
            'border-red-400': qResp !== null && qResp !== qActual.correcta,
            'border-border': qResp === null
          }">
            <CardHeader class="pb-2">
              <div class="flex items-center justify-between">
                <Badge variant="outline">{{ qIdx + 1 }} / {{ qShuffled.length }}</Badge>
                <span class="text-sm text-muted-foreground">✓ {{ qScore }}</span>
              </div>
              <CardTitle class="text-base mt-2">{{ qActual.texto }}</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <div class="flex flex-col gap-2">
                <Button
                  v-for="op in qActual.opciones" :key="op"
                  :variant="qResp === op ? (op === qActual.correcta ? 'default' : 'destructive') : qResp !== null && op === qActual.correcta ? 'default' : 'outline'"
                  :disabled="qResp !== null"
                  class="justify-start text-sm h-auto py-2 text-left whitespace-normal"
                  @click="responder(op)"
                >{{ op }}</Button>
              </div>
              <p v-if="qResp !== null" class="text-sm border-l-2 pl-2 mt-2"
                :class="qResp === qActual.correcta ? 'text-green-600 border-green-400' : 'text-red-600 border-red-400'">
                <span v-if="qResp === qActual.correcta">✓ </span><span v-else>✗ Era: <strong>{{ qActual.correcta }}</strong>. </span>
                {{ qActual.hint }}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card v-else>
          <CardContent class="pt-8 pb-8 text-center space-y-4">
            <p class="text-4xl font-bold" :class="qScore / qShuffled.length >= 0.7 ? 'text-green-600' : 'text-orange-500'">
              {{ qScore }} / {{ qShuffled.length }}
            </p>
            <Button @click="reiniciar" class="gap-2"><RotateCcw class="size-4" />Reintentar</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
